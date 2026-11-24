// Reusable View Renderers for All Application Routes
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Live 1-second ticker for all visible exam & spotlight cards outside the detail view
const LiveCardTicker = {
  timerId: null,

  start(root) {
    this.stop();
    if (!root) return;
    const updateAll = () => {
      const nodes = root.querySelectorAll('[data-live-countdown]');
      if (!nodes.length) {
        this.stop();
        return;
      }
      nodes.forEach((el) => {
        const iso = el.getAttribute('data-live-countdown');
        if (iso) {
          el.textContent = ExamDB.formatCompactCountdown(iso);
        }
      });
    };
    updateAll();
    this.timerId = setInterval(updateAll, 1000);
  },

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
};

function canRunLiveCardTimer(exam) {
  if (!exam || !exam.date) return false;
  const st = ExamDB.getEffectiveStatus(exam);
  return st !== 'postponed' && st !== 'cancelled' && st !== 'date-awaited' && st !== 'expired';
}

function renderExamCard(exam) {
  const badge = ExamDB.getStatusBadgeMeta(exam);
  const saved = Store.isFavourite(exam.id);
  const isLive = canRunLiveCardTimer(exam);
  const fallbackLabel = exam.date
    ? ExamDB.formatISTDate(exam.date)
    : (exam.expectedWindow || t('statusDateAwaited'));

  return `
    <article class="exam-card" data-open-exam="${escapeHtml(exam.id)}" tabindex="0" role="button">
      <div>
        <div class="exam-card-head">
          <div>
            <h3 class="exam-card-title">${escapeHtml(ExamDB.getExamName(exam))}</h3>
            <p class="exam-card-sub">${escapeHtml(exam.conductingBody || (exam.custom ? t('navMyCountdown') : ''))}</p>
          </div>
          <button type="button" class="fav-toggle ${saved ? 'saved' : ''}" data-fav-id="${escapeHtml(exam.id)}" aria-label="${saved ? t('savedFavourite') : t('addFavourite')}" title="${saved ? t('savedFavourite') : t('addFavourite')}">
            ${saved ? icon('heartFilled') : icon('heart')}
          </button>
        </div>
      </div>
      <div class="exam-card-foot">
        <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
        ${isLive
          ? `<span data-live-countdown="${escapeHtml(exam.date)}" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--accent-light);font-variant-numeric:tabular-nums;">${escapeHtml(ExamDB.formatCompactCountdown(exam.date))}</span>`
          : `<span style="color:var(--text-secondary);font-weight:600;">${escapeHtml(fallbackLabel)}</span>`}
      </div>
    </article>
  `;
}

function bindExamCardEvents(root) {
  root.querySelectorAll('[data-fav-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-fav-id');
      const nowSaved = Store.toggleFavourite(id);
      btn.classList.toggle('saved', nowSaved);
      btn.innerHTML = nowSaved ? icon('heartFilled') : icon('heart');
      showToast(nowSaved ? t('toastSavedFav') : t('toastRemovedFav'));
      if (Router.currentPath === '/favourites') Router.render();
    });
  });

  root.querySelectorAll('[data-open-exam]').forEach((card) => {
    const open = () => Router.navigate(`/exam/${encodeURIComponent(card.getAttribute('data-open-exam'))}`);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  LiveCardTicker.start(root);
}

const Views = {
  home(container) {
    const spotlight = ExamDB.getSpotlight();
    const lastUpd = ExamDB.formatISTDate(ExamDB.lastUpdated);

    container.innerHTML = `
      <section class="hero-banner">
        <div class="hero-top-row">
          <span class="pill-badge">${icon('sparkles')} ${t('heroBadge')}</span>
          <span class="last-updated-chip">${icon('clock')} ${t('lastUpdatedLabel')} <strong>${escapeHtml(lastUpd)}</strong></span>
        </div>
        <h1 class="hero-title">${t('heroTitlePrefix')} <span>${t('heroTitleHighlight')}</span></h1>
        <p class="hero-subtitle">${t('heroSubtitle')}</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary" data-nav="/categories">${icon('grid')} ${t('browseCategories')}</button>
          <button type="button" class="btn btn-secondary" data-nav="/my-countdown">${icon('plus')} ${t('createCustom')}</button>
          <button type="button" class="btn btn-secondary" id="hero-search-btn">${icon('search')} ${t('searchTitle')}</button>
        </div>
      </section>

      <div class="section-header">
        <div>
          <h2 class="section-title">${t('spotlightTitle')}</h2>
          <p class="section-desc">${t('spotlightDesc')}</p>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" data-nav="/exams">${t('viewAll')} ${icon('arrowRight')}</button>
      </div>
      <div class="spotlight-grid">
        ${spotlight.map((exam) => {
          const badge = ExamDB.getStatusBadgeMeta(exam);
          const isLive = canRunLiveCardTimer(exam);
          return `
            <article class="spotlight-card" data-open-exam="${escapeHtml(exam.id)}" tabindex="0" role="button">
              <div class="exam-card-head">
                <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
                <span style="font-size:0.78rem;color:var(--text-secondary);">${escapeHtml(ExamDB.formatISTDate(exam.date))}</span>
              </div>
              <h3 class="exam-card-title">${escapeHtml(ExamDB.getExamName(exam))}</h3>
              <div class="spotlight-days" style="font-size:clamp(1.12rem, 1.8vw, 1.32rem);white-space:nowrap;font-variant-numeric:tabular-nums;" ${isLive ? `data-live-countdown="${escapeHtml(exam.date)}"` : ''}>
                ${isLive ? escapeHtml(ExamDB.formatCompactCountdown(exam.date)) : escapeHtml(t('statusDateAwaited'))}
              </div>
              <p class="exam-card-sub">${escapeHtml(exam.expectedWindow || '')}</p>
            </article>
          `;
        }).join('')}
      </div>

      <div class="section-header">
        <div>
          <h2 class="section-title">${t('categoriesTitle')}</h2>
          <p class="section-desc">${t('categoriesDesc')}</p>
        </div>
      </div>
      <div class="category-grid">
        ${EXAM_CATEGORIES.map((cat) => {
          const count = ExamDB.getByCategory(cat.id).length;
          return `
            <button type="button" class="category-card" data-nav="/category/${escapeHtml(cat.id)}">
              <div class="category-card-top">
                <span class="category-icon">${icon(cat.icon)}</span>
                <span class="category-count">${count} ${count === 1 ? t('examCountSingular') : t('examsCountSuffix')}</span>
              </div>
              <div class="category-title">${escapeHtml(ExamDB.getCategoryName(cat))}</div>
              <div class="category-desc">${escapeHtml(ExamDB.getCategoryDesc(cat))}</div>
            </button>
          `;
        }).join('')}
      </div>
    `;

    container.querySelector('#hero-search-btn')?.addEventListener('click', () => SearchModal.open());
    bindExamCardEvents(container);
  },

  categories(container) {
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.6rem;">${t('categoriesTitle')}</h1>
          <p class="section-desc">${t('categoriesDesc')}</p>
        </div>
        <span class="last-updated-chip">${t('lastUpdatedLabel')} ${escapeHtml(ExamDB.formatISTDate(ExamDB.lastUpdated))}</span>
      </div>
      <div class="category-grid">
        ${EXAM_CATEGORIES.map((cat) => {
          const count = ExamDB.getByCategory(cat.id).length;
          return `
            <button type="button" class="category-card" data-nav="/category/${escapeHtml(cat.id)}">
              <div class="category-card-top">
                <span class="category-icon">${icon(cat.icon)}</span>
                <span class="category-count">${count} ${count === 1 ? t('examCountSingular') : t('examsCountSuffix')}</span>
              </div>
              <div class="category-title">${escapeHtml(ExamDB.getCategoryName(cat))}</div>
              <div class="category-desc">${escapeHtml(ExamDB.getCategoryDesc(cat))}</div>
            </button>
          `;
        }).join('')}
      </div>
    `;
  },

  categoryDetail(container, catId) {
    const cat = ExamDB.getCategory(catId);
    if (!cat) {
      this.notFound(container);
      return;
    }

    let statusFilter = 'all';
    let sortMode = 'priority';

    const draw = () => {
      let list = ExamDB.getByCategory(catId, sortMode);
      if (statusFilter !== 'all') {
        list = list.filter((e) => ExamDB.getEffectiveStatus(e) === statusFilter);
      }

      container.innerHTML = `
        <div class="countdown-topbar">
          <button type="button" class="btn btn-secondary btn-sm" data-nav="/categories">${icon('arrowLeft')} ${t('navCategories')}</button>
          <span class="last-updated-chip">${list.length} ${list.length === 1 ? t('examCountSingular') : t('examsCountSuffix')}</span>
        </div>
        <div class="section-header" style="margin-top:0.25rem;">
          <div>
            <h1 class="section-title" style="font-size:1.55rem;">${escapeHtml(ExamDB.getCategoryName(cat))}</h1>
            <p class="section-desc">${escapeHtml(ExamDB.getCategoryDesc(cat))}</p>
          </div>
        </div>
        <div class="filter-bar">
          <div class="chip-row">
            ${['all', 'official', 'tentative', 'date-awaited', 'postponed'].map((st) => `
              <button type="button" class="filter-chip ${statusFilter === st ? 'active' : ''}" data-st="${st}">
                ${st === 'all' ? t('allStatuses') : t({
                  official: 'statusOfficial',
                  tentative: 'statusTentative',
                  'date-awaited': 'statusDateAwaited',
                  postponed: 'statusPostponed'
                }[st])}
              </button>
            `).join('')}
          </div>
          <select class="input-field" id="cat-sort-select" aria-label="Sort exams" style="margin-left:auto;">
            <option value="priority" ${sortMode === 'priority' ? 'selected' : ''}>${t('sortPriority')}</option>
            <option value="soonest" ${sortMode === 'soonest' ? 'selected' : ''}>${t('sortSoonest')}</option>
            <option value="name" ${sortMode === 'name' ? 'selected' : ''}>${t('sortName')}</option>
          </select>
        </div>
        ${list.length ? `<div class="exam-grid">${list.map(renderExamCard).join('')}</div>` : `
          <div class="empty-state">
            <h3>${t('noSearchResults')}</h3>
            <p>${t('noSearchHint')}</p>
          </div>
        `}
      `;

      container.querySelectorAll('[data-st]').forEach((btn) => {
        btn.addEventListener('click', () => {
          statusFilter = btn.getAttribute('data-st');
          draw();
        });
      });
      container.querySelector('#cat-sort-select')?.addEventListener('change', (e) => {
        sortMode = e.target.value;
        draw();
      });
      bindExamCardEvents(container);
    };

    draw();
  },

  allExams(container) {
    let query = '';
    let catFilter = 'all';
    let statusFilter = 'all';
    let sortMode = 'priority';

    const draw = () => {
      let list = query ? ExamDB.search(query) : ExamDB.sortExams(ExamDB.exams, sortMode);
      if (catFilter !== 'all') list = list.filter((e) => e.category === catFilter);
      if (statusFilter !== 'all') list = list.filter((e) => ExamDB.getEffectiveStatus(e) === statusFilter);
      list = ExamDB.sortExams(list, sortMode);

      container.innerHTML = `
        <div class="section-header" style="margin-top:0;">
          <div>
            <h1 class="section-title" style="font-size:1.55rem;">${t('navAllExams')}</h1>
            <p class="section-desc">${t('lastUpdatedLabel')} ${escapeHtml(ExamDB.formatISTDate(ExamDB.lastUpdated))}</p>
          </div>
        </div>
        <div class="filter-bar">
          <input type="search" id="all-exams-search" class="input-field" style="flex:1;min-width:220px;" value="${escapeHtml(query)}" placeholder="${t('searchPlaceholder')}" />
          <select id="all-cat-filter" class="input-field" aria-label="Filter by category">
            <option value="all">${t('navCategories')} (${EXAM_CATEGORIES.length})</option>
            ${EXAM_CATEGORIES.map((c) => `<option value="${c.id}" ${catFilter === c.id ? 'selected' : ''}>${escapeHtml(ExamDB.getCategoryName(c))}</option>`).join('')}
          </select>
          <select id="all-status-filter" class="input-field" aria-label="Filter by status">
            <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>${t('allStatuses')}</option>
            <option value="official" ${statusFilter === 'official' ? 'selected' : ''}>${t('statusOfficial')}</option>
            <option value="tentative" ${statusFilter === 'tentative' ? 'selected' : ''}>${t('statusTentative')}</option>
            <option value="date-awaited" ${statusFilter === 'date-awaited' ? 'selected' : ''}>${t('statusDateAwaited')}</option>
            <option value="postponed" ${statusFilter === 'postponed' ? 'selected' : ''}>${t('statusPostponed')}</option>
          </select>
          <select id="all-sort-select" class="input-field" aria-label="Sort exams">
            <option value="priority" ${sortMode === 'priority' ? 'selected' : ''}>${t('sortPriority')}</option>
            <option value="soonest" ${sortMode === 'soonest' ? 'selected' : ''}>${t('sortSoonest')}</option>
            <option value="name" ${sortMode === 'name' ? 'selected' : ''}>${t('sortName')}</option>
          </select>
        </div>
        ${list.length ? `<div class="exam-grid">${list.map(renderExamCard).join('')}</div>` : `
          <div class="empty-state">
            <h3>${t('noSearchResults')}</h3>
            <p>${t('noSearchHint')}</p>
          </div>
        `}
      `;

      const searchEl = container.querySelector('#all-exams-search');
      searchEl?.addEventListener('input', (e) => {
        query = e.target.value;
        draw();
        const nextInput = container.querySelector('#all-exams-search');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(query.length, query.length);
        }
      });
      container.querySelector('#all-cat-filter')?.addEventListener('change', (e) => { catFilter = e.target.value; draw(); });
      container.querySelector('#all-status-filter')?.addEventListener('change', (e) => { statusFilter = e.target.value; draw(); });
      container.querySelector('#all-sort-select')?.addEventListener('change', (e) => { sortMode = e.target.value; draw(); });
      bindExamCardEvents(container);
    };

    draw();
  },

  examDetail(container, examId) {
    const exam = ExamDB.getById(examId);
    if (!exam) {
      this.notFound(container);
      return;
    }

    const badge = ExamDB.getStatusBadgeMeta(exam);
    const effective = ExamDB.getEffectiveStatus(exam);
    const hasLiveTimer = Boolean(exam.date) && effective !== 'postponed' && effective !== 'cancelled' && effective !== 'date-awaited';
    const isFav = Store.isFavourite(exam.id);
    const showMascot = Store.getSettings().mascotEnabled;
    const cat = exam.category ? ExamDB.getCategory(exam.category) : null;
    const soundOn = Store.getSettings().soundEnabled;

    container.innerHTML = `
      <div class="countdown-topbar">
        <button type="button" class="btn btn-secondary btn-sm" id="cd-back-btn">${icon('arrowLeft')} ${t('back')}</button>
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" id="cd-fav-btn">
            ${isFav ? icon('heartFilled') : icon('heart')} ${isFav ? t('savedFavourite') : t('addFavourite')}
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="cd-music-btn">${icon('music')} ${t('musicBreak')}</button>
        </div>
      </div>

      <div class="countdown-stage ${showMascot ? 'with-mascot' : ''}">
        <div>
          <section class="countdown-hero-card">
            <div class="countdown-badges">
              <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
              ${cat ? `<button type="button" class="filter-chip" data-nav="/category/${escapeHtml(cat.id)}">${escapeHtml(ExamDB.getCategoryName(cat))}</button>` : ''}
            </div>
            <h1 class="countdown-heading">${escapeHtml(ExamDB.getExamName(exam, true))}</h1>
            <p class="countdown-body-meta">${escapeHtml(ExamDB.getExamDescription(exam))}</p>

            ${hasLiveTimer ? `
              <div class="progress-track"><div class="progress-fill" id="cd-progress-fill"></div></div>
              <div class="progress-meta">
                <span>${t('progressJourney')}</span>
                <strong id="cd-progress-pct">0%</strong>
              </div>
              <div class="timer-grid" aria-live="off">
                <div class="digit-card"><span class="digit-value" id="cd-days">00</span><div class="digit-label">${t('days')}</div></div>
                <div class="digit-card"><span class="digit-value" id="cd-hours">00</span><div class="digit-label">${t('hours')}</div></div>
                <div class="digit-card"><span class="digit-value" id="cd-minutes">00</span><div class="digit-label">${t('minutes')}</div></div>
                <div class="digit-card"><span class="digit-value" id="cd-seconds">00</span><div class="digit-label">${t('seconds')}</div></div>
              </div>
              <div id="cd-expired-banner" class="status-callout" style="display:${effective === 'expired' ? 'block' : 'none'};">
                <div class="status-callout-title">${t('expiredHeadline')}</div>
                <div class="status-callout-text">${escapeHtml(ExamDB.getStatusNote(exam))}</div>
              </div>
            ` : `
              <div class="status-callout">
                <div class="status-callout-title">${effective === 'postponed' ? t('postponedHeadline') : t('dateAwaitedHeadline')}</div>
                <div class="status-callout-text">${escapeHtml(ExamDB.getStatusNote(exam) || exam.expectedWindow || '')}</div>
              </div>
            `}

            ${hasLiveTimer && ExamDB.getStatusNote(exam) ? `
              <div class="status-callout" style="margin-top:0.5rem;">
                <div class="status-callout-text">${escapeHtml(ExamDB.getStatusNote(exam))}</div>
              </div>
            ` : ''}

            <div class="action-toolbar">
              ${hasLiveTimer ? `<button type="button" class="btn btn-secondary btn-sm" id="cd-remind-btn">${icon('bell')} ${t('remindMe')}</button>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" id="cd-share-btn">${icon('share')} ${t('share')}</button>
              <button type="button" class="btn btn-secondary btn-sm" id="cd-copy-btn">${t('copyLink')}</button>
              ${hasLiveTimer ? `<button type="button" class="btn btn-secondary btn-sm" id="cd-sound-btn">${icon('volume')} ${soundOn ? t('soundOn') : t('soundOff')}</button>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" id="cd-fs-btn">${icon('expand')} ${t('fullscreen')}</button>
            </div>

            <div class="info-grid">
              <div class="info-tile">
                <div class="info-tile-label">${t('examDateLabel')}</div>
                <div class="info-tile-value">${escapeHtml(exam.date ? ExamDB.formatISTDate(exam.date, true) : (exam.expectedWindow || t('statusDateAwaited')))}</div>
              </div>
              <div class="info-tile">
                <div class="info-tile-label">${t('dayOfWeekLabel')}</div>
                <div class="info-tile-value">${escapeHtml(exam.date ? ExamDB.formatISTWeekday(exam.date) : '—')}</div>
              </div>
              <div class="info-tile">
                <div class="info-tile-label">${t('conductingBodyLabel')}</div>
                <div class="info-tile-value">${escapeHtml(exam.conductingBody || (exam.custom ? t('navMyCountdown') : '—'))}</div>
              </div>
              <div class="info-tile">
                <div class="info-tile-label">${t('lastVerifiedLabel')}</div>
                <div class="info-tile-value">${escapeHtml(exam.lastVerified || ExamDB.formatISTDate(ExamDB.lastUpdated))}</div>
              </div>
            </div>
          </section>

          ${exam.officialSourceUrl ? `
            <section class="exam-links-card">
              <h2 class="section-title" style="font-size:1.05rem;">${t('officialLinksTitle')}</h2>
              <div class="official-links-grid">
                <a class="btn btn-primary btn-sm" href="${escapeHtml(exam.officialSourceUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('officialPortal')}</a>
                ${exam.notificationUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.notificationUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('notificationLink')}</a>` : ''}
                ${exam.syllabusUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.syllabusUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('syllabusLink')}</a>` : ''}
                ${exam.admitCardUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.admitCardUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('admitCardLink')}</a>` : ''}
                ${exam.resultUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.resultUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('resultLink')}</a>` : ''}
              </div>
            </section>
          ` : ''}
        </div>

        ${showMascot ? `<aside id="mascot-stage" class="mascot-stage-wrap"></aside>` : ''}
      </div>
    `;

    container.querySelector('#cd-back-btn')?.addEventListener('click', () => {
      if (window.history.length > 1) window.history.back();
      else Router.navigate('/');
    });
    container.querySelector('#cd-fav-btn')?.addEventListener('click', (e) => {
      const nowSaved = Store.toggleFavourite(exam.id);
      e.currentTarget.innerHTML = `${nowSaved ? icon('heartFilled') : icon('heart')} ${nowSaved ? t('savedFavourite') : t('addFavourite')}`;
      showToast(nowSaved ? t('toastSavedFav') : t('toastRemovedFav'));
    });
    container.querySelector('#cd-music-btn')?.addEventListener('click', () => MusicPanel.open());
    container.querySelector('#cd-remind-btn')?.addEventListener('click', () => CountdownController.setupReminder(exam));
    container.querySelector('#cd-share-btn')?.addEventListener('click', () => CountdownController.shareExam(exam));
    container.querySelector('#cd-copy-btn')?.addEventListener('click', async () => {
      const url = `${window.location.origin}/exam/${encodeURIComponent(exam.id)}`;
      try {
        await navigator.clipboard.writeText(url);
        showToast(t('toastCopied'));
      } catch {
        showToast(url);
      }
    });
    container.querySelector('#cd-sound-btn')?.addEventListener('click', (e) => {
      const next = !Store.getSettings().soundEnabled;
      Store.updateSettings({ soundEnabled: next });
      e.currentTarget.innerHTML = `${icon('volume')} ${next ? t('soundOn') : t('soundOff')}`;
    });
    container.querySelector('#cd-fs-btn')?.addEventListener('click', () => CountdownController.toggleFullscreen());

    if (hasLiveTimer) CountdownController.start(exam);
    if (showMascot) MascotSystem.mount(container.querySelector('#mascot-stage'));
  },

  myCountdown(container) {
    let editingId = null;

    const draw = () => {
      const customs = Store.getCustoms();
      const editingItem = editingId ? customs.find((c) => c.id === editingId) : null;
      const tomorrow = new Date(Date.now() + 86400000);
      const defaultDate = editingItem && editingItem.date ? editingItem.date.slice(0, 10) : tomorrow.toISOString().slice(0, 10);
      const defaultTime = editingItem && editingItem.date ? editingItem.date.slice(11, 16) : '09:00';

      container.innerHTML = `
        <div class="section-header" style="margin-top:0;">
          <div>
            <h1 class="section-title" style="font-size:1.55rem;">${t('customTitle')}</h1>
            <p class="section-desc">${t('customDesc')}</p>
          </div>
        </div>

        <section class="panel-card">
          <h2 class="section-title" style="font-size:1.08rem;margin-bottom:1rem;">${t('customFormHeading')}</h2>
          <form id="custom-countdown-form" class="form-grid">
            <div>
              <label class="form-label" for="custom-name-input">${t('customNameLabel')}</label>
              <input id="custom-name-input" class="input-field" style="width:100%;" type="text" maxlength="60" required value="${escapeHtml(editingItem ? editingItem.shortName : '')}" placeholder="${t('customNamePlaceholder')}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label class="form-label" for="custom-date-input">${t('customDateLabel')}</label>
                <input id="custom-date-input" class="input-field" style="width:100%;" type="date" required value="${escapeHtml(defaultDate)}" />
              </div>
              <div>
                <label class="form-label" for="custom-time-input">${t('customTimeLabel')}</label>
                <input id="custom-time-input" class="input-field" style="width:100%;" type="time" required value="${escapeHtml(defaultTime)}" />
              </div>
            </div>
            <div>
              <label class="form-label" for="custom-note-input">${t('customNoteLabel')}</label>
              <input id="custom-note-input" class="input-field" style="width:100%;" type="text" maxlength="120" value="${escapeHtml(editingItem ? (editingItem.note || '') : '')}" placeholder="${t('customNotePlaceholder')}" />
            </div>
            <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
              <button type="submit" class="btn btn-primary">${icon('plus')} ${editingItem ? t('updateCountdown') : t('saveCountdown')}</button>
              ${editingItem ? `<button type="button" class="btn btn-secondary" id="cancel-edit-btn">${t('cancelEdit')}</button>` : ''}
            </div>
          </form>
        </section>

        ${customs.length ? `
          <div class="exam-grid">
            ${customs.map((c) => `
              <article class="exam-card" data-open-exam="${escapeHtml(c.id)}" tabindex="0" role="button">
                <div>
                  <h3 class="exam-card-title">${escapeHtml(c.shortName)}</h3>
                  <p class="exam-card-sub">${escapeHtml(ExamDB.formatISTDate(c.date, true))}</p>
                  ${c.note ? `<p class="exam-card-sub" style="margin-top:0.35rem;">${escapeHtml(c.note)}</p>` : ''}
                </div>
                <div class="exam-card-foot">
                  <span class="status-badge status-official" data-live-countdown="${escapeHtml(c.date)}" style="font-family:var(--font-mono);font-variant-numeric:tabular-nums;">${escapeHtml(ExamDB.formatCompactCountdown(c.date))}</span>
                  <div style="display:flex;gap:0.4rem;">
                    <button type="button" class="icon-btn" data-edit-custom="${escapeHtml(c.id)}" title="${t('edit')}">${icon('edit')}</button>
                    <button type="button" class="icon-btn" data-del-custom="${escapeHtml(c.id)}" title="${t('delete')}">${icon('trash')}</button>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="category-icon" style="margin:0 auto;">${icon('clock')}</div>
            <h3>${t('noCustomYet')}</h3>
            <p>${t('noCustomDesc')}</p>
          </div>
        `}
      `;

      container.querySelector('#custom-countdown-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#custom-name-input').value.trim();
        const dateVal = container.querySelector('#custom-date-input').value;
        const timeVal = container.querySelector('#custom-time-input').value || '09:00';
        const note = container.querySelector('#custom-note-input').value.trim();
        const iso = `${dateVal}T${timeVal}:00+05:30`;
        if (!name || Number.isNaN(Date.parse(iso)) || Date.parse(iso) <= Date.now()) {
          showToast(t('toastInvalidDate'));
          return;
        }
        const item = {
          id: editingId || `custom-${Date.now()}`,
          shortName: name,
          fullName: name,
          date: iso,
          status: 'official',
          note,
          custom: true
        };
        Store.saveCustom(item);
        showToast(t('toastCustomSaved'));
        editingId = null;
        Router.navigate(`/exam/${encodeURIComponent(item.id)}`);
      });

      container.querySelector('#cancel-edit-btn')?.addEventListener('click', () => {
        editingId = null;
        draw();
      });

      container.querySelectorAll('[data-edit-custom]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          editingId = btn.getAttribute('data-edit-custom');
          draw();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });

      container.querySelectorAll('[data-del-custom]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          Store.deleteCustom(btn.getAttribute('data-del-custom'));
          showToast(t('toastCustomDeleted'));
          draw();
        });
      });

      bindExamCardEvents(container);
    };

    draw();
  },

  favourites(container) {
    const items = Store.favourites.map((id) => ExamDB.getById(id)).filter(Boolean);
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">${t('favouritesTitle')}</h1>
          <p class="section-desc">${t('favouritesDesc')}</p>
        </div>
      </div>
      ${items.length ? `<div class="exam-grid">${items.map(renderExamCard).join('')}</div>` : `
        <div class="empty-state">
          <div class="category-icon" style="margin:0 auto;">${icon('heart')}</div>
          <h3>${t('noFavouritesYet')}</h3>
          <p>${t('noFavouritesDesc')}</p>
          <button type="button" class="btn btn-primary" data-nav="/categories">${t('browseCategories')}</button>
        </div>
      `}
    `;
    bindExamCardEvents(container);
  },

  about(container) {
    const portals = [
      { name: 'National Testing Agency (NTA)', url: 'https://nta.ac.in/' },
      { name: 'JEE Main Official Portal', url: 'https://jeemain.nta.nic.in/' },
      { name: 'NEET UG Official Portal', url: 'https://neet.nta.nic.in/' },
      { name: 'UPSC Official Website', url: 'https://www.upsc.gov.in/' },
      { name: 'SSC Official Website', url: 'https://ssc.gov.in/' },
      { name: 'CBSE Official Website', url: 'https://www.cbse.gov.in/' },
      { name: 'RBSE Rajasthan Board', url: 'https://rajeduboard.rajasthan.gov.in/' },
      { name: 'RPSC Rajasthan', url: 'https://rpsc.rajasthan.gov.in/' },
      { name: 'RSSB Rajasthan', url: 'https://rssb.rajasthan.gov.in/' },
      { name: 'IBPS Banking Portal', url: 'https://www.ibps.in/' }
    ];

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">${t('aboutTitle')}</h1>
          <p class="section-desc">${t('aboutSubtitle')}</p>
        </div>
      </div>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.1rem;margin-bottom:0.5rem;">${t('aboutMissionTitle')}</h2>
        <p style="color:var(--text-secondary);font-size:0.93rem;">${t('aboutMissionText')}</p>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.1rem;margin-bottom:0.85rem;">${t('usefulLinksTitle')}</h2>
        <div class="official-links-grid">
          ${portals.map((p) => `<a class="btn btn-secondary btn-sm" href="${p.url}" target="_blank" rel="noopener noreferrer">${icon('external')} ${p.name}</a>`).join('')}
        </div>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.1rem;margin-bottom:0.45rem;">${t('feedbackTitle')}</h2>
        <p style="color:var(--text-secondary);font-size:0.92rem;margin-bottom:0.95rem;">${t('feedbackText')}</p>
        <a href="https://t.me/The_Sk08" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          ${icon('external')} Telegram: @The_Sk08
        </a>
      </section>
    `;
  },

  settings(container) {
    const s = Store.getSettings();
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">${t('settingsTitle')}</h1>
          <p class="section-desc">${t('settingsDesc')}</p>
        </div>
      </div>

      <section class="panel-card">
        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingTheme')}</div>
            <div class="setting-desc">${t('settingThemeDesc')}</div>
          </div>
          <div style="display:flex;gap:0.4rem;">
            <button type="button" class="btn btn-sm ${s.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}" data-set-theme="dark">${t('themeDark')}</button>
            <button type="button" class="btn btn-sm ${s.theme === 'light' ? 'btn-primary' : 'btn-secondary'}" data-set-theme="light">${t('themeLight')}</button>
          </div>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingLang')}</div>
            <div class="setting-desc">${t('settingLangDesc')}</div>
          </div>
          <div style="display:flex;gap:0.4rem;">
            <button type="button" class="btn btn-sm ${s.lang === 'en' ? 'btn-primary' : 'btn-secondary'}" data-set-lang="en">English</button>
            <button type="button" class="btn btn-sm ${s.lang === 'hi' ? 'btn-primary' : 'btn-secondary'}" data-set-lang="hi">हिंदी</button>
          </div>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingBg')}</div>
            <div class="setting-desc">${t('settingBgDesc')}</div>
          </div>
          <label class="switch"><input type="checkbox" id="set-bg-toggle" ${s.bgEnabled ? 'checked' : ''} /><span class="switch-slider"></span></label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingBgPreset')}</div>
          </div>
          <select id="set-bg-preset" class="input-field">
            <option value="auto" ${s.bgPreset === 'auto' ? 'selected' : ''}>Auto Rotate</option>
            <option value="constellation" ${s.bgPreset === 'constellation' ? 'selected' : ''}>Constellation</option>
            <option value="aurora" ${s.bgPreset === 'aurora' ? 'selected' : ''}>Aurora</option>
            <option value="stardust" ${s.bgPreset === 'stardust' ? 'selected' : ''}>Stardust</option>
            <option value="waves" ${s.bgPreset === 'waves' ? 'selected' : ''}>Waves</option>
          </select>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingMascot')}</div>
            <div class="setting-desc">${t('settingMascotDesc')}</div>
          </div>
          <label class="switch"><input type="checkbox" id="set-mascot-toggle" ${s.mascotEnabled ? 'checked' : ''} /><span class="switch-slider"></span></label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingMusicCooldown')}</div>
            <div class="setting-desc">${t('settingMusicCooldownDesc')}</div>
          </div>
          <select id="set-cooldown" class="input-field">
            ${[5, 15, 30, 60].map((m) => `<option value="${m}" ${Number(s.musicCooldownMinutes) === m ? 'selected' : ''}>${m} min</option>`).join('')}
          </select>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingReducedMotion')}</div>
            <div class="setting-desc">${t('settingReducedMotionDesc')}</div>
          </div>
          <label class="switch"><input type="checkbox" id="set-motion-toggle" ${s.reducedMotion ? 'checked' : ''} /><span class="switch-slider"></span></label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingSound')}</div>
            <div class="setting-desc">${t('settingSoundDesc')}</div>
          </div>
          <label class="switch"><input type="checkbox" id="set-sound-toggle" ${s.soundEnabled ? 'checked' : ''} /><span class="switch-slider"></span></label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingFullscreen')}</div>
            <div class="setting-desc">${t('settingFullscreenDesc')}</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="set-fs-btn">${icon('expand')} ${t('fullscreen')}</button>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingReset')}</div>
            <div class="setting-desc">${t('settingResetDesc')}</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="set-reset-btn">${t('settingReset')}</button>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingClearData')}</div>
            <div class="setting-desc">${t('settingClearDataDesc')}</div>
          </div>
          <button type="button" class="btn btn-danger btn-sm" id="set-clear-btn">${t('settingClearData')}</button>
        </div>
      </section>
    `;

    container.querySelectorAll('[data-set-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        Store.updateSettings({ theme: btn.getAttribute('data-set-theme') });
        renderShellChrome();
        Router.render();
      });
    });
    container.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        Store.updateSettings({ lang: btn.getAttribute('data-set-lang') });
        renderShellChrome();
        Router.render();
      });
    });
    container.querySelector('#set-bg-toggle')?.addEventListener('change', (e) => {
      Store.updateSettings({ bgEnabled: e.target.checked });
    });
    container.querySelector('#set-bg-preset')?.addEventListener('change', (e) => {
      Store.updateSettings({ bgPreset: e.target.value });
    });
    container.querySelector('#set-mascot-toggle')?.addEventListener('change', (e) => {
      Store.updateSettings({ mascotEnabled: e.target.checked });
    });
    container.querySelector('#set-cooldown')?.addEventListener('change', (e) => {
      Store.updateSettings({ musicCooldownMinutes: Number(e.target.value) });
    });
    container.querySelector('#set-motion-toggle')?.addEventListener('change', (e) => {
      Store.updateSettings({ reducedMotion: e.target.checked });
    });
    container.querySelector('#set-sound-toggle')?.addEventListener('change', (e) => {
      Store.updateSettings({ soundEnabled: e.target.checked });
    });
    container.querySelector('#set-fs-btn')?.addEventListener('click', () => CountdownController.toggleFullscreen());
    container.querySelector('#set-reset-btn')?.addEventListener('click', () => {
      Store.resetSettings();
      renderShellChrome();
      Router.render();
      showToast(t('toastSettingsReset'));
    });
    container.querySelector('#set-clear-btn')?.addEventListener('click', () => {
      Store.clearSavedData();
      showToast(t('toastDataCleared'));
    });
  },

  notFound(container) {
    container.innerHTML = `
      <div class="empty-state" style="margin-top:2rem;">
        <div style="font-family:var(--font-mono);font-size:3rem;font-weight:800;color:var(--accent-light);">404</div>
        <h3>${t('notFoundTitle')}</h3>
        <p>${t('notFoundDesc')}</p>
        <button type="button" class="btn btn-primary" data-nav="/">${t('goHome')}</button>
      </div>
    `;
  }
};