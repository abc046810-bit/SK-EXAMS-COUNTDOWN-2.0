// Study-Break Music Side Panel (Desktop Split-Screen / Mobile Full Drawer) with Embedding Fallback
const MUSIC_URL = 'https://jiosaavn-music-player.vercel.app';

const MusicPanel = {
  isOpen: false,
  mode: 'embed', // 'embed' | 'fallback'
  drawer: null,

  init() {
    this.drawer = document.getElementById('music-drawer');
  },

  open() {
    if (!this.drawer) this.init();
    if (!this.drawer) return;
    this.isOpen = true;
    document.body.classList.add('music-mode-active');
    this.drawer.classList.add('open');
    this.drawer.setAttribute('aria-hidden', 'false');
    MusicVisuals.start();
    this.render();
  },

  close() {
    if (!this.drawer) return;
    this.isOpen = false;
    document.body.classList.remove('music-mode-active');
    this.drawer.classList.remove('open');
    this.drawer.setAttribute('aria-hidden', 'true');
    MusicVisuals.stop();
    this.drawer.innerHTML = '';
  },

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  },

  render() {
    if (!this.drawer || !this.isOpen) return;
    const isEmbed = this.mode === 'embed';

    this.drawer.innerHTML = `
      <div class="music-drawer-header">
        <div class="music-drawer-title">
          <span class="music-eq-mini" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
          <span>${t('musicModeTitle')}</span>
        </div>
        <button type="button" class="icon-btn" id="music-close-btn" aria-label="${t('musicClose')}" title="${t('musicClose')}">✕</button>
      </div>
      <div class="music-drawer-toolbar">
        <button type="button" class="btn btn-secondary btn-sm" id="music-preset-btn">${icon('sparkles')} ${t('musicPresetBtn')}</button>
        <div style="display:flex;gap:0.4rem;">
          ${isEmbed
            ? `<button type="button" class="btn btn-secondary btn-sm" id="music-fallback-toggle">Fallback</button>`
            : `<button type="button" class="btn btn-secondary btn-sm" id="music-embed-toggle">${t('musicReloadEmbed')}</button>`}
          <a href="${MUSIC_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            ${icon('external')} ${t('musicOpenTab')}
          </a>
        </div>
      </div>
      <div class="music-frame-container">
        ${isEmbed ? `
          <iframe
            id="music-player-iframe"
            class="music-iframe"
            src="${MUSIC_URL}"
            title="JioSaavn Music Player"
            allow="autoplay; encrypted-media; clipboard-write"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        ` : `
          <div class="music-fallback-card">
            <div class="category-icon" style="width:60px;height:60px;">${icon('music')}</div>
            <h3>${t('musicFallbackTitle')}</h3>
            <p style="color:var(--text-secondary);font-size:0.88rem;max-width:320px;">${t('musicFallbackDesc')}</p>
            <a href="${MUSIC_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              ${icon('external')} ${t('musicOpenTab')}
            </a>
            <button type="button" class="btn btn-secondary btn-sm" id="music-retry-embed-btn">${t('musicReloadEmbed')}</button>
          </div>
        `}
      </div>
      <div class="music-visual-disclaimer">${t('musicDisclaimer')}</div>
    `;

    this.drawer.querySelector('#music-close-btn')?.addEventListener('click', () => this.close());
    this.drawer.querySelector('#music-preset-btn')?.addEventListener('click', () => {
      const name = MusicVisuals.nextPalette();
      showToast(`${t('musicModeTitle')}: ${name}`);
    });
    this.drawer.querySelector('#music-fallback-toggle')?.addEventListener('click', () => {
      this.mode = 'fallback';
      this.render();
    });
    this.drawer.querySelector('#music-embed-toggle')?.addEventListener('click', () => {
      this.mode = 'embed';
      this.render();
    });
    this.drawer.querySelector('#music-retry-embed-btn')?.addEventListener('click', () => {
      this.mode = 'embed';
      this.render();
    });

    const iframe = this.drawer.querySelector('#music-player-iframe');
    if (iframe) {
      iframe.addEventListener('error', () => {
        this.mode = 'fallback';
        this.render();
      });
    }
  }
};
