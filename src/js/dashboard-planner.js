// Personal Student Dashboard + Smart Study Planner
const PlatformViews = {};

const ALL_PLATFORM_TOOLS = [
  { path: '/dashboard', title: 'Student Dashboard', titleHi: 'स्टूडेंट डैशबोर्ड', desc: 'Daily targets, streak, live visitors & quick stats', descHi: 'दैनिक लक्ष्य, स्ट्रीक, लाइव विज़िटर्स और प्रगति' },
  { path: '/planner', title: 'Smart Study Planner', titleHi: 'स्मार्ट स्टडी प्लानर', desc: 'Daily, weekly & recurring study schedules', descHi: 'दैनिक, साप्ताहिक और आवर्ती अध्ययन योजना' },
  { path: '/todo', title: 'To-Do & Task Manager', titleHi: 'टू-डू टास्क मैनेजर', desc: 'Priorities, deadlines, filters & overdue tracking', descHi: 'प्राथमिकता, समय-सीमा और दैनिक कार्य प्रबंधन' },
  { path: '/syllabus', title: 'Syllabus Tracker', titleHi: 'सिलेबस ट्रैकर', desc: 'Subjects, chapters, topics & visual progress charts', descHi: 'विषय, अध्याय, टॉपिक और प्रगति चार्ट' },
  { path: '/focus', title: 'Focus Timer & Pomodoro', titleHi: 'फोकस टाइमर (पोमोडोरो)', desc: '25/5, 50/10, 90m timestamp-accurate study timer', descHi: '25/5, 50/10, 90 मिनट का सटीक स्टडी टाइमर' },
  { path: '/tools', title: 'Calculator & Study Utilities', titleHi: 'कैलकुलेटर और टूल्स', desc: 'Basic/Scientific calc, stopwatch, unit & marks tools', descHi: 'बेसिक/साइंटिफिक कैलकुलेटर, स्टॉपवॉच और यूनिट कन्वर्टर' },
  { path: '/calendar', title: 'Exam Calendar', titleHi: 'परीक्षा कैलेंडर', desc: 'Monthly & weekly IST calendar with exam & study dates', descHi: 'मासिक और साप्ताहिक परीक्षा व अध्ययन कैलेंडर' },
  { path: '/notes', title: 'Notes, Revisions & Flashcards', titleHi: 'नोट्स, रिवीज़न और फ्लैशकार्ड्स', desc: 'Revision manager, spaced flashcards & bookmarks', descHi: 'रिवीज़न शेड्यूल, फ्लैशकार्ड्स और बुकमार्क्स' },
  { path: '/quiz', title: 'Daily Quiz & Challenge', titleHi: 'डेली क्विज़ और चैलेंज', desc: 'Subject-wise practice MCQs with explanations', descHi: 'व्याख्या सहित विषयवार अभ्यास प्रश्न' },
  { path: '/achievements', title: 'Streaks & Achievements', titleHi: 'स्ट्रीक और उपलब्धियाँ', desc: 'Study streak milestones & unlocked badges', descHi: 'अध्ययन स्ट्रीक और बैज उपलब्धियाँ' },
  { path: '/resources', title: 'Exam Resources Hub', titleHi: 'परीक्षा संसाधन हब', desc: 'Verified official portals, notices & syllabus links', descHi: 'सत्यापित आधिकारिक वेबसाइट व पाठ्यक्रम लिंक' },
  { path: '/cards', title: 'Shareable Exam Cards', titleHi: 'शेयर करने योग्य कार्ड्स', desc: 'Generate & download PNG countdown cards', descHi: 'पीएनजी काउंटडाउन कार्ड बनाएँ और शेयर करें' },
  { path: '/readiness', title: 'Readiness, Backlog & Exam Day', titleHi: 'तैयारी, बैकलॉग और एग्जाम डे', desc: 'Priority ranking, backlog recovery & checklist', descHi: 'तैयारी स्तर, बैकलॉग प्लानर और एग्जाम डे चेकलिस्ट' },
  { path: '/notifications', title: 'Notification Center', titleHi: 'नोटिफिकेशन सेंटर', desc: 'Reminders, browser alerts & notification history', descHi: 'रिमाइंडर और नोटिफिकेशन इतिहास' },
  { path: '/report', title: 'Report / Feedback (Telegram)', titleHi: 'रिपोर्ट / सुझाव (टेलीग्राम)', desc: 'Report wrong dates, bugs or send suggestions', descHi: 'गलत तिथि, बग या सुझाव टेलीग्राम बॉट पर भेजें' },
  { path: '/privacy', title: 'Privacy & Data Backup', titleHi: 'प्राइवेसी और डेटा बैकअप', desc: 'Export/Import JSON & local storage management', descHi: 'JSON बैकअप, रीस्टोर और लोकल डेटा नियंत्रण' }
];

function toolLabel(item) {
  return Store.getSettings().lang === 'hi' ? item.titleHi : item.title;
}

function toolDesc(item) {
  return Store.getSettings().lang === 'hi' ? item.descHi : item.desc;
}

PlatformViews.dashboard = function (container) {
  StudentStore.recordRecentTool('/dashboard', 'Dashboard');
  let customizing = false;
  let toolQuery = '';

  const draw = () => {
    const d = StudentStore.get();
    const w = d.dashboardWidgets;
    const todayStr = getISTDateString();
    const todayFormatted = new Intl.DateTimeFormat(Store.getSettings().lang === 'hi' ? 'hi-IN' : 'en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    const upcoming = ExamDB.sortExams(
      ExamDB.exams.filter((e) => e.date && !ExamDB.isExpired(e) && ExamDB.getEffectiveStatus(e) !== 'postponed'),
      'soonest'
    );
    const nextExam = upcoming[0] || null;
    const doneTasks = d.todos.filter((x) => x.completed).length;
    const pendingTasks = d.todos.filter((x) => !x.completed).length;
    const todayFocus = StudentStore.getTodayFocusMinutes();
    const targetPct = Math.min(100, Math.round((todayFocus / Math.max(1, d.dailyStudyTargetMinutes)) * 100));
    const syl = StudentStore.getSyllabusStats();
    const weekly = StudentStore.getWeeklyFocusByDay();
    const maxWeekMin = Math.max(30, ...weekly.map((x) => x.minutes));
    const badges = StudentStore.getAchievements();
    const unlockedCount = badges.filter((b) => b.unlocked).length;
    const liveVisitorCount = typeof PresenceClient !== 'undefined' ? PresenceClient.currentCount : null;

    const filteredTools = ALL_PLATFORM_TOOLS.filter((item) => {
      if (!toolQuery.trim()) return true;
      const q = toolQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.titleHi.includes(q);
    });

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.6rem;">${t('dashTitle')}</h1>
          <p class="section-desc">${escapeHtml(todayFormatted)} • ${t('dashSubtitle')}</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" id="dash-customize-btn">${icon('settings')} ${t('dashCustomize')}</button>
          <button type="button" class="btn btn-primary btn-sm" data-nav="/focus">${icon('clock')} ${t('navFocus')}</button>
        </div>
      </div>

      ${customizing ? `
        <section class="panel-card">
          <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">${t('dashCustomize')}</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.65rem;margin-bottom:1rem;">
            ${Object.keys(w).map((k) => `
              <label class="list-row-card" style="cursor:pointer;align-items:center;">
                <span style="font-size:0.86rem;font-weight:600;">${escapeHtml(k)}</span>
                <input type="checkbox" data-toggle-widget="${k}" ${w[k] ? 'checked' : ''} />
              </label>
            `).join('')}
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <label class="form-label" style="margin:0;">Daily Study Target (min):</label>
            <input type="number" id="dash-target-input" class="input-field" style="width:110px;" min="15" max="960" value="${d.dailyStudyTargetMinutes}" />
            <button type="button" class="btn btn-primary btn-sm" id="dash-target-save">Save Target</button>
          </div>
        </section>
      ` : ''}

      ${w.todayOverview ? `
        <div class="kpi-grid">
          <div class="kpi-card">
            <span class="kpi-label">Study Time Today</span>
            <span class="kpi-value">${todayFocus}m</span>
            <span class="kpi-sub">${targetPct}% of ${d.dailyStudyTargetMinutes}m target</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Study Streak</span>
            <span class="kpi-value">${d.streak.current}d</span>
            <span class="kpi-sub">Best: ${d.streak.longest} days</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Tasks Progress</span>
            <span class="kpi-value">${doneTasks}/${doneTasks + pendingTasks}</span>
            <span class="kpi-sub">${pendingTasks} pending</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Syllabus Completed</span>
            <span class="kpi-value">${syl.pct}%</span>
            <span class="kpi-sub">${syl.completed}/${syl.total} topics</span>
          </div>
          ${w.visitorCount ? `
            <div class="kpi-card">
              <span class="kpi-label">Global Live Visitors</span>
              <span class="kpi-value" style="display:flex;align-items:center;gap:0.45rem;">
                <span class="live-dot" style="${liveVisitorCount === null ? 'background:var(--text-muted);animation:none;box-shadow:none;' : ''}"></span>
                <span id="dash-live-visitors">${liveVisitorCount !== null ? liveVisitorCount : 'Unavailable'}</span>
              </span>
              <span class="kpi-sub">${liveVisitorCount !== null ? 'Active across website (real-time)' : 'Connect Cloudflare Worker or go online'}</span>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <div class="dash-grid">
        ${w.nextExam && nextExam ? `
          <section class="panel-card" style="margin-bottom:0;">
            <div class="exam-card-head" style="margin-bottom:0.6rem;">
              <span class="pill-badge">Next Exam</span>
              <button type="button" class="btn btn-secondary btn-sm" data-open-exam="${escapeHtml(nextExam.id)}">Open</button>
            </div>
            <h2 class="section-title" style="font-size:1.12rem;">${escapeHtml(ExamDB.getExamName(nextExam))}</h2>
            <p class="row-meta">${escapeHtml(ExamDB.formatISTDate(nextExam.date, true))}</p>
            <div class="spotlight-days" style="margin:0.75rem 0;font-size:1.4rem;" data-live-countdown="${escapeHtml(nextExam.date)}">${escapeHtml(ExamDB.formatCompactCountdown(nextExam.date))}</div>
            <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
              <button type="button" class="btn btn-secondary btn-sm" data-nav="/calendar">Exam Calendar</button>
              <button type="button" class="btn btn-secondary btn-sm" data-nav="/cards">Share Card</button>
            </div>
          </section>
        ` : ''}

        ${w.weeklyProgress ? `
          <section class="panel-card" style="margin-bottom:0;">
            <div class="exam-card-head">
              <h2 class="section-title" style="font-size:1.05rem;">Weekly Focus Minutes (Last 7 Days)</h2>
              <span class="status-badge status-official">${weekly.reduce((a, b) => a + b.minutes, 0)} min</span>
            </div>
            <div class="mini-bar-chart">
              ${weekly.map((day) => {
                const hPct = Math.max(8, Math.round((day.minutes / maxWeekMin) * 100));
                return `
                  <div class="mini-bar-col" title="${day.dateStr}: ${day.minutes} min">
                    <div class="mini-bar-fill" style="height:${hPct}%;"></div>
                    <span class="mini-bar-lbl">${day.label}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}
      </div>

      ${w.recentTools && d.recentTools.length ? `
        <section class="panel-card">
          <h2 class="section-title" style="font-size:1rem;margin-bottom:0.65rem;">Recently Used</h2>
          <div class="chip-row">
            ${d.recentTools.map((rt) => `<button type="button" class="filter-chip" data-nav="${escapeHtml(rt.path)}">${escapeHtml(rt.label)}</button>`).join('')}
          </div>
        </section>
      ` : ''}

      ${w.achievements ? `
        <section class="panel-card">
          <div class="exam-card-head" style="margin-bottom:0.75rem;">
            <h2 class="section-title" style="font-size:1.05rem;">Achievements (${unlockedCount}/${badges.length})</h2>
            <button type="button" class="btn btn-secondary btn-sm" data-nav="/achievements">View All</button>
          </div>
          <div class="chip-row">
            ${badges.slice(0, 6).map((b) => `<span class="status-badge ${b.unlocked ? 'status-official' : 'status-expired'}">${b.unlocked ? '★ ' : ''}${escapeHtml(b.title)} (${b.progress})</span>`).join('')}
          </div>
        </section>
      ` : ''}

      ${w.quickTools ? `
        <div class="section-header">
          <div>
            <h2 class="section-title">Student Tools Directory</h2>
            <p class="section-desc">All study tools run 100% offline on your device.</p>
          </div>
          <input type="search" id="dash-tool-search" class="input-field" style="min-width:220px;" value="${escapeHtml(toolQuery)}" placeholder="Search tools..." />
        </div>
        <div class="tools-hub-grid">
          ${filteredTools.map((item) => `
            <button type="button" class="tool-tile" data-nav="${item.path}">
              <div class="tool-tile-title">${escapeHtml(toolLabel(item))}</div>
              <div class="tool-tile-desc">${escapeHtml(toolDesc(item))}</div>
            </button>
          `).join('')}
        </div>
      ` : ''}
    `;

    container.querySelector('#dash-customize-btn')?.addEventListener('click', () => {
      customizing = !customizing;
      draw();
    });
    container.querySelectorAll('[data-toggle-widget]').forEach((cb) => {
      cb.addEventListener('change', () => {
        d.dashboardWidgets[cb.getAttribute('data-toggle-widget')] = cb.checked;
        StudentStore.save();
        draw();
      });
    });
    container.querySelector('#dash-target-save')?.addEventListener('click', () => {
      const val = Number(container.querySelector('#dash-target-input')?.value);
      if (val >= 15 && val <= 960) {
        d.dailyStudyTargetMinutes = val;
        StudentStore.save();
        showToast('Daily study target updated!');
        draw();
      }
    });
    container.querySelector('#dash-tool-search')?.addEventListener('input', (e) => {
      toolQuery = e.target.value;
      draw();
      const inp = container.querySelector('#dash-tool-search');
      if (inp) { inp.focus(); inp.setSelectionRange(toolQuery.length, toolQuery.length); }
    });
    container.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', () => Router.navigate(el.getAttribute('data-nav')));
    });
    bindExamCardEvents(container);
  };

  draw();
};

PlatformViews.planner = function (container) {
  StudentStore.recordRecentTool('/planner', 'Study Planner');
  let selectedDate = getISTDateString();
  let viewMode = 'daily'; // daily | weekly
  let editingId = null;

  const draw = () => {
    const d = StudentStore.get();
    const plans = d.studyPlans;
    const editItem = editingId ? plans.find((p) => p.id === editingId) : null;

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(addDaysIST(selectedDate, i - 3));
    }

    const matchesDate = (p, ds) => {
      if (p.date === ds) return true;
      if (p.recurring === 'daily' && p.date <= ds) return true;
      if (p.recurring === 'weekdays' && p.date <= ds) {
        const dow = new Date(`${ds}T12:00:00+05:30`).getDay();
        return dow >= 1 && dow <= 5;
      }
      if (p.recurring === 'weekly' && p.date <= ds) {
        return new Date(`${p.date}T12:00:00+05:30`).getDay() === new Date(`${ds}T12:00:00+05:30`).getDay();
      }
      return false;
    };

    const visiblePlans = viewMode === 'daily'
      ? plans.filter((p) => matchesDate(p, selectedDate))
      : plans.filter((p) => weekDays.some((ds) => matchesDate(p, ds)));

    const doneCount = visiblePlans.filter((p) => p.completed).length;
    const totalCount = visiblePlans.length;
    const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
    const totalMins = visiblePlans.reduce((a, b) => a + (Number(b.durationMin) || 0), 0);

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Smart Study Planner</h1>
          <p class="section-desc">Plan daily, weekly, and recurring study sessions stored locally on your device.</p>
        </div>
        <div class="chip-row">
          <button type="button" class="filter-chip ${viewMode === 'daily' ? 'active' : ''}" id="plan-daily-btn">Daily View</button>
          <button type="button" class="filter-chip ${viewMode === 'weekly' ? 'active' : ''}" id="plan-weekly-btn">Weekly View</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card"><span class="kpi-label">Selected Date (IST)</span><span class="kpi-value" style="font-size:1.15rem;">${selectedDate}</span></div>
        <div class="kpi-card"><span class="kpi-label">Completion</span><span class="kpi-value">${pct}%</span><span class="kpi-sub">${doneCount}/${totalCount} sessions</span></div>
        <div class="kpi-card"><span class="kpi-label">Planned Time</span><span class="kpi-value">${totalMins}m</span><span class="kpi-sub">${(totalMins / 60).toFixed(1)} hours</span></div>
      </div>

      <section class="panel-card">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.85rem;">
          <h2 class="section-title" style="font-size:1rem;">Calendar Strip</h2>
          <input type="date" id="plan-date-picker" class="input-field" value="${selectedDate}" />
        </div>
        <div class="calendar-grid">
          ${weekDays.map((ds) => {
            const c = plans.filter((p) => matchesDate(p, ds)).length;
            return `
              <button type="button" class="cal-day-cell ${ds === selectedDate ? 'selected' : ''} ${ds === getISTDateString() ? 'today' : ''}" data-pick-plan-date="${ds}">
                <strong style="font-size:0.82rem;">${ds.slice(5)}</strong>
                <span style="font-size:0.7rem;color:var(--text-secondary);">${c} plan${c === 1 ? '' : 's'}</span>
              </button>
            `;
          }).join('')}
        </div>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.05rem;margin-bottom:0.85rem;">${editItem ? 'Edit Study Session' : 'Add Study Session'}</h2>
        <form id="planner-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;">
          <div><label class="form-label">Subject</label><input class="input-field" style="width:100%;" id="pl-subject" required value="${escapeHtml(editItem?.subject || '')}" placeholder="e.g. Physics" /></div>
          <div><label class="form-label">Chapter / Topic</label><input class="input-field" style="width:100%;" id="pl-topic" required value="${escapeHtml(editItem?.topic || '')}" placeholder="e.g. Electrostatics" /></div>
          <div><label class="form-label">Target Date</label><input type="date" class="input-field" style="width:100%;" id="pl-date" required value="${escapeHtml(editItem?.date || selectedDate)}" /></div>
          <div><label class="form-label">Start Time</label><input type="time" class="input-field" style="width:100%;" id="pl-time" value="${escapeHtml(editItem?.startTime || '08:00')}" /></div>
          <div><label class="form-label">Duration (min)</label><input type="number" class="input-field" style="width:100%;" id="pl-dur" min="10" max="480" value="${editItem?.durationMin || 60}" /></div>
          <div>
            <label class="form-label">Priority</label>
            <select id="pl-prio" class="input-field" style="width:100%;">
              <option value="high" ${editItem?.priority === 'high' ? 'selected' : ''}>High</option>
              <option value="medium" ${!editItem || editItem?.priority === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="low" ${editItem?.priority === 'low' ? 'selected' : ''}>Low</option>
            </select>
          </div>
          <div>
            <label class="form-label">Recurring</label>
            <select id="pl-rec" class="input-field" style="width:100%;">
              <option value="none" ${!editItem || editItem?.recurring === 'none' ? 'selected' : ''}>One-time</option>
              <option value="daily" ${editItem?.recurring === 'daily' ? 'selected' : ''}>Daily</option>
              <option value="weekdays" ${editItem?.recurring === 'weekdays' ? 'selected' : ''}>Weekdays</option>
              <option value="weekly" ${editItem?.recurring === 'weekly' ? 'selected' : ''}>Weekly</option>
            </select>
          </div>
          <div style="display:flex;align-items:flex-end;gap:0.5rem;">
            <button type="submit" class="btn btn-primary" style="width:100%;">${editItem ? 'Update' : 'Add Plan'}</button>
            ${editItem ? `<button type="button" class="btn btn-secondary" id="pl-cancel">Cancel</button>` : ''}
          </div>
        </form>
      </section>

      <section class="panel-card">
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
        <div class="progress-meta"><span>${viewMode === 'daily' ? 'Daily Progress' : 'Weekly Progress'}</span><strong>${pct}%</strong></div>
        <div class="item-list">
          ${visiblePlans.length ? visiblePlans.map((p) => `
            <div class="list-row-card ${p.completed ? 'completed' : ''}">
              <div style="display:flex;gap:0.7rem;align-items:flex-start;">
                <input type="checkbox" data-toggle-plan="${p.id}" ${p.completed ? 'checked' : ''} style="margin-top:0.25rem;width:18px;height:18px;" />
                <div>
                  <div class="row-title">${escapeHtml(p.subject)} — ${escapeHtml(p.topic)}</div>
                  <div class="row-meta">${escapeHtml(p.date)} • ${escapeHtml(p.startTime || '')} • ${p.durationMin} min ${p.recurring !== 'none' ? `• ↻ ${p.recurring}` : ''}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:0.4rem;">
                <span class="status-badge prio-${p.priority}">${p.priority}</span>
                <button type="button" class="icon-btn" data-edit-plan="${p.id}" title="Edit">${icon('edit')}</button>
                <button type="button" class="icon-btn" data-del-plan="${p.id}" title="Delete">${icon('trash')}</button>
              </div>
            </div>
          `).join('') : `<div class="empty-state"><h3>No study plans for this period</h3><p>Add your first study block above to organize your day.</p></div>`}
        </div>
      </section>
    `;

    container.querySelector('#plan-daily-btn')?.addEventListener('click', () => { viewMode = 'daily'; draw(); });
    container.querySelector('#plan-weekly-btn')?.addEventListener('click', () => { viewMode = 'weekly'; draw(); });
    container.querySelector('#plan-date-picker')?.addEventListener('change', (e) => { selectedDate = e.target.value || getISTDateString(); draw(); });
    container.querySelectorAll('[data-pick-plan-date]').forEach((btn) => {
      btn.addEventListener('click', () => { selectedDate = btn.getAttribute('data-pick-plan-date'); draw(); });
    });
    container.querySelector('#pl-cancel')?.addEventListener('click', () => { editingId = null; draw(); });

    container.querySelector('#planner-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const item = {
        id: editingId || `pl_${Date.now()}`,
        subject: container.querySelector('#pl-subject').value.trim(),
        topic: container.querySelector('#pl-topic').value.trim(),
        date: container.querySelector('#pl-date').value,
        startTime: container.querySelector('#pl-time').value,
        durationMin: Number(container.querySelector('#pl-dur').value) || 60,
        priority: container.querySelector('#pl-prio').value,
        recurring: container.querySelector('#pl-rec').value,
        completed: editItem ? editItem.completed : false,
        createdAt: editItem ? editItem.createdAt : new Date().toISOString()
      };
      if (editingId) {
        const idx = d.studyPlans.findIndex((x) => x.id === editingId);
        if (idx >= 0) d.studyPlans[idx] = item;
      } else {
        d.studyPlans.unshift(item);
      }
      editingId = null;
      StudentStore.save();
      showToast('Study plan saved!');
      draw();
    });

    container.querySelectorAll('[data-toggle-plan]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const item = d.studyPlans.find((x) => x.id === cb.getAttribute('data-toggle-plan'));
        if (item) {
          item.completed = cb.checked;
          if (item.completed) StudentStore.recordStudyActivity();
          StudentStore.save();
          draw();
        }
      });
    });
    container.querySelectorAll('[data-edit-plan]').forEach((btn) => {
      btn.addEventListener('click', () => { editingId = btn.getAttribute('data-edit-plan'); draw(); });
    });
    container.querySelectorAll('[data-del-plan]').forEach((btn) => {
      btn.addEventListener('click', () => {
        d.studyPlans = d.studyPlans.filter((x) => x.id !== btn.getAttribute('data-del-plan'));
        StudentStore.save();
        draw();
      });
    });
  };

  draw();
};
