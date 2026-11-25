// Exam Resources Hub + Shareable PNG Exam Cards + Readiness/Backlog/Exam Day + Telegram Report Bot + Privacy & Data Management
const TELEGRAM_BOT_URL = 'https://t.me/SK_EXAMS_COUNTDOWN_bot';

let pendingReportPrefill = null;

function openReportWithPrefill(prefill) {
  pendingReportPrefill = prefill || null;
  Router.navigate('/report');
}

PlatformViews.resources = function (container) {
  StudentStore.recordRecentTool('/resources', 'Exam Resources');
  let q = '';

  const draw = () => {
    const list = q.trim() ? ExamDB.search(q) : ExamDB.sortExams(ExamDB.exams, 'priority');
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Exam Resources Hub</h1>
          <p class="section-desc">Verified official portals, notices, syllabus, admit card, and result links. No invented URLs.</p>
        </div>
      </div>

      <div class="filter-bar">
        <input type="search" id="res-search" class="input-field" style="flex:1;min-width:220px;" value="${escapeHtml(q)}" placeholder="Filter exam resources (e.g. NEET, JEE, UPSC, CBSE, RBSE)..." />
      </div>

      <div class="item-list">
        ${list.map((exam) => `
          <section class="panel-card" style="margin-bottom:0;">
            <div class="exam-card-head" style="margin-bottom:0.5rem;">
              <div>
                <h2 class="section-title" style="font-size:1.05rem;">${escapeHtml(ExamDB.getExamName(exam))}</h2>
                <p class="row-meta">${escapeHtml(exam.conductingBody || '')} • Verified: ${escapeHtml(exam.lastVerified || '—')}</p>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" data-report-broken="${escapeHtml(exam.id)}">Report Broken Link</button>
            </div>
            <div class="official-links-grid">
              ${exam.officialSourceUrl ? `<a class="btn btn-primary btn-sm" href="${escapeHtml(exam.officialSourceUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} Official Website</a>` : ''}
              ${exam.notificationUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.notificationUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} Official Notices</a>` : ''}
              ${exam.syllabusUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.syllabusUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} Syllabus / Info</a>` : ''}
              ${exam.admitCardUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.admitCardUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} Admit Card</a>` : ''}
              ${exam.resultUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.resultUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} Results</a>` : ''}
            </div>
          </section>
        `).join('')}
      </div>
    `;

    container.querySelector('#res-search')?.addEventListener('input', (e) => {
      q = e.target.value; draw();
      const inp = container.querySelector('#res-search');
      if (inp) { inp.focus(); inp.setSelectionRange(q.length, q.length); }
    });
    container.querySelectorAll('[data-report-broken]').forEach((b) => b.addEventListener('click', () => {
      const ex = ExamDB.getById(b.getAttribute('data-report-broken'));
      openReportWithPrefill({
        category: 'Broken official links',
        examName: ex ? ex.shortName : '',
        currentDate: ex && ex.date ? ExamDB.formatISTDate(ex.date) : '',
        description: ex ? `Broken or outdated official link for ${ex.shortName} (${ex.officialSourceUrl || ''})` : ''
      });
    }));
  };

  draw();
};

PlatformViews.cards = function (container) {
  StudentStore.recordRecentTool('/cards', 'Shareable Cards');
  const exams = ExamDB.sortExams(ExamDB.exams, 'priority');
  let selectedId = exams[0]?.id || 'neet-ug-2027';
  let template = 'obsidian'; // obsidian | midnight | light | emerald
  let customQuote = 'Stay focused. Every day counts!';

  const templates = {
    obsidian: { bg1: '#070914', bg2: '#131b3a', fg: '#f8fafc', muted: '#94a3b8', accent: '#818cf8', accent2: '#22d3ee' },
    midnight: { bg1: '#1e1b4b', bg2: '#312e81', fg: '#ffffff', muted: '#c7d2fe', accent: '#38bdf8', accent2: '#f472b6' },
    light: { bg1: '#f8fafc', bg2: '#e2e8f0', fg: '#0f172a', muted: '#475569', accent: '#4f46e5', accent2: '#0891b2' },
    emerald: { bg1: '#022c22', bg2: '#064e3b', fg: '#ecfdf5', muted: '#a7f3d0', accent: '#34d399', accent2: '#22d3ee' }
  };

  const renderCanvas = () => {
    const canvas = document.getElementById('share-card-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const exam = ExamDB.getById(selectedId) || exams[0];
    if (!exam) return;
    const pal = templates[template] || templates.obsidian;
    const W = 1080, H = 640;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, pal.bg1);
    grad.addColorStop(1, pal.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    ctx.fillStyle = pal.accent2;
    ctx.font = '700 24px system-ui, sans-serif';
    ctx.fillText('SK EXAMS COUNTDOWN', 76, 102);

    const cat = ExamDB.getCategory(exam.category);
    ctx.fillStyle = pal.muted;
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText(cat ? cat.nameEn.toUpperCase() : 'EXAM COUNTDOWN', 76, 146);

    ctx.fillStyle = pal.fg;
    ctx.font = '800 54px system-ui, sans-serif';
    ctx.fillText(exam.shortName, 76, 232);

    const parts = exam.date ? ExamDB.getCountdownParts(exam.date) : null;
    const bigText = parts && !parts.expired
      ? `${parts.days}d  ${String(parts.hours).padStart(2, '0')}h  ${String(parts.minutes).padStart(2, '0')}m`
      : (exam.expectedWindow || 'DATE AWAITED');

    ctx.fillStyle = pal.accent;
    ctx.font = '800 78px monospace';
    ctx.fillText(bigText, 76, 355);

    ctx.fillStyle = pal.muted;
    ctx.font = '600 26px system-ui, sans-serif';
    const dateLine = exam.date ? `Exam Date (IST): ${ExamDB.formatISTDate(exam.date, true)}` : `Status: ${ExamDB.getStatusBadgeMeta(exam).label}`;
    ctx.fillText(dateLine, 76, 428);

    if (customQuote.trim()) {
      ctx.fillStyle = pal.fg;
      ctx.font = 'italic 26px system-ui, sans-serif';
      ctx.fillText(`"${customQuote.trim().slice(0, 68)}"`, 76, 502);
    }

    ctx.fillStyle = pal.muted;
    ctx.font = '700 20px system-ui, sans-serif';
    ctx.fillText('SK EXAMS COUNTDOWN  •  THE SK 08', 76, 572);
  };

  const draw = () => {
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Shareable Exam Countdown Cards</h1>
          <p class="section-desc">Generate and download PNG countdown cards for Telegram, WhatsApp, and Instagram.</p>
        </div>
      </div>

      <section class="panel-card">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin-bottom:1rem;">
          <div>
            <label class="form-label">Select Exam</label>
            <select id="card-exam-sel" class="input-field" style="width:100%;">
              ${exams.map((e) => `<option value="${e.id}" ${selectedId === e.id ? 'selected' : ''}>${escapeHtml(e.shortName)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Template</label>
            <select id="card-tpl-sel" class="input-field" style="width:100%;">
              <option value="obsidian" ${template === 'obsidian' ? 'selected' : ''}>Obsidian Dark</option>
              <option value="midnight" ${template === 'midnight' ? 'selected' : ''}>Midnight Gradient</option>
              <option value="light" ${template === 'light' ? 'selected' : ''}>Crisp Light</option>
              <option value="emerald" ${template === 'emerald' ? 'selected' : ''}>Emerald Focus</option>
            </select>
          </div>
          <div>
            <label class="form-label">Custom Text</label>
            <input id="card-quote-inp" class="input-field" style="width:100%;" maxlength="68" value="${escapeHtml(customQuote)}" />
          </div>
        </div>

        <div class="card-canvas-wrap">
          <canvas id="share-card-canvas" width="1080" height="640"></canvas>
        </div>

        <div style="display:flex;justify-content:center;gap:0.65rem;flex-wrap:wrap;margin-top:1rem;">
          <button type="button" class="btn btn-primary" id="card-download-btn">Download PNG</button>
          <button type="button" class="btn btn-secondary" id="card-copy-link">Copy Exam Link</button>
        </div>
      </section>
    `;

    renderCanvas();

    container.querySelector('#card-exam-sel')?.addEventListener('change', (e) => { selectedId = e.target.value; renderCanvas(); });
    container.querySelector('#card-tpl-sel')?.addEventListener('change', (e) => { template = e.target.value; renderCanvas(); });
    container.querySelector('#card-quote-inp')?.addEventListener('input', (e) => { customQuote = e.target.value; renderCanvas(); });
    container.querySelector('#card-download-btn')?.addEventListener('click', () => {
      const canvas = document.getElementById('share-card-canvas');
      if (!canvas) return;
      const a = document.createElement('a');
      a.download = `sk-exams-${selectedId}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      showToast('PNG card downloaded!');
    });
    container.querySelector('#card-copy-link')?.addEventListener('click', async () => {
      const url = `${window.location.origin}/exam/${encodeURIComponent(selectedId)}`;
      try { await navigator.clipboard.writeText(url); showToast(t('toastCopied')); } catch {}
    });
  };

  draw();
};

PlatformViews.readiness = function (container) {
  StudentStore.recordRecentTool('/readiness', 'Readiness & Exam Day');
  let activeTab = 'readiness'; // readiness | backlog | examday
  let recoveryDays = 14;

  const draw = () => {
    const d = StudentStore.get();
    const rd = d.readiness;
    const syl = StudentStore.getSyllabusStats();
    const avgMock = rd.mockScores.length ? Math.round(rd.mockScores.reduce((a, b) => a + b.pct, 0) / rd.mockScores.length) : 0;
    const revScore = Math.min(100, (d.revisions.reduce((a, r) => a + (r.completedCount || 0), 0) + syl.revisions) * 10);
    const readinessIndex = Math.round((syl.pct * 0.5) + (revScore * 0.25) + (avgMock * 0.25));
    const exam = ExamDB.getById(rd.examId) || ExamDB.exams[0];

    // Pending syllabus topics for Backlog Recovery
    const pendingTopics = [];
    d.syllabus.forEach((s) => (s.chapters || []).forEach((c) => (c.topics || []).forEach((tp) => {
      if (tp.status !== 'completed') pendingTopics.push({ subject: s.subject, chapter: c.name, topic: tp.name });
    })));
    const perDay = pendingTopics.length ? Math.ceil(pendingTopics.length / Math.max(1, recoveryDays)) : 0;

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Readiness, Backlog Recovery & Exam Day Mode</h1>
          <p class="section-desc">Personal preparation indicators and exam-day checklist stored locally.</p>
        </div>
      </div>

      <div class="tab-bar">
        <button type="button" class="tab-btn ${activeTab === 'readiness' ? 'active' : ''}" data-r-tab="readiness">Readiness Tracker</button>
        <button type="button" class="tab-btn ${activeTab === 'backlog' ? 'active' : ''}" data-r-tab="backlog">Backlog Recovery (${pendingTopics.length})</button>
        <button type="button" class="tab-btn ${activeTab === 'examday' ? 'active' : ''}" data-r-tab="examday">Exam Day Mode</button>
      </div>

      ${activeTab === 'readiness' ? `
        <div class="kpi-grid">
          <div class="kpi-card"><span class="kpi-label">Self-Reported Readiness</span><span class="kpi-value">${readinessIndex}%</span><span class="kpi-sub">Personal indicator only (not a pass guarantee)</span></div>
          <div class="kpi-card"><span class="kpi-label">Syllabus (50% weight)</span><span class="kpi-value">${syl.pct}%</span></div>
          <div class="kpi-card"><span class="kpi-label">Revisions (25% weight)</span><span class="kpi-value">${revScore}%</span></div>
          <div class="kpi-card"><span class="kpi-label">Mock Average (25%)</span><span class="kpi-value">${avgMock}%</span></div>
        </div>
        <section class="panel-card">
          <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">Log Mock Test Score</h2>
          <form id="mock-form" style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1rem;">
            <input id="mk-label" class="input-field" style="flex:1;min-width:180px;" required placeholder="Mock test name (e.g. Full Test 3)" />
            <input id="mk-pct" type="number" class="input-field" style="width:120px;" min="0" max="100" required placeholder="Score %" />
            <button type="submit" class="btn btn-primary btn-sm">Add Score</button>
          </form>
          <div class="item-list">
            ${rd.mockScores.map((m) => `
              <div class="list-row-card" style="padding:0.55rem 0.75rem;">
                <div><strong>${escapeHtml(m.label)}</strong> <span class="row-meta">(${escapeHtml(m.dateStr)})</span></div>
                <div style="display:flex;gap:0.4rem;align-items:center;">
                  <span class="status-badge status-official">${m.pct}%</span>
                  <button type="button" class="icon-btn" data-del-mk="${m.id}">${icon('trash')}</button>
                </div>
              </div>
            `).join('') || '<p class="row-meta">Add your mock test percentages above to calculate your personal readiness indicator.</p>'}
          </div>
        </section>
      ` : ''}

      ${activeTab === 'backlog' ? `
        <section class="panel-card">
          <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;margin-bottom:1rem;">
            <label class="form-label" style="margin:0;">Target Recovery Window (days):</label>
            <input type="number" id="bk-days" class="input-field" style="width:95px;" min="1" max="180" value="${recoveryDays}" />
            <span class="status-badge status-tentative">${pendingTopics.length} pending topics → ~${perDay} topic(s)/day</span>
          </div>
          <div class="item-list">
            ${pendingTopics.length ? pendingTopics.slice(0, 30).map((item, idx) => `
              <div class="list-row-card" style="padding:0.55rem 0.75rem;">
                <div><div class="row-title" style="font-size:0.88rem;">${escapeHtml(item.subject)} — ${escapeHtml(item.topic)}</div><div class="row-meta">${escapeHtml(item.chapter)}</div></div>
                <span class="status-badge status-date-awaited">Day ${Math.floor(idx / Math.max(1, perDay)) + 1}</span>
              </div>
            `).join('') : '<div class="empty-state"><h3>Zero backlog!</h3><p>Add topics in the Syllabus Tracker to generate a catch-up plan here.</p></div>'}
          </div>
        </section>
      ` : ''}

      ${activeTab === 'examday' && exam ? `
        <section class="panel-card">
          <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;margin-bottom:1rem;">
            <label class="form-label" style="margin:0;">Target Exam:</label>
            <select id="ed-exam-sel" class="input-field">
              ${ExamDB.exams.map((e) => `<option value="${e.id}" ${rd.examId === e.id ? 'selected' : ''}>${escapeHtml(e.shortName)}</option>`).join('')}
            </select>
          </div>
          <h2 class="section-title" style="font-size:1.25rem;">${escapeHtml(ExamDB.getExamName(exam, true))}</h2>
          <p class="row-meta">${exam.date ? ExamDB.formatISTDate(exam.date, true) : (exam.expectedWindow || 'Date Awaited')}</p>
          ${exam.date ? `<div class="spotlight-days" style="margin:0.85rem 0;font-size:1.5rem;" data-live-countdown="${escapeHtml(exam.date)}">${escapeHtml(ExamDB.formatCompactCountdown(exam.date))}</div>` : ''}
          <h3 style="font-size:0.95rem;margin:1rem 0 0.5rem;">Exam Day Checklist</h3>
          <div class="item-list" style="margin-bottom:1rem;">
            ${rd.examDayChecklist.map((c) => `
              <label class="list-row-card" style="cursor:pointer;padding:0.55rem 0.75rem;">
                <span style="display:flex;gap:0.6rem;align-items:center;"><input type="checkbox" data-ed-chk="${c.id}" ${c.done ? 'checked' : ''} /> ${escapeHtml(c.text)}</span>
              </label>
            `).join('')}
          </div>
          <label class="form-label">Saved Exam Instructions / Center Address</label>
          <textarea id="ed-inst" class="input-field" style="width:100%;" rows="3" placeholder="Reporting time, exam center address, gate closing time...">${escapeHtml(rd.examDayInstructions || '')}</textarea>
          <button type="button" class="btn btn-primary btn-sm" id="ed-save-inst" style="margin-top:0.65rem;">Save Instructions</button>
        </section>
      ` : ''}
    `;

    container.querySelectorAll('[data-r-tab]').forEach((b) => b.addEventListener('click', () => { activeTab = b.getAttribute('data-r-tab'); draw(); }));
    container.querySelector('#mock-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      rd.mockScores.unshift({ id: `mk_${Date.now()}`, label: container.querySelector('#mk-label').value.trim(), pct: Number(container.querySelector('#mk-pct').value), dateStr: getISTDateString() });
      StudentStore.save(); draw();
    });
    container.querySelectorAll('[data-del-mk]').forEach((b) => b.addEventListener('click', () => {
      rd.mockScores = rd.mockScores.filter((x) => x.id !== b.getAttribute('data-del-mk')); StudentStore.save(); draw();
    }));
    container.querySelector('#bk-days')?.addEventListener('change', (e) => { recoveryDays = Math.max(1, Number(e.target.value) || 14); draw(); });
    container.querySelector('#ed-exam-sel')?.addEventListener('change', (e) => { rd.examId = e.target.value; StudentStore.save(); draw(); });
    container.querySelectorAll('[data-ed-chk]').forEach((cb) => cb.addEventListener('change', () => {
      const it = rd.examDayChecklist.find((x) => x.id === cb.getAttribute('data-ed-chk'));
      if (it) { it.done = cb.checked; StudentStore.save(); }
    }));
    container.querySelector('#ed-save-inst')?.addEventListener('click', () => {
      rd.examDayInstructions = container.querySelector('#ed-inst').value;
      StudentStore.save();
      showToast('Exam day instructions saved!');
    });
    bindExamCardEvents(container);
  };

  draw();
};

PlatformViews.report = function (container) {
  StudentStore.recordRecentTool('/report', 'Report / Feedback');
  const categories = [
    'Incorrect exam date',
    'Incorrect exam information',
    'Incorrect exam category',
    'Broken official links',
    'Website bugs',
    'UI or design problems',
    'Performance problems',
    'PWA installation issues',
    'Feature requests',
    'General suggestions',
    'Calculator or tool errors',
    'Study planner problems',
    'Other issues'
  ];

  const pre = pendingReportPrefill || {};
  pendingReportPrefill = null;
  let preparedReport = '';
  let statusSteps = [];

  const draw = () => {
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Report & Feedback (Telegram Bot)</h1>
          <p class="section-desc">Report incorrect exam dates, broken official links, bugs, or feature requests to @SK_EXAMS_COUNTDOWN_bot.</p>
        </div>
      </div>

      <section class="panel-card">
        <form id="tg-report-form" class="form-grid" style="max-width:680px;">
          <div>
            <label class="form-label" for="rp-cat">Report Category *</label>
            <select id="rp-cat" class="input-field" style="width:100%;" required>
              ${categories.map((c) => `<option value="${escapeHtml(c)}" ${pre.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
            </select>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;">
            <div><label class="form-label" for="rp-exam">Exam Name (Optional)</label><input id="rp-exam" class="input-field" style="width:100%;" value="${escapeHtml(pre.examName || '')}" placeholder="e.g. NEET UG 2027" /></div>
            <div><label class="form-label" for="rp-cur-date">Current Listed Date (Optional)</label><input id="rp-cur-date" class="input-field" style="width:100%;" value="${escapeHtml(pre.currentDate || '')}" placeholder="e.g. 2 May 2027" /></div>
            <div><label class="form-label" for="rp-new-date">Correct Official Date (Optional)</label><input id="rp-new-date" class="input-field" style="width:100%;" placeholder="e.g. 3 May 2027" /></div>
          </div>
          <div>
            <label class="form-label" for="rp-desc">Problem Description / Suggestion *</label>
            <textarea id="rp-desc" class="input-field" style="width:100%;" rows="4" required placeholder="Describe the issue, official source link, or suggestion...">${escapeHtml(pre.description || '')}</textarea>
          </div>
          <div>
            <label class="form-label" for="rp-extra">Additional Information (Optional)</label>
            <input id="rp-extra" class="input-field" style="width:100%;" placeholder="Device, browser, or official notice URL..." />
          </div>
          <button type="submit" class="btn btn-primary">Prepare Report & Open @SK_EXAMS_COUNTDOWN_bot</button>
        </form>

        ${preparedReport ? `
          <div class="status-callout" style="margin-top:1.25rem;">
            <div class="status-callout-title">Structured Report Ready — Paste & Send in Telegram</div>
            <p class="status-callout-text" style="margin-bottom:0.65rem;">Because SK EXAMS COUNTDOWN is a privacy-first static app, it cannot silently submit messages to Telegram. Your report has been copied — please paste and send it to <strong>@SK_EXAMS_COUNTDOWN_bot</strong>.</p>
            <div class="status-steps">
              ${statusSteps.map((st) => `<span class="status-badge status-official">✓ ${escapeHtml(st)}</span>`).join('')}
              <span class="status-badge status-tentative">⏳ Waiting for you to paste & send</span>
            </div>
            <pre style="margin-top:0.85rem;padding:0.85rem;border-radius:10px;background:var(--bg-base);border:1px solid var(--border);font-size:0.78rem;white-space:pre-wrap;overflow-x:auto;">${escapeHtml(preparedReport)}</pre>
            <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.85rem;">
              <button type="button" class="btn btn-secondary btn-sm" id="rp-copy-again">Copy Report Again</button>
              <a href="${TELEGRAM_BOT_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">${icon('external')} Open @SK_EXAMS_COUNTDOWN_bot</a>
            </div>
          </div>
        ` : ''}
      </section>
    `;

    container.querySelector('#tg-report-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cat = container.querySelector('#rp-cat').value;
      const examName = container.querySelector('#rp-exam').value.trim();
      const curDate = container.querySelector('#rp-cur-date').value.trim();
      const newDate = container.querySelector('#rp-new-date').value.trim();
      const desc = container.querySelector('#rp-desc').value.trim();
      const extra = container.querySelector('#rp-extra').value.trim();
      if (!desc) return;

      const istNow = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium'
      }).format(new Date());

      preparedReport = [
        '📋 SK EXAMS COUNTDOWN — USER REPORT',
        `Category: ${cat}`,
        examName ? `Exam: ${examName}` : null,
        curDate ? `Current Date Shown: ${curDate}` : null,
        newDate ? `Correct Date: ${newDate}` : null,
        `Description: ${desc}`,
        extra ? `Additional Info: ${extra}` : null,
        `Page URL: ${window.location.href}`,
        `Build Version: 2.1.0`,
        `Submitted (IST): ${istNow}`
      ].filter(Boolean).join('\n');

      statusSteps = ['Report prepared'];
      try {
        await navigator.clipboard.writeText(preparedReport);
        statusSteps.push('Report copied to clipboard');
      } catch {
        statusSteps.push('Ready to copy manually');
      }

      window.open(TELEGRAM_BOT_URL, '_blank', 'noopener,noreferrer');
      statusSteps.push('Telegram bot opened');
      draw();
    });

    container.querySelector('#rp-copy-again')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(preparedReport);
        showToast('Report copied to clipboard!');
      } catch {
        showToast('Copy failed — please select and copy the text box.');
      }
    });
  };

  draw();
};

PlatformViews.privacy = function (container) {
  StudentStore.recordRecentTool('/privacy', 'Privacy & Data');
  const draw = () => {
    const usageKb = StudentStore.getStorageUsageKB();
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Privacy & Local Data Management</h1>
          <p class="section-desc">Zero accounts, zero cloud databases — your study data stays strictly on your device.</p>
        </div>
      </div>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.05rem;margin-bottom:0.5rem;">How Your Data Is Stored</h2>
        <p class="row-meta" style="font-size:0.9rem;line-height:1.6;">
          All personal settings, study plans, tasks, syllabus progress, focus sessions, notes, flashcards, quiz history, and custom countdowns are stored strictly inside your browser's localStorage. Nothing is uploaded to any external database.<br /><br />
          <strong>Global Live Visitor Count Exception:</strong> Only a temporary, random anonymous presence ID is shared with the Cloudflare Workers Durable Object to count active online visitors. It expires automatically after 45 seconds of inactivity and stores zero personal data, IP addresses, or study history.
        </p>
        <div style="margin-top:0.85rem;"><span class="status-badge status-official">Local Storage Used: ~${usageKb} KB</span></div>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.05rem;margin-bottom:0.85rem;">Backup, Restore & Clear</h2>
        <div style="display:flex;gap:0.65rem;flex-wrap:wrap;align-items:center;">
          <button type="button" class="btn btn-primary" id="prv-export-btn">Export Personal Data (JSON)</button>
          <label class="btn btn-secondary" style="cursor:pointer;">
            Import / Restore Backup (JSON)
            <input type="file" id="prv-import-file" accept="application/json" style="display:none;" />
          </label>
          <button type="button" class="btn btn-danger" id="prv-clear-btn">Clear All Personal Data</button>
        </div>
      </section>
    `;

    container.querySelector('#prv-export-btn')?.addEventListener('click', () => {
      const blob = new Blob([StudentStore.exportAllJson()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sk-exams-backup-${getISTDateString()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Backup JSON exported!');
    });

    container.querySelector('#prv-import-file')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        StudentStore.importAllJson(text);
        renderShellChrome();
        showToast('Personal data restored successfully!');
        draw();
      } catch (err) {
        showToast('Import failed: ' + err.message);
      }
    });

    container.querySelector('#prv-clear-btn')?.addEventListener('click', () => {
      if (window.confirm('This will permanently delete all locally saved study plans, tasks, notes, syllabus progress, favourites, and custom countdowns on this device. Continue?')) {
        StudentStore.clearPersonalData();
        showToast('All personal local data cleared.');
        draw();
      }
    });
  };

  draw();
};
