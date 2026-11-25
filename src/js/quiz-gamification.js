// Daily Practice Quiz & Challenge + Study Streaks & Achievements + Notification Center
let cachedQuizBank = null;

async function loadQuizBank() {
  if (cachedQuizBank) return cachedQuizBank;
  try {
    const res = await fetch('/data/quiz.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    cachedQuizBank = await res.json();
  } catch {
    cachedQuizBank = { disclaimer: 'Offline practice set unavailable.', questions: [] };
  }
  return cachedQuizBank;
}

PlatformViews.quiz = async function (container) {
  StudentStore.recordRecentTool('/quiz', 'Daily Quiz');
  const bank = await loadQuizBank();
  let subject = 'All';
  let difficulty = 'all';
  let activeSet = [];
  let qIdx = 0;
  let picked = null;
  let score = 0;
  let wrongIds = [];
  let finished = false;
  let isDaily = false;

  const subjects = ['All', ...new Set((bank.questions || []).map((q) => q.subject))];

  const startQuiz = (list, dailyFlag = false) => {
    activeSet = list;
    qIdx = 0;
    picked = null;
    score = 0;
    wrongIds = [];
    finished = false;
    isDaily = dailyFlag;
    draw();
  };

  const draw = () => {
    const d = StudentStore.get();
    const bestPct = d.quizHistory.reduce((m, h) => Math.max(m, h.pct || 0), 0);

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Daily Practice Quiz & Challenge</h1>
          <p class="section-desc">${escapeHtml(bank.disclaimer || 'Practice questions for self-assessment.')}</p>
        </div>
        <span class="status-badge status-official">Personal Best: ${bestPct}%</span>
      </div>

      ${!activeSet.length ? `
        <section class="panel-card">
          <div style="display:flex;flex-wrap:wrap;gap:0.65rem;align-items:center;margin-bottom:1rem;">
            <select id="qz-sub" class="input-field">${subjects.map((s) => `<option value="${s}" ${subject === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
            <select id="qz-diff" class="input-field">
              <option value="all" ${difficulty === 'all' ? 'selected' : ''}>All Difficulties</option>
              <option value="easy" ${difficulty === 'easy' ? 'selected' : ''}>Easy</option>
              <option value="medium" ${difficulty === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="hard" ${difficulty === 'hard' ? 'selected' : ''}>Hard</option>
            </select>
            <button type="button" class="btn btn-primary" id="qz-start-btn">Start Practice Quiz</button>
            <button type="button" class="btn btn-secondary" id="qz-daily-btn">⚡ Today's 5-Question Challenge</button>
          </div>
          <h2 class="section-title" style="font-size:1rem;margin-bottom:0.65rem;">Recent Quiz History (${d.quizHistory.length})</h2>
          <div class="item-list">
            ${d.quizHistory.slice(0, 8).map((h) => `
              <div class="list-row-card" style="padding:0.55rem 0.75rem;">
                <div><div class="row-title" style="font-size:0.86rem;">${escapeHtml(h.subject)} ${h.isDaily ? '• Daily Challenge' : ''}</div><div class="row-meta">${escapeHtml(h.dateStr)}</div></div>
                <span class="status-badge ${h.pct >= 70 ? 'status-official' : 'status-tentative'}">${h.score}/${h.total} (${h.pct}%)</span>
              </div>
            `).join('') || '<p class="row-meta">Complete a quiz to track your scores locally.</p>'}
          </div>
        </section>
      ` : finished ? `
        <section class="panel-card" style="text-align:center;">
          <h2 class="section-title" style="font-size:1.35rem;">Quiz Completed!</h2>
          <div class="focus-clock" style="font-size:3rem;">${score} / ${activeSet.length}</div>
          <p class="row-meta" style="margin-bottom:1rem;">Score: ${Math.round((score / Math.max(1, activeSet.length)) * 100)}%</p>
          <div style="display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;">
            ${wrongIds.length ? `<button type="button" class="btn btn-primary" id="qz-retry-wrong">Retry Incorrect (${wrongIds.length})</button>` : ''}
            <button type="button" class="btn btn-secondary" id="qz-back-menu">Back to Quiz Menu</button>
          </div>
        </section>
      ` : (() => {
        const cur = activeSet[qIdx];
        return `
          <section class="panel-card">
            <div class="exam-card-head" style="margin-bottom:0.75rem;">
              <span class="pill-badge">${escapeHtml(cur.subject)} • ${escapeHtml(cur.topic)} (${escapeHtml(cur.difficulty)})</span>
              <strong>Q ${qIdx + 1} / ${activeSet.length}</strong>
            </div>
            <h2 style="font-size:1.1rem;margin-bottom:1rem;">${escapeHtml(cur.q)}</h2>
            <div class="item-list" style="margin-bottom:1rem;">
              ${cur.options.map((opt, idx) => {
                let cls = 'quiz-option';
                if (picked !== null) {
                  if (idx === cur.answer) cls += ' correct';
                  else if (idx === picked) cls += ' wrong';
                }
                return `<button type="button" class="${cls}" data-q-opt="${idx}" ${picked !== null ? 'disabled' : ''}>${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)}</button>`;
              }).join('')}
            </div>
            ${picked !== null ? `
              <div class="status-callout" style="margin-bottom:1rem;">
                <div class="status-callout-title">${picked === cur.answer ? '✓ Correct!' : '✗ Incorrect'}</div>
                <div class="status-callout-text">${escapeHtml(cur.explanation)}</div>
              </div>
              <button type="button" class="btn btn-primary" id="qz-next-btn">${qIdx + 1 < activeSet.length ? 'Next Question →' : 'Finish Quiz'}</button>
            ` : ''}
          </section>
        `;
      })()}
    `;

    container.querySelector('#qz-sub')?.addEventListener('change', (e) => { subject = e.target.value; });
    container.querySelector('#qz-diff')?.addEventListener('change', (e) => { difficulty = e.target.value; });
    container.querySelector('#qz-start-btn')?.addEventListener('click', () => {
      const filtered = (bank.questions || []).filter((q) => (subject === 'All' || q.subject === subject) && (difficulty === 'all' || q.difficulty === difficulty));
      if (!filtered.length) { showToast('No questions match those filters.'); return; }
      startQuiz(filtered, false);
    });
    container.querySelector('#qz-daily-btn')?.addEventListener('click', () => {
      const qs = bank.questions || [];
      if (!qs.length) return;
      const seed = Number(getISTDateString().replace(/-/g, ''));
      const daily = [];
      for (let i = 0; i < Math.min(5, qs.length); i++) {
        daily.push(qs[(seed + i * 3) % qs.length]);
      }
      startQuiz(daily, true);
    });
    container.querySelectorAll('[data-q-opt]').forEach((b) => b.addEventListener('click', () => {
      picked = Number(b.getAttribute('data-q-opt'));
      const cur = activeSet[qIdx];
      if (picked === cur.answer) score += 1;
      else wrongIds.push(cur.id);
      draw();
    }));
    container.querySelector('#qz-next-btn')?.addEventListener('click', () => {
      if (qIdx + 1 < activeSet.length) {
        qIdx += 1; picked = null; draw();
      } else {
        finished = true;
        const pct = Math.round((score / Math.max(1, activeSet.length)) * 100);
        d.quizHistory.unshift({ id: `qz_${Date.now()}`, dateStr: getISTDateString(), subject: isDaily ? 'Daily Challenge' : subject, score, total: activeSet.length, pct, isDaily });
        d.quizHistory = d.quizHistory.slice(0, 50);
        StudentStore.recordStudyActivity();
        StudentStore.save();
        draw();
      }
    });
    container.querySelector('#qz-retry-wrong')?.addEventListener('click', () => {
      const retryList = (bank.questions || []).filter((q) => wrongIds.includes(q.id));
      startQuiz(retryList, false);
    });
    container.querySelector('#qz-back-menu')?.addEventListener('click', () => { activeSet = []; finished = false; draw(); });
  };

  draw();
};

PlatformViews.achievements = function (container) {
  StudentStore.recordRecentTool('/achievements', 'Streaks & Achievements');
  const d = StudentStore.get();
  const badges = StudentStore.getAchievements();
  const motivations = [
    'Small consistent sessions beat last-minute cramming.',
    'Focus on understanding one concept deeply today.',
    'Every completed topic brings your target exam closer.',
    'Steady progress is sustainable progress.'
  ];
  const quote = motivations[new Date().getDate() % motivations.length];

  container.innerHTML = `
    <div class="section-header" style="margin-top:0;">
      <div>
        <h1 class="section-title" style="font-size:1.55rem;">Study Streaks & Achievements</h1>
        <p class="section-desc">${escapeHtml(quote)}</p>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card"><span class="kpi-label">Current Streak</span><span class="kpi-value">${d.streak.current} days</span></div>
      <div class="kpi-card"><span class="kpi-label">Longest Streak</span><span class="kpi-value">${d.streak.longest} days</span></div>
      <div class="kpi-card"><span class="kpi-label">Active Study Days</span><span class="kpi-value">${d.streak.activeDates.length}</span></div>
      <div class="kpi-card"><span class="kpi-label">Badges Unlocked</span><span class="kpi-value">${badges.filter((b) => b.unlocked).length}/${badges.length}</span></div>
    </div>

    <div class="badge-grid">
      ${badges.map((b) => `
        <article class="achieve-card ${b.unlocked ? 'unlocked' : ''}">
          <div class="exam-card-head" style="margin-bottom:0.4rem;">
            <strong>${b.unlocked ? '🏆 ' : '🔒 '}${escapeHtml(b.title)}</strong>
            <span class="status-badge ${b.unlocked ? 'status-official' : 'status-expired'}">${escapeHtml(b.progress)}</span>
          </div>
          <p class="row-meta">${escapeHtml(b.desc)}</p>
        </article>
      `).join('')}
    </div>
  `;
};

PlatformViews.notifications = function (container) {
  StudentStore.recordRecentTool('/notifications', 'Notifications');
  const draw = () => {
    const d = StudentStore.get();
    const perm = ('Notification' in window) ? Notification.permission : 'unsupported';
    const reminders = Store.getReminders();

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Notification & Reminder Center</h1>
          <p class="section-desc">Manage local exam/study reminders and view notification history.</p>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <button type="button" class="btn btn-secondary btn-sm" id="ntf-mark-all">Mark All Read</button>
          <button type="button" class="btn btn-danger btn-sm" id="ntf-clear">Clear History</button>
        </div>
      </div>

      <section class="panel-card">
        <div class="exam-card-head">
          <div>
            <h2 class="section-title" style="font-size:1rem;">Browser Notification Permission: <span class="status-badge ${perm === 'granted' ? 'status-official' : 'status-tentative'}">${perm}</span></h2>
            <p class="row-meta" style="margin-top:0.35rem;">Note: Browser notifications rely on your browser permissions, OS battery settings, and having the site/PWA open or active. This static app does not push automatic external exam alerts without your interaction.</p>
          </div>
          ${perm === 'default' ? `<button type="button" class="btn btn-primary btn-sm" id="ntf-req-perm">Enable Notifications</button>` : ''}
        </div>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">Saved Local Reminders (${reminders.length})</h2>
        <div class="item-list">
          ${reminders.length ? reminders.map((r) => `<div class="list-row-card"><div><div class="row-title">${escapeHtml(r.name)}</div><div class="row-meta">${escapeHtml(r.label)} • ${new Date(r.when).toLocaleString('en-IN')}</div></div></div>`).join('') : '<p class="row-meta">Set reminders from any exam countdown page.</p>'}
        </div>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">Notification History (${d.notifications.length})</h2>
        <div class="item-list">
          ${d.notifications.length ? d.notifications.map((n) => `
            <div class="list-row-card" style="${n.read ? 'opacity:0.65;' : 'border-color:var(--accent-border);'}">
              <div>
                <div class="row-title">${escapeHtml(n.title)}</div>
                <div class="row-meta">${escapeHtml(n.body)} • ${new Date(n.createdAt).toLocaleString('en-IN')}</div>
              </div>
              ${!n.read ? `<button type="button" class="btn btn-secondary btn-sm" data-ntf-read="${n.id}">Read</button>` : ''}
            </div>
          `).join('') : '<p class="row-meta">No notifications yet.</p>'}
        </div>
      </section>
    `;

    container.querySelector('#ntf-req-perm')?.addEventListener('click', async () => {
      if ('Notification' in window) { await Notification.requestPermission(); draw(); }
    });
    container.querySelector('#ntf-mark-all')?.addEventListener('click', () => {
      d.notifications.forEach((n) => { n.read = true; }); StudentStore.save(); draw();
    });
    container.querySelector('#ntf-clear')?.addEventListener('click', () => {
      if (window.confirm('Clear all notification history?')) { d.notifications = []; StudentStore.save(); draw(); }
    });
    container.querySelectorAll('[data-ntf-read]').forEach((b) => b.addEventListener('click', () => {
      const n = d.notifications.find((x) => x.id === b.getAttribute('data-ntf-read'));
      if (n) { n.read = true; StudentStore.save(); draw(); }
    }));
  };

  draw();
};
