// Local-Only Personal Student Productivity Store (Zero external DB, zero login, JSON Backup/Restore)
const STUDENT_DATA_KEY = 'sk2_student_platform_v1';

const DEFAULT_STUDENT_DATA = {
  schemaVersion: 1,
  dailyStudyTargetMinutes: 180,
  dashboardWidgets: {
    visitorCount: true,
    nextExam: true,
    todayOverview: true,
    weeklyProgress: true,
    quickTools: true,
    recentTools: true,
    achievements: true
  },
  recentTools: [],
  studyPlans: [],        // { id, title, subject, topic, date, startTime, durationMin, priority, recurring, completed, createdAt }
  todos: [],             // { id, title, description, category, deadline, priority, completed, completedAt, createdAt }
  syllabus: [],          // { id, subject, chapters: [{ id, name, topics: [{ id, name, status, difficult, priority, revisions, notes }] }] }
  focusSessions: [],     // { id, subject, minutes, mode, completedAt, dateStr }
  revisions: [],         // { id, subject, topic, nextDate, difficult, completedCount, history: [], lastRevised }
  notes: [],             // { id, title, content, subject, tags, pinned, updatedAt }
  flashcards: [],        // { id, front, back, subject, rating, nextReview, reviewsCount }
  bookmarks: [],         // { id, title, url, category, tags, pinned, createdAt }
  quizHistory: [],       // { id, dateStr, subject, score, total, pct, isDaily }
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: null,
    activeDates: []
  },
  notifications: [],     // { id, title, body, type, read, createdAt }
  readiness: {
    examId: 'neet-ug-2027',
    mockScores: [],      // { id, label, pct, dateStr }
    examDayInstructions: '',
    examDayChecklist: [
      { id: 'chk-1', text: 'Admit Card printed (2 copies)', done: false },
      { id: 'chk-2', text: 'Original Government Photo ID', done: false },
      { id: 'chk-3', text: 'Passport-size photographs', done: false },
      { id: 'chk-4', text: 'Transparent water bottle & pens', done: false }
    ],
    customPriorities: {} // { [examId]: 1..3 }
  }
};

function getISTDateString(dateObj = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(dateObj);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

function addDaysIST(dateStr, deltaDays) {
  const base = Date.parse(`${dateStr}T12:00:00+05:30`);
  if (Number.isNaN(base)) return getISTDateString();
  return getISTDateString(new Date(base + deltaDays * 86400000));
}

function deepMergeDefaults(defaults, saved) {
  if (!saved || typeof saved !== 'object') return JSON.parse(JSON.stringify(defaults));
  const out = JSON.parse(JSON.stringify(defaults));
  for (const key of Object.keys(defaults)) {
    if (saved[key] === undefined) continue;
    if (Array.isArray(defaults[key])) {
      out[key] = Array.isArray(saved[key]) ? saved[key] : defaults[key];
    } else if (defaults[key] && typeof defaults[key] === 'object') {
      out[key] = Object.assign({}, defaults[key], saved[key]);
    } else {
      out[key] = saved[key];
    }
  }
  return out;
}

const StudentStore = {
  data: null,
  storageError: false,

  init() {
    try {
      const raw = window.localStorage.getItem(STUDENT_DATA_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      this.data = deepMergeDefaults(DEFAULT_STUDENT_DATA, parsed);
      this.storageError = false;
    } catch {
      this.data = JSON.parse(JSON.stringify(DEFAULT_STUDENT_DATA));
      this.storageError = true;
    }
    return this.data;
  },

  get() {
    if (!this.data) this.init();
    return this.data;
  },

  save() {
    try {
      window.localStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(this.get()));
      this.storageError = false;
      return true;
    } catch {
      this.storageError = true;
      if (typeof showToast === 'function') {
        showToast('Storage full or unavailable — export a backup in Privacy & Data.');
      }
      return false;
    }
  },

  recordRecentTool(path, label) {
    const d = this.get();
    d.recentTools = [{ path, label }, ...d.recentTools.filter((x) => x.path !== path)].slice(0, 6);
    this.save();
  },

  recordStudyActivity() {
    const d = this.get();
    const today = getISTDateString();
    const yesterday = addDaysIST(today, -1);
    if (!d.streak.activeDates.includes(today)) {
      d.streak.activeDates = [today, ...d.streak.activeDates].slice(0, 90);
      if (d.streak.lastActiveDate === yesterday) {
        d.streak.current += 1;
      } else if (d.streak.lastActiveDate !== today) {
        d.streak.current = 1;
      }
      d.streak.lastActiveDate = today;
      d.streak.longest = Math.max(d.streak.longest, d.streak.current);
      this.save();
    }
  },

  addNotification(title, body, type = 'info') {
    const d = this.get();
    d.notifications.unshift({
      id: `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title,
      body,
      type,
      read: false,
      createdAt: new Date().toISOString()
    });
    d.notifications = d.notifications.slice(0, 60);
    this.save();
  },

  getTodayFocusMinutes() {
    const today = getISTDateString();
    return this.get().focusSessions
      .filter((s) => s.dateStr === today)
      .reduce((acc, s) => acc + (Number(s.minutes) || 0), 0);
  },

  getWeeklyFocusByDay() {
    const today = getISTDateString();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const ds = addDaysIST(today, -i);
      const mins = this.get().focusSessions
        .filter((s) => s.dateStr === ds)
        .reduce((acc, s) => acc + (Number(s.minutes) || 0), 0);
      days.push({ dateStr: ds, label: ds.slice(5), minutes: mins });
    }
    return days;
  },

  getSyllabusStats() {
    const subjects = this.get().syllabus;
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let revisions = 0;
    const perSubject = subjects.map((sub) => {
      let sTotal = 0;
      let sDone = 0;
      (sub.chapters || []).forEach((ch) => {
        (ch.topics || []).forEach((tp) => {
          sTotal++;
          total++;
          if (tp.status === 'completed') { sDone++; completed++; }
          else if (tp.status === 'in-progress') inProgress++;
          revisions += Number(tp.revisions || 0);
        });
      });
      return {
        id: sub.id,
        subject: sub.subject,
        total: sTotal,
        completed: sDone,
        pct: sTotal ? Math.round((sDone / sTotal) * 100) : 0
      };
    });
    return {
      total,
      completed,
      inProgress,
      pending: Math.max(0, total - completed),
      revisions,
      pct: total ? Math.round((completed / total) * 100) : 0,
      perSubject
    };
  },

  getAchievements() {
    const d = this.get();
    const doneTasks = d.todos.filter((x) => x.completed).length;
    const totalFocusMin = d.focusSessions.reduce((a, b) => a + (Number(b.minutes) || 0), 0);
    const syl = this.getSyllabusStats();
    const quizzes = d.quizHistory.length;
    const bestQuiz = d.quizHistory.reduce((m, q) => Math.max(m, q.pct || 0), 0);

    return [
      { id: 'first-task', title: 'First Step', desc: 'Complete your first To-Do task', unlocked: doneTasks >= 1, progress: `${Math.min(doneTasks, 1)}/1` },
      { id: 'task-10', title: 'Task Finisher', desc: 'Complete 10 study tasks', unlocked: doneTasks >= 10, progress: `${Math.min(doneTasks, 10)}/10` },
      { id: 'streak-3', title: '3-Day Momentum', desc: 'Maintain a 3-day study streak', unlocked: d.streak.longest >= 3, progress: `${Math.min(d.streak.longest, 3)}/3` },
      { id: 'streak-7', title: 'Weekly Warrior', desc: 'Maintain a 7-day study streak', unlocked: d.streak.longest >= 7, progress: `${Math.min(d.streak.longest, 7)}/7` },
      { id: 'focus-60', title: 'Deep Focus Hour', desc: 'Log 60 minutes in Focus Timer', unlocked: totalFocusMin >= 60, progress: `${Math.min(totalFocusMin, 60)}/60 min` },
      { id: 'focus-300', title: 'Focus Master', desc: 'Log 5 hours in Focus Timer', unlocked: totalFocusMin >= 300, progress: `${Math.min(totalFocusMin, 300)}/300 min` },
      { id: 'syl-50', title: 'Halfway Syllabus', desc: 'Reach 50% syllabus completion', unlocked: syl.total > 0 && syl.pct >= 50, progress: `${syl.pct}%` },
      { id: 'quiz-ace', title: 'Quiz Challenger', desc: 'Score 80%+ in a practice quiz', unlocked: quizzes > 0 && bestQuiz >= 80, progress: `${bestQuiz}%` }
    ];
  },

  exportAllJson() {
    return JSON.stringify({
      app: 'SK EXAMS COUNTDOWN',
      exportedAt: new Date().toISOString(),
      settings: Store.getSettings(),
      favourites: Store.favourites,
      customCountdowns: Store.getCustoms(),
      studentData: this.get()
    }, null, 2);
  },

  importAllJson(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object' || !parsed.studentData) {
      throw new Error('Invalid SK EXAMS COUNTDOWN backup file.');
    }
    if (parsed.settings && typeof parsed.settings === 'object') {
      Store.updateSettings(parsed.settings);
    }
    if (Array.isArray(parsed.favourites)) {
      Store.favourites = parsed.favourites;
      window.localStorage.setItem('sk2_favourites', JSON.stringify(Store.favourites));
    }
    if (Array.isArray(parsed.customCountdowns)) {
      Store.customs = parsed.customCountdowns;
      window.localStorage.setItem('sk2_custom_countdowns', JSON.stringify(Store.customs));
    }
    this.data = deepMergeDefaults(DEFAULT_STUDENT_DATA, parsed.studentData);
    this.save();
    return true;
  },

  clearPersonalData() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STUDENT_DATA));
    this.save();
    Store.clearSavedData();
  },

  getStorageUsageKB() {
    try {
      let bytes = 0;
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        const v = window.localStorage.getItem(k) || '';
        bytes += (k.length + v.length) * 2;
      }
      return (bytes / 1024).toFixed(1);
    } catch {
      return '0.0';
    }
  }
};
