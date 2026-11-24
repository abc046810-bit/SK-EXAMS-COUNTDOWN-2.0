// Application Shell, Instant Search Modal, SPA Router & Bootstrap
let toastTimer = null;
let deferredInstallPrompt = null;

function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

const SearchModal = {
  isOpen: false,
  selectedIdx: 0,

  open() {
    const modal = document.getElementById('search-modal');
    if (!modal) return;
    this.isOpen = true;
    this.selectedIdx = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    this.render('');
    const input = document.getElementById('modal-search-input');
    if (input) input.focus();
  },

  close() {
    const modal = document.getElementById('search-modal');
    if (!modal) return;
    this.isOpen = false;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  },

  render(query) {
    const dialog = document.getElementById('search-dialog');
    if (!dialog) return;
    const results = ExamDB.search(query).slice(0, 12);
    const recents = Store.recentSearches;

    dialog.innerHTML = `
      <div class="search-input-row">
        ${icon('search')}
        <input id="modal-search-input" type="search" value="${escapeHtml(query)}" placeholder="${t('searchPlaceholder')}" autocomplete="off" />
        ${query ? `<button type="button" class="btn btn-secondary btn-sm" id="modal-clear-btn">${t('clearSearch')}</button>` : ''}
        <button type="button" class="icon-btn" id="modal-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="search-results">
        ${!query && recents.length ? `
          <div style="padding:0.25rem 0.5rem 0.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.45rem;">
              <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">${t('recentSearches')}</span>
              <button type="button" class="filter-chip" id="clear-recents-btn" style="padding:0.18rem 0.5rem;font-size:0.7rem;">${t('clearSearch')}</button>
            </div>
            <div class="chip-row">
              ${recents.map((r) => `<button type="button" class="filter-chip" data-recent-q="${escapeHtml(r)}">${escapeHtml(r)}</button>`).join('')}
            </div>
          </div>
        ` : ''}
        ${results.length ? results.map((exam, idx) => {
          const badge = ExamDB.getStatusBadgeMeta(exam);
          return `
            <button type="button" class="search-result-item ${idx === this.selectedIdx ? 'selected' : ''}" data-pick-exam="${escapeHtml(exam.id)}">
              <div>
                <div style="font-weight:700;font-size:0.93rem;">${escapeHtml(ExamDB.getExamName(exam))}</div>
                <div style="font-size:0.78rem;color:var(--text-secondary);">${escapeHtml(exam.conductingBody || '')}</div>
              </div>
              <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
            </button>
          `;
        }).join('') : `
          <div style="padding:2rem 1rem;text-align:center;">
            <div style="font-weight:700;margin-bottom:0.25rem;">${t('noSearchResults')}</div>
            <div style="font-size:0.84rem;color:var(--text-secondary);">${t('noSearchHint')}</div>
          </div>
        `}
      </div>
    `;

    const input = dialog.querySelector('#modal-search-input');
    input?.addEventListener('input', (e) => {
      this.selectedIdx = 0;
      const val = e.target.value;
      this.render(val);
      const next = document.getElementById('modal-search-input');
      if (next) {
        next.focus();
        next.setSelectionRange(val.length, val.length);
      }
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && results.length) {
        e.preventDefault();
        this.selectedIdx = (this.selectedIdx + 1) % results.length;
        this.render(input.value);
        document.getElementById('modal-search-input')?.focus();
      } else if (e.key === 'ArrowUp' && results.length) {
        e.preventDefault();
        this.selectedIdx = (this.selectedIdx - 1 + results.length) % results.length;
        this.render(input.value);
        document.getElementById('modal-search-input')?.focus();
      } else if (e.key === 'Enter' && results[this.selectedIdx]) {
        e.preventDefault();
        if (input.value.trim()) Store.addRecentSearch(input.value.trim());
        this.close();
        Router.navigate(`/exam/${encodeURIComponent(results[this.selectedIdx].id)}`);
      }
    });

    dialog.querySelector('#modal-clear-btn')?.addEventListener('click', () => {
      this.render('');
      document.getElementById('modal-search-input')?.focus();
    });
    dialog.querySelector('#modal-close-btn')?.addEventListener('click', () => this.close());
    dialog.querySelector('#clear-recents-btn')?.addEventListener('click', () => {
      Store.clearRecentSearches();
      this.render('');
    });
    dialog.querySelectorAll('[data-recent-q]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.render(btn.getAttribute('data-recent-q'));
        document.getElementById('modal-search-input')?.focus();
      });
    });
    dialog.querySelectorAll('[data-pick-exam]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (query.trim()) Store.addRecentSearch(query.trim());
        this.close();
        Router.navigate(`/exam/${encodeURIComponent(btn.getAttribute('data-pick-exam'))}`);
      });
    });
  }
};

const Router = {
  currentPath: '/',

  navigate(path, push = true) {
    const clean = path || '/';
    if (push && window.location.pathname !== clean) {
      window.history.pushState({}, '', clean);
    }
    this.currentPath = clean;
    this.render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  render() {
    CountdownController.stop();
    LiveCardTicker.stop();
    MascotSystem.unmount();
    const main = document.getElementById('main-content');
    if (!main) return;

    const path = window.location.pathname || '/';
    this.currentPath = path;

    if (path === '/' || path === '/index.html') {
      Views.home(main);
    } else if (path === '/categories') {
      Views.categories(main);
    } else if (path.startsWith('/category/')) {
      const catId = decodeURIComponent(path.slice('/category/'.length));
      Views.categoryDetail(main, catId);
    } else if (path === '/exams') {
      Views.allExams(main);
    } else if (path.startsWith('/exam/')) {
      const examId = decodeURIComponent(path.slice('/exam/'.length));
      Views.examDetail(main, examId);
    } else if (path === '/my-countdown') {
      Views.myCountdown(main);
    } else if (path === '/favourites') {
      Views.favourites(main);
    } else if (path === '/about') {
      Views.about(main);
    } else if (path === '/settings') {
      Views.settings(main);
    } else {
      Views.notFound(main);
    }

    main.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', () => Router.navigate(el.getAttribute('data-nav')));
    });

    updateActiveNavLinks(path);
  }
};

function updateActiveNavLinks(path) {
  document.querySelectorAll('[data-route-link]').forEach((btn) => {
    const target = btn.getAttribute('data-route-link');
    const isMatch = target === '/'
      ? (path === '/' || path === '/index.html')
      : path === target || (target === '/categories' && path.startsWith('/category/'));
    btn.classList.toggle('active', isMatch);
  });
}

function renderShellChrome() {
  const s = Store.getSettings();
  const header = document.getElementById('top-header');
  const footer = document.getElementById('site-footer');
  const mobileNav = document.getElementById('mobile-nav');

  if (header) {
    header.innerHTML = `
      <div class="header-inner">
        <button type="button" class="brand-btn" data-route-link="/">
          <span class="brand-mark">
            <svg viewBox="0 0 128 128" fill="none" width="22" height="22">
              <path d="M40 28H88M40 100H88" stroke="#818cf8" stroke-width="8" stroke-linecap="round"/>
              <path d="M46 28V43C46 52 56 59 64 64C72 59 82 52 82 43V28" stroke="currentColor" stroke-width="6"/>
              <path d="M46 100V85C46 76 56 69 64 64C72 69 82 76 82 85V100" stroke="currentColor" stroke-width="6"/>
            </svg>
          </span>
          <span class="brand-name">${t('brandName')}<span class="brand-version">2.0</span></span>
        </button>

        <nav class="desktop-nav" aria-label="Main Navigation">
          <button type="button" class="nav-link" data-route-link="/">${t('navHome')}</button>
          <button type="button" class="nav-link" data-route-link="/categories">${t('navCategories')}</button>
          <button type="button" class="nav-link" data-route-link="/exams">${t('navAllExams')}</button>
          <button type="button" class="nav-link" data-route-link="/my-countdown">${t('navMyCountdown')}</button>
          <button type="button" class="nav-link" data-route-link="/favourites">${t('navFavourites')}</button>
          <button type="button" class="nav-link" data-route-link="/about">${t('navAbout')}</button>
          <button type="button" class="nav-link" data-route-link="/settings">${t('navSettings')}</button>
        </nav>

        <div class="header-controls">
          <button type="button" class="icon-btn search-trigger-btn" id="hdr-search-btn" aria-label="${t('searchTitle')}" title="${t('searchTitle')}">
            ${icon('search')} <span class="search-kbd">Ctrl K</span>
          </button>
          <button type="button" class="icon-btn" id="hdr-music-btn" aria-label="${t('musicBreak')}" title="${t('musicBreak')}">
            ${icon('music')}
          </button>
          <button type="button" class="icon-btn" id="hdr-lang-btn" title="${t('settingLang')}">
            ${s.lang === 'hi' ? 'EN' : 'हिं'}
          </button>
          <button type="button" class="icon-btn" id="hdr-theme-btn" aria-label="${t('settingTheme')}" title="${t('settingTheme')}">
            ${s.theme === 'dark' ? icon('sun') : icon('moon')}
          </button>
        </div>
      </div>
    `;
  }

  if (mobileNav) {
    mobileNav.innerHTML = `
      <button type="button" class="mobile-nav-btn" data-route-link="/">${icon('home')}<span>${t('navHome')}</span></button>
      <button type="button" class="mobile-nav-btn" data-route-link="/categories">${icon('grid')}<span>${t('navCategories')}</span></button>
      <button type="button" class="mobile-nav-btn" data-route-link="/my-countdown">${icon('clock')}<span>${t('navMyCountdown')}</span></button>
      <button type="button" class="mobile-nav-btn" data-route-link="/favourites">${icon('heart')}<span>${t('navFavourites')}</span></button>
      <button type="button" class="mobile-nav-btn" data-route-link="/settings">${icon('settings')}<span>${t('navSettings')}</span></button>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-brand-block">
          <div class="footer-title">${t('brandName')} 2.0</div>
          <div class="footer-tagline">${t('tagline')}</div>
        </div>
        <div class="footer-meta">
          ${deferredInstallPrompt ? `<button type="button" class="btn btn-secondary btn-sm" id="pwa-install-btn">${t('installPwa')}</button>` : ''}
          <button type="button" class="btn btn-secondary btn-sm" data-route-link="/about">${t('navAbout')}</button>
          <a href="https://t.me/The_Sk08" target="_blank" rel="noopener noreferrer" class="creator-pill">
            <span>${t('madeWithLove')} @The_Sk08</span>
          </a>
        </div>
      </div>
    `;
  }

  document.querySelectorAll('[data-route-link]').forEach((btn) => {
    btn.addEventListener('click', () => Router.navigate(btn.getAttribute('data-route-link')));
  });

  document.getElementById('hdr-search-btn')?.addEventListener('click', () => SearchModal.open());
  document.getElementById('hdr-music-btn')?.addEventListener('click', () => MusicPanel.toggle());
  document.getElementById('hdr-lang-btn')?.addEventListener('click', () => {
    Store.updateSettings({ lang: Store.getSettings().lang === 'en' ? 'hi' : 'en' });
    renderShellChrome();
    if (MusicPanel.isOpen) MusicPanel.render();
    Router.render();
  });
  document.getElementById('hdr-theme-btn')?.addEventListener('click', () => {
    Store.updateSettings({ theme: Store.getSettings().theme === 'dark' ? 'light' : 'dark' });
    renderShellChrome();
  });
  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    renderShellChrome();
  });

  updateActiveNavLinks(window.location.pathname || '/');
}

async function bootstrap() {
  Store.init();
  BackgroundEngine.init();
  MusicVisuals.init();
  MusicPanel.init();
  renderShellChrome();

  await ExamDB.load();
  Router.render();
  CountdownController.checkDueReminders();

  // Hide splash loader smoothly
  const loader = document.getElementById('app-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 180);
  }

  // Global keyboard shortcuts (Ctrl/Cmd + K for search, Esc to close modals/fullscreen)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (SearchModal.isOpen) SearchModal.close();
      else SearchModal.open();
    } else if (e.key === 'Escape') {
      if (SearchModal.isOpen) SearchModal.close();
      else if (document.body.classList.contains('fullscreen-mode')) CountdownController.exitFullscreen();
    }
  });

  document.getElementById('search-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'search-modal') SearchModal.close();
  });

  document.getElementById('exit-fs-btn')?.addEventListener('click', () => CountdownController.exitFullscreen());
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && document.body.classList.contains('fullscreen-mode')) {
      CountdownController.exitFullscreen(true);
    }
  });

  window.addEventListener('popstate', () => Router.render());

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    renderShellChrome();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
