// IST-Safe Exam Calendar (Monthly/Weekly) + Revision Manager, Notes, Flashcards & Bookmarks Organizer
const CAT_COLORS = {
  medical: '#ec4899',
  engineering: '#6366f1',
  'national-competitive': '#22d3ee',
  'central-govt': '#f59e0b',
  'rajasthan-govt': '#fb7185',
  'cbse-icse': '#10b981',
  'state-boards': '#38bdf8',
  defence: '#ef4444',
  university: '#a855f7',
  'banking-railway': '#14b8a6',
  'other-state-govt': '#eab308',
  'other-important': '#94a3b8'
};

PlatformViews.calendar = function (container) {
  StudentStore.recordRecentTool('/calendar', 'Exam Calendar');
  const todayIST = getISTDateString();
  let [year, month] = todayIST.split('-').map(Number); // month 1..12
  let selectedDate = todayIST;
  let viewMode = 'month'; // month | week
  let catFilter = 'all';

  const getEventsForDate = (ds) => {
    const exams = ExamDB.exams.filter((e) => {
      if (!e.date) return false;
      if (catFilter !== 'all' && e.category !== catFilter) return false;
      return getISTDateString(new Date(e.date)) === ds;
    });
    const d = StudentStore.get();
    const todos = d.todos.filter((tItem) => tItem.deadline === ds);
    const plans = d.studyPlans.filter((p) => p.date === ds);
    return { exams, todos, plans };
  };

  const draw = () => {
    const firstDay = new Date(`${year}-${String(month).padStart(2, '0')}-01T12:00:00+05:30`);
    const monthLabel = new Intl.DateTimeFormat(Store.getSettings().lang === 'hi' ? 'hi-IN' : 'en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'long',
      year: 'numeric'
    }).format(firstDay);

    let cells = [];
    if (viewMode === 'month') {
      const startDow = firstDay.getDay();
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let i = 0; i < startDow; i++) cells.push(null);
      for (let day = 1; day <= daysInMonth; day++) {
        cells.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      }
    } else {
      const selDow = new Date(`${selectedDate}T12:00:00+05:30`).getDay();
      for (let i = 0; i < 7; i++) {
        cells.push(addDaysIST(selectedDate, i - selDow));
      }
    }

    const selEvents = getEventsForDate(selectedDate);

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Exam & Study Calendar (IST)</h1>
          <p class="section-desc">All dates aligned strictly to Asia/Kolkata (+05:30) with zero timezone shift.</p>
        </div>
        <div class="chip-row">
          <button type="button" class="filter-chip ${viewMode === 'month' ? 'active' : ''}" id="cal-m-btn">Monthly</button>
          <button type="button" class="filter-chip ${viewMode === 'week' ? 'active' : ''}" id="cal-w-btn">Weekly</button>
        </div>
      </div>

      <div class="filter-bar">
        <button type="button" class="btn btn-secondary btn-sm" id="cal-prev">← Prev</button>
        <strong style="min-width:155px;text-align:center;">${escapeHtml(monthLabel)}</strong>
        <button type="button" class="btn btn-secondary btn-sm" id="cal-next">Next →</button>
        <button type="button" class="btn btn-secondary btn-sm" id="cal-today">Today</button>
        <select id="cal-cat-filter" class="input-field" style="margin-left:auto;">
          <option value="all">All Categories</option>
          ${EXAM_CATEGORIES.map((c) => `<option value="${c.id}" ${catFilter === c.id ? 'selected' : ''}>${escapeHtml(ExamDB.getCategoryName(c))}</option>`).join('')}
        </select>
      </div>

      <section class="panel-card">
        <div class="calendar-grid" style="margin-bottom:0.35rem;">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<div class="cal-head-cell">${d}</div>`).join('')}
        </div>
        <div class="calendar-grid">
          ${cells.map((ds) => {
            if (!ds) return `<div class="cal-day-cell muted" style="cursor:default;"></div>`;
            const ev = getEventsForDate(ds);
            const dots = [
              ...ev.exams.map((e) => `<span class="cal-dot" style="background:${CAT_COLORS[e.category] || '#818cf8'};" title="${escapeHtml(e.shortName)}"></span>`),
              ...ev.todos.slice(0, 2).map(() => `<span class="cal-dot" style="background:#fbbf24;" title="Task"></span>`),
              ...ev.plans.slice(0, 2).map(() => `<span class="cal-dot" style="background:#34d399;" title="Study Plan"></span>`)
            ];
            return `
              <button type="button" class="cal-day-cell ${ds === todayIST ? 'today' : ''} ${ds === selectedDate ? 'selected' : ''}" data-cal-day="${ds}">
                <strong style="font-size:0.84rem;">${Number(ds.slice(8))}</strong>
                <div class="cal-dots">${dots.join('')}</div>
              </button>
            `;
          }).join('')}
        </div>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.05rem;margin-bottom:0.85rem;">Schedule for ${selectedDate}</h2>
        ${selEvents.exams.length ? `
          <div class="item-list" style="margin-bottom:0.85rem;">
            ${selEvents.exams.map((e) => {
              const badge = ExamDB.getStatusBadgeMeta(e);
              return `
                <div class="list-row-card" style="cursor:pointer;" data-open-exam="${escapeHtml(e.id)}">
                  <div>
                    <div class="row-title">${escapeHtml(ExamDB.getExamName(e))}</div>
                    <div class="row-meta">${escapeHtml(e.conductingBody || '')} • ${escapeHtml(ExamDB.formatISTDate(e.date, true))}</div>
                  </div>
                  <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
        ${selEvents.plans.length ? `
          <div class="item-list" style="margin-bottom:0.85rem;">
            ${selEvents.plans.map((p) => `<div class="list-row-card"><div><div class="row-title">Study Plan: ${escapeHtml(p.subject)} — ${escapeHtml(p.topic)}</div><div class="row-meta">${p.startTime || ''} • ${p.durationMin}m</div></div></div>`).join('')}
          </div>
        ` : ''}
        ${selEvents.todos.length ? `
          <div class="item-list">
            ${selEvents.todos.map((td) => `<div class="list-row-card"><div><div class="row-title">Task Due: ${escapeHtml(td.title)}</div><div class="row-meta">Priority: ${td.priority}</div></div></div>`).join('')}
          </div>
        ` : ''}
        ${(!selEvents.exams.length && !selEvents.plans.length && !selEvents.todos.length) ? '<p class="row-meta">No exams or personal study deadlines scheduled on this date.</p>' : ''}
      </section>
    `;

    container.querySelector('#cal-m-btn')?.addEventListener('click', () => { viewMode = 'month'; draw(); });
    container.querySelector('#cal-w-btn')?.addEventListener('click', () => { viewMode = 'week'; draw(); });
    container.querySelector('#cal-prev')?.addEventListener('click', () => {
      if (viewMode === 'month') { month -= 1; if (month < 1) { month = 12; year -= 1; } }
      else { selectedDate = addDaysIST(selectedDate, -7); [year, month] = selectedDate.split('-').map(Number); }
      draw();
    });
    container.querySelector('#cal-next')?.addEventListener('click', () => {
      if (viewMode === 'month') { month += 1; if (month > 12) { month = 1; year += 1; } }
      else { selectedDate = addDaysIST(selectedDate, 7); [year, month] = selectedDate.split('-').map(Number); }
      draw();
    });
    container.querySelector('#cal-today')?.addEventListener('click', () => {
      selectedDate = todayIST;
      [year, month] = todayIST.split('-').map(Number);
      draw();
    });
    container.querySelector('#cal-cat-filter')?.addEventListener('change', (e) => { catFilter = e.target.value; draw(); });
    container.querySelectorAll('[data-cal-day]').forEach((b) => b.addEventListener('click', () => {
      selectedDate = b.getAttribute('data-cal-day');
      draw();
    }));
    bindExamCardEvents(container);
  };

  draw();
};

PlatformViews.notes = function (container) {
  StudentStore.recordRecentTool('/notes', 'Notes & Revisions');
  let activeTab = 'notes'; // notes | revisions | flashcards | bookmarks
  let searchQ = '';
  let fcIdx = 0;
  let fcFlipped = false;

  const draw = () => {
    const d = StudentStore.get();
    const today = getISTDateString();

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Notes, Revisions, Flashcards & Bookmarks</h1>
          <p class="section-desc">Your personal study organizer — everything stays private on your device.</p>
        </div>
      </div>

      <div class="tab-bar">
        <button type="button" class="tab-btn ${activeTab === 'notes' ? 'active' : ''}" data-n-tab="notes">Personal Notes (${d.notes.length})</button>
        <button type="button" class="tab-btn ${activeTab === 'revisions' ? 'active' : ''}" data-n-tab="revisions">Revision Manager (${d.revisions.length})</button>
        <button type="button" class="tab-btn ${activeTab === 'flashcards' ? 'active' : ''}" data-n-tab="flashcards">Flashcards (${d.flashcards.length})</button>
        <button type="button" class="tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}" data-n-tab="bookmarks">Bookmarks (${d.bookmarks.length})</button>
      </div>

      ${activeTab === 'notes' ? `
        <section class="panel-card">
          <form id="note-form" style="display:grid;gap:0.65rem;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.65rem;">
              <input id="nt-title" class="input-field" required placeholder="Note title..." />
              <input id="nt-sub" class="input-field" placeholder="Subject / Tag (e.g. Organic Chem)" />
            </div>
            <textarea id="nt-body" class="input-field" rows="3" required placeholder="Write formulas, key dates, or short revision notes..."></textarea>
            <button type="submit" class="btn btn-primary btn-sm" style="justify-self:start;">Save Note</button>
          </form>
        </section>
        <div class="filter-bar"><input type="search" id="nt-search" class="input-field" style="flex:1;" value="${escapeHtml(searchQ)}" placeholder="Search notes by title, content, or subject..." /></div>
        <div class="item-list">
          ${[...d.notes]
            .filter((n) => !searchQ.trim() || (n.title + ' ' + n.content + ' ' + (n.subject || '')).toLowerCase().includes(searchQ.toLowerCase()))
            .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
            .map((n) => `
              <div class="list-row-card">
                <div>
                  <div class="row-title">${n.pinned ? '📌 ' : ''}${escapeHtml(n.title)} ${n.subject ? `<span class="status-badge status-date-awaited">${escapeHtml(n.subject)}</span>` : ''}</div>
                  <p class="row-meta" style="white-space:pre-wrap;margin-top:0.4rem;">${escapeHtml(n.content)}</p>
                </div>
                <div style="display:flex;gap:0.35rem;">
                  <button type="button" class="btn btn-secondary btn-sm" data-nt-pin="${n.id}">${n.pinned ? 'Unpin' : 'Pin'}</button>
                  <button type="button" class="icon-btn" data-nt-del="${n.id}">${icon('trash')}</button>
                </div>
              </div>
            `).join('') || '<div class="empty-state"><h3>No notes yet</h3><p>Save quick formulas, mnemonics, or exam notes above.</p></div>'}
        </div>
      ` : ''}

      ${activeTab === 'revisions' ? `
        <section class="panel-card">
          <form id="rev-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0.65rem;">
            <input id="rv-sub" class="input-field" required placeholder="Subject" />
            <input id="rv-topic" class="input-field" required placeholder="Topic to revise" />
            <input id="rv-date" type="date" class="input-field" value="${today}" />
            <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;"><input type="checkbox" id="rv-diff" /> Difficult topic</label>
            <button type="submit" class="btn btn-primary btn-sm">Schedule Revision</button>
          </form>
        </section>
        <div class="item-list">
          ${d.revisions.map((r) => `
            <div class="list-row-card">
              <div>
                <div class="row-title">${escapeHtml(r.subject)} — ${escapeHtml(r.topic)} ${r.difficult ? '<span class="status-badge status-postponed">Difficult</span>' : ''}</div>
                <div class="row-meta">Next Revision: ${escapeHtml(r.nextDate)} • Completed: ${r.completedCount || 0} times</div>
              </div>
              <div style="display:flex;gap:0.35rem;">
                <button type="button" class="btn btn-primary btn-sm" data-rv-done="${r.id}">✓ Mark Revised (+3d)</button>
                <button type="button" class="icon-btn" data-rv-del="${r.id}">${icon('trash')}</button>
              </div>
            </div>
          `).join('') || '<div class="empty-state"><h3>No revisions scheduled</h3><p>Add topics above to track your revision cycles.</p></div>'}
        </div>
      ` : ''}

      ${activeTab === 'flashcards' ? `
        <section class="panel-card">
          <form id="fc-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.65rem;">
            <input id="fc-sub" class="input-field" placeholder="Subject" value="General" />
            <input id="fc-front" class="input-field" required placeholder="Question / Front" />
            <input id="fc-back" class="input-field" required placeholder="Answer / Back" />
            <button type="submit" class="btn btn-primary btn-sm">Add Flashcard</button>
          </form>
        </section>
        ${d.flashcards.length ? (() => {
          const card = d.flashcards[fcIdx % d.flashcards.length];
          return `
            <section class="panel-card">
              <div class="exam-card-head" style="margin-bottom:0.75rem;">
                <span class="status-badge status-date-awaited">${escapeHtml(card.subject)} • Card ${(fcIdx % d.flashcards.length) + 1}/${d.flashcards.length}</span>
                <span class="row-meta">Next review: ${escapeHtml(card.nextReview || today)}</span>
              </div>
              <div class="flashcard-stage" id="fc-flip-stage">
                <span class="kpi-label">${fcFlipped ? 'ANSWER' : 'QUESTION (Tap to flip)'}</span>
                <div style="font-size:1.2rem;font-weight:700;">${escapeHtml(fcFlipped ? card.back : card.front)}</div>
              </div>
              <div style="display:flex;justify-content:center;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;">
                <button type="button" class="btn btn-danger btn-sm" data-fc-rate="difficult">Difficult (+1d)</button>
                <button type="button" class="btn btn-secondary btn-sm" data-fc-rate="medium">Medium (+3d)</button>
                <button type="button" class="btn btn-primary btn-sm" data-fc-rate="easy">Easy (+7d)</button>
                <button type="button" class="icon-btn" id="fc-del-cur" title="Delete Card">${icon('trash')}</button>
              </div>
            </section>
          `;
        })() : '<div class="empty-state"><h3>No flashcards yet</h3><p>Create flashcards above for spaced-repetition practice.</p></div>'}
      ` : ''}

      ${activeTab === 'bookmarks' ? `
        <section class="panel-card">
          <form id="bm-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0.65rem;">
            <input id="bm-title" class="input-field" required placeholder="Resource title" />
            <input id="bm-url" type="url" class="input-field" required placeholder="https://..." />
            <input id="bm-cat" class="input-field" placeholder="Category / Tag" value="Study Link" />
            <button type="submit" class="btn btn-primary btn-sm">Save Bookmark</button>
          </form>
        </section>
        <div class="item-list">
          ${d.bookmarks.map((b) => `
            <div class="list-row-card">
              <div>
                <div class="row-title"><a href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.title)}</a></div>
                <div class="row-meta">${escapeHtml(b.category || '')} • ${escapeHtml(b.url)}</div>
              </div>
              <button type="button" class="icon-btn" data-bm-del="${b.id}">${icon('trash')}</button>
            </div>
          `).join('') || '<div class="empty-state"><h3>No bookmarks saved</h3><p>Save helpful educational links here for quick offline reference.</p></div>'}
        </div>
      ` : ''}
    `;

    container.querySelectorAll('[data-n-tab]').forEach((b) => b.addEventListener('click', () => { activeTab = b.getAttribute('data-n-tab'); draw(); }));

    container.querySelector('#note-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      d.notes.unshift({
        id: `nt_${Date.now()}`,
        title: container.querySelector('#nt-title').value.trim(),
        subject: container.querySelector('#nt-sub').value.trim(),
        content: container.querySelector('#nt-body').value.trim(),
        pinned: false,
        updatedAt: new Date().toISOString()
      });
      StudentStore.save();
      showToast('Note saved!');
      draw();
    });
    container.querySelector('#nt-search')?.addEventListener('input', (e) => {
      searchQ = e.target.value; draw();
      const inp = container.querySelector('#nt-search');
      if (inp) { inp.focus(); inp.setSelectionRange(searchQ.length, searchQ.length); }
    });
    container.querySelectorAll('[data-nt-pin]').forEach((b) => b.addEventListener('click', () => {
      const n = d.notes.find((x) => x.id === b.getAttribute('data-nt-pin'));
      if (n) { n.pinned = !n.pinned; StudentStore.save(); draw(); }
    }));
    container.querySelectorAll('[data-nt-del]').forEach((b) => b.addEventListener('click', () => {
      d.notes = d.notes.filter((x) => x.id !== b.getAttribute('data-nt-del')); StudentStore.save(); draw();
    }));

    container.querySelector('#rev-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      d.revisions.unshift({
        id: `rv_${Date.now()}`,
        subject: container.querySelector('#rv-sub').value.trim(),
        topic: container.querySelector('#rv-topic').value.trim(),
        nextDate: container.querySelector('#rv-date').value || today,
        difficult: container.querySelector('#rv-diff').checked,
        completedCount: 0
      });
      StudentStore.save();
      draw();
    });
    container.querySelectorAll('[data-rv-done]').forEach((b) => b.addEventListener('click', () => {
      const r = d.revisions.find((x) => x.id === b.getAttribute('data-rv-done'));
      if (r) {
        r.completedCount = (r.completedCount || 0) + 1;
        r.nextDate = addDaysIST(today, r.difficult ? 2 : 3);
        StudentStore.recordStudyActivity();
        StudentStore.save();
        showToast('Revision logged!');
        draw();
      }
    }));
    container.querySelectorAll('[data-rv-del]').forEach((b) => b.addEventListener('click', () => {
      d.revisions = d.revisions.filter((x) => x.id !== b.getAttribute('data-rv-del')); StudentStore.save(); draw();
    }));

    container.querySelector('#fc-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      d.flashcards.unshift({
        id: `fc_${Date.now()}`,
        subject: container.querySelector('#fc-sub').value.trim() || 'General',
        front: container.querySelector('#fc-front').value.trim(),
        back: container.querySelector('#fc-back').value.trim(),
        rating: 'medium',
        nextReview: today,
        reviewsCount: 0
      });
      StudentStore.save();
      fcIdx = 0; fcFlipped = false;
      draw();
    });
    container.querySelector('#fc-flip-stage')?.addEventListener('click', () => { fcFlipped = !fcFlipped; draw(); });
    container.querySelectorAll('[data-fc-rate]').forEach((b) => b.addEventListener('click', () => {
      const card = d.flashcards[fcIdx % d.flashcards.length];
      if (!card) return;
      const rate = b.getAttribute('data-fc-rate');
      const gap = rate === 'easy' ? 7 : rate === 'medium' ? 3 : 1;
      card.rating = rate;
      card.nextReview = addDaysIST(today, gap);
      card.reviewsCount = (card.reviewsCount || 0) + 1;
      StudentStore.recordStudyActivity();
      StudentStore.save();
      fcIdx = (fcIdx + 1) % d.flashcards.length;
      fcFlipped = false;
      draw();
    }));
    container.querySelector('#fc-del-cur')?.addEventListener('click', () => {
      const card = d.flashcards[fcIdx % d.flashcards.length];
      if (card) {
        d.flashcards = d.flashcards.filter((x) => x.id !== card.id);
        StudentStore.save();
        fcIdx = 0; fcFlipped = false;
        draw();
      }
    });

    container.querySelector('#bm-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      d.bookmarks.unshift({
        id: `bm_${Date.now()}`,
        title: container.querySelector('#bm-title').value.trim(),
        url: container.querySelector('#bm-url').value.trim(),
        category: container.querySelector('#bm-cat').value.trim() || 'Study Link',
        createdAt: new Date().toISOString()
      });
      StudentStore.save();
      draw();
    });
    container.querySelectorAll('[data-bm-del]').forEach((b) => b.addEventListener('click', () => {
      d.bookmarks = d.bookmarks.filter((x) => x.id !== b.getAttribute('data-bm-del')); StudentStore.save(); draw();
    }));
  };

  draw();
};
