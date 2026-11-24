// Real-time Countdown Timer, Reminders, Sound, Share & Fullscreen Controller
const CountdownController = {
  timerId: null,
  lastSec: -1,
  lastValues: { d: '', h: '', m: '', s: '' },

  start(exam) {
    this.stop();
    if (!exam || !exam.date) return;
    const effectiveStatus = ExamDB.getEffectiveStatus(exam);
    if (effectiveStatus === 'postponed' || effectiveStatus === 'cancelled' || effectiveStatus === 'date-awaited') {
      return;
    }

    const targetMs = Date.parse(exam.date);
    if (Number.isNaN(targetMs)) return;

    const startMs = Math.min(Date.now() - 86400000, targetMs - 365 * 86400000);

    const tick = () => {
      const now = Date.now();
      let diff = targetMs - now;

      const elD = document.getElementById('cd-days');
      const elH = document.getElementById('cd-hours');
      const elM = document.getElementById('cd-minutes');
      const elS = document.getElementById('cd-seconds');
      const elFill = document.getElementById('cd-progress-fill');
      const elPct = document.getElementById('cd-progress-pct');

      if (!elD || !elH || !elM || !elS) {
        this.stop();
        return;
      }

      if (diff <= 0) {
        this.setDigit(elD, '00', 'd');
        this.setDigit(elH, '00', 'h');
        this.setDigit(elM, '00', 'm');
        this.setDigit(elS, '00', 's');
        if (elFill) elFill.style.width = '100%';
        if (elPct) elPct.textContent = '100%';
        const banner = document.getElementById('cd-expired-banner');
        if (banner) banner.style.display = 'block';
        this.stop();
        return;
      }

      const days = Math.floor(diff / 86400000);
      diff %= 86400000;
      const hours = Math.floor(diff / 3600000);
      diff %= 3600000;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      this.setDigit(elD, String(days).padStart(2, '0'), 'd');
      this.setDigit(elH, String(hours).padStart(2, '0'), 'h');
      this.setDigit(elM, String(minutes).padStart(2, '0'), 'm');
      this.setDigit(elS, String(seconds).padStart(2, '0'), 's');

      const total = Math.max(1, targetMs - startMs);
      const pct = Math.min(100, Math.max(1, Math.round(((now - startMs) / total) * 100)));
      if (elFill) elFill.style.width = `${pct}%`;
      if (elPct) elPct.textContent = `${pct}%`;

      if (Store.getSettings().soundEnabled && days === 0 && hours === 0 && minutes === 0 && seconds <= 10 && seconds !== this.lastSec) {
        this.lastSec = seconds;
        this.playBeep();
      }
    };

    this.lastValues = { d: '', h: '', m: '', s: '' };
    tick();
    this.timerId = setInterval(tick, 1000);
  },

  setDigit(el, value, key) {
    if (this.lastValues[key] !== value) {
      el.textContent = value;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
      this.lastValues[key] = value;
    }
  },

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },

  playBeep() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 110);
    } catch {
      // Ignore audio autoplay restriction errors
    }
  },

  async setupReminder(exam) {
    if (!exam || !exam.date) return;
    if (!('Notification' in window)) {
      showToast(t('toastReminderUnsupported'));
      return;
    }
    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
    }
    if (perm !== 'granted') {
      showToast(t('toastReminderDenied'));
      return;
    }

    const target = Date.parse(exam.date);
    const now = Date.now();
    const reminders = Store.getReminders().filter((r) => r.examId !== exam.id);
    let scheduled = 0;

    [
      { offset: 86400000, label: '1 day left' },
      { offset: 3600000, label: '1 hour left' }
    ].forEach((slot) => {
      const when = target - slot.offset;
      if (when > now) {
        reminders.push({ examId: exam.id, name: ExamDB.getExamName(exam), when, label: slot.label });
        scheduled++;
      }
    });

    if (scheduled > 0) {
      Store.saveReminders(reminders);
      showToast(t('toastReminderSet'));
    } else {
      showToast(t('toastReminderSoon'));
    }
  },

  checkDueReminders() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = Date.now();
    const remaining = [];
    for (const r of Store.getReminders()) {
      if (r.when <= now && r.when > now - 3600000) {
        try {
          new Notification('SK EXAMS COUNTDOWN 2.0', {
            body: `${r.name} — ${r.label}`,
            icon: '/favicon.svg'
          });
        } catch {
          // Ignore notification runtime errors
        }
      } else if (r.when > now) {
        remaining.push(r);
      }
    }
    Store.saveReminders(remaining);
  },

  async shareExam(exam) {
    const url = exam
      ? `${window.location.origin}/exam/${encodeURIComponent(exam.id)}`
      : window.location.origin;
    const title = exam ? `${ExamDB.getExamName(exam)} — SK EXAMS COUNTDOWN 2.0` : 'SK EXAMS COUNTDOWN 2.0';
    const text = exam
      ? `${ExamDB.getExamName(exam)} (${exam.expectedWindow || ExamDB.formatISTDate(exam.date)}) — Track live countdown:`
      : 'Track NEET UG 2027, JEE Main & Advanced 2027, UPSC & Board Exam countdowns:';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(t('toastCopied'));
    } catch {
      showToast(url);
    }
  },

  toggleFullscreen() {
    if (document.body.classList.contains('fullscreen-mode')) {
      this.exitFullscreen();
    } else {
      document.body.classList.add('fullscreen-mode');
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    }
  },

  exitFullscreen(fromBrowser = false) {
    document.body.classList.remove('fullscreen-mode');
    if (!fromBrowser && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
};
