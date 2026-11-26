// SK MUSIC — Custom Floating Music Player adapted from working game MusicPanel.tsx
// Single persistent HTML5 <audio> element stays alive across minimize, expand, close, and page navigation.

const SK_MUSIC_VOL_KEY = 'sk_music_vol_v1';
const SK_MUSIC_QUICK_CHIPS = ['Trending Hindi', 'Lo-Fi Study', 'Bollywood Hits', 'Punjabi Beats'];

const MusicPanel = {
  isOpen: false,
  minimized: false,
  mode: 'integrated', // 'integrated' | 'embed'
  root: null,
  audio: null,

  // Search & Discovery state
  query: '',
  hasSearched: false,
  selectedArtist: '',
  loading: false,
  discoveryLoading: false,
  discovery: null, // { artists, trending, popular }
  searchResults: [],
  errorMsg: null,

  // Playback state (single shared queue & audio element)
  playlist: [],
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.85,
  muted: false,
  visualsOn: false,

  init() {
    this.root = document.getElementById('sk-music-root');
    if (!this.root) return;

    try {
      const savedVol = Number(localStorage.getItem(SK_MUSIC_VOL_KEY));
      if (Number.isFinite(savedVol) && savedVol >= 0 && savedVol <= 1) {
        this.volume = savedVol;
      }
    } catch {}

    // Create a single persistent <audio> element once
    if (!this.audio) {
      this.audio = document.createElement('audio');
      this.audio.preload = 'metadata';
      this.audio.volume = this.muted ? 0 : this.volume;

      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime || 0;
        this.syncSeekUI();
      });
      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
        this.syncSeekUI();
      });
      this.audio.addEventListener('ended', () => {
        this.handleNext();
      });
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.syncPlayStateUI();
      });
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.syncPlayStateUI();
      });
      this.audio.addEventListener('error', () => {
        this.isPlaying = false;
        this.errorMsg =
          'Stream failed to load from the music source. Switch to Web Player or open the external site.';
        this.render();
      });
    }

    this.render();
  },

  getCurrentTrack() {
    if (this.currentIndex >= 0 && this.currentIndex < this.playlist.length) {
      return this.playlist[this.currentIndex];
    }
    return null;
  },

  open() {
    if (!this.root) this.init();
    this.isOpen = true;
    this.minimized = false;
    if (!this.discovery && !this.discoveryLoading) {
      this.loadDiscovery();
    }
    this.render();
  },

  toggleMinimize() {
    if (!this.isOpen) {
      this.open();
      return;
    }
    this.minimized = !this.minimized;
    this.render();
  },

  close() {
    this.isOpen = false;
    this.minimized = false;
    if (this.visualsOn) {
      this.visualsOn = false;
      document.body.classList.remove('music-mode-active');
      if (typeof MusicVisuals !== 'undefined') MusicVisuals.stop();
    }
    this.render();
  },

  toggle() {
    if (this.isOpen && !this.minimized) {
      this.toggleMinimize();
    } else {
      this.open();
    }
  },

  toggleVisuals() {
    this.visualsOn = !this.visualsOn;
    document.body.classList.toggle('music-mode-active', this.visualsOn);
    if (typeof MusicVisuals !== 'undefined') {
      if (this.visualsOn) MusicVisuals.start();
      else MusicVisuals.stop();
    }
    this.render();
  },

  async loadDiscovery() {
    this.discoveryLoading = true;
    this.errorMsg = null;
    this.render();
    try {
      this.discovery = await loadMusicDiscovery();
    } catch (err) {
      this.errorMsg =
        err instanceof Error
          ? err.message
          : `Could not reach ${MUSIC_SOURCE_BASE_URL}. Try the Web Player tab or open the site externally.`;
    } finally {
      this.discoveryLoading = false;
      this.render();
    }
  },

  async handleSearch(searchTerm, artistLabel = '') {
    const clean = String(searchTerm || '').trim();
    if (!clean) return;
    this.query = clean;
    this.selectedArtist = artistLabel;
    this.loading = true;
    this.errorMsg = null;
    this.hasSearched = true;
    this.render();
    try {
      const results = await searchMusicTracks(clean, 14);
      this.searchResults = results;
      if (results.length === 0) {
        this.errorMsg = 'No playable tracks matched that search query.';
      }
    } catch (err) {
      this.searchResults = [];
      this.errorMsg =
        err instanceof Error
          ? err.message
          : `Could not reach ${MUSIC_SOURCE_BASE_URL}. Try the Web Player tab or open the site externally.`;
    } finally {
      this.loading = false;
      this.render();
    }
  },

  clearSearch() {
    this.query = '';
    this.selectedArtist = '';
    this.hasSearched = false;
    this.searchResults = [];
    this.errorMsg = null;
    if (!this.discovery && !this.discoveryLoading) {
      this.loadDiscovery();
    } else {
      this.render();
    }
  },

  playTrackFromList(list, index) {
    if (!Array.isArray(list) || index < 0 || index >= list.length) return;
    this.playlist = list.slice();
    this.playTrackAt(index);
  },

  playTrackAt(index) {
    if (index < 0 || index >= this.playlist.length || !this.audio) return;
    const track = this.playlist[index];
    this.currentIndex = index;
    this.currentTime = 0;
    this.duration = track.durationSec || 0;
    this.errorMsg = null;

    this.audio.src = track.streamUrl;
    this.audio.volume = this.muted ? 0 : Math.max(0, Math.min(1, this.volume));
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.render();
      })
      .catch(() => {
        this.isPlaying = false;
        this.errorMsg =
          'Browser blocked direct playback or stream unavailable. Press Play again, switch to Web Player, or open the external link.';
        this.render();
      });
    this.render();
  },

  togglePlayPause() {
    if (!this.audio) return;
    const currentTrack = this.getCurrentTrack();
    if (!currentTrack) {
      if (this.searchResults.length > 0) {
        this.playTrackFromList(this.searchResults, 0);
      } else if (this.discovery && this.discovery.trending && this.discovery.trending.length > 0) {
        this.playTrackFromList(this.discovery.trending, 0);
      }
      return;
    }
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      this.syncPlayStateUI();
    } else {
      this.audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.syncPlayStateUI();
        })
        .catch(() => {
          this.errorMsg = 'Playback unavailable for this track. Try another track or use Web Player.';
          this.render();
        });
    }
  },

  handleNext() {
    if (this.playlist.length === 0) return;
    this.playTrackAt((this.currentIndex + 1) % this.playlist.length);
  },

  handlePrev() {
    if (this.playlist.length === 0) return;
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      this.currentTime = 0;
      this.syncSeekUI();
      return;
    }
    this.playTrackAt((this.currentIndex - 1 + this.playlist.length) % this.playlist.length);
  },

  handleSeek(val) {
    const num = Number(val);
    if (this.audio && Number.isFinite(num)) {
      this.audio.currentTime = num;
      this.currentTime = num;
      this.syncSeekUI();
    }
  },

  handleVolumeChange(val) {
    const num = Math.max(0, Math.min(1, Number(val)));
    this.volume = num;
    this.muted = num === 0;
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume;
    }
    try {
      localStorage.setItem(SK_MUSIC_VOL_KEY, String(num));
    } catch {}
    const volPct = this.root ? this.root.querySelector('#sk-vol-pct') : null;
    if (volPct) volPct.textContent = `${Math.round((this.muted ? 0 : this.volume) * 100)}%`;
    const muteBtn = this.root ? this.root.querySelector('#sk-mute-btn') : null;
    if (muteBtn) muteBtn.textContent = this.muted || this.volume === 0 ? '🔇' : '🔊';
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume;
    }
    this.render();
  },

  syncPlayStateUI() {
    if (!this.root) return;
    const playBtns = this.root.querySelectorAll('[data-sk-play-btn]');
    playBtns.forEach((btn) => {
      btn.textContent = this.isPlaying ? '⏸' : '▶';
      btn.setAttribute('aria-label', this.isPlaying ? 'Pause' : 'Play');
    });
    const statusEl = this.root.querySelector('#sk-deck-status');
    const track = this.getCurrentTrack();
    if (statusEl && track) {
      statusEl.textContent = `${track.artist} · ${this.isPlaying ? 'Playing' : 'Paused'}`;
    }
    const fab = this.root.querySelector('.sk-music-fab');
    if (fab) fab.classList.toggle('playing', this.isPlaying);
  },

  syncSeekUI() {
    if (!this.root) return;
    const track = this.getCurrentTrack();
    const maxDur = Math.max(1, this.duration || (track ? track.durationSec : 1) || 1);
    const curEl = this.root.querySelector('#sk-seek-cur');
    const durEl = this.root.querySelector('#sk-seek-dur');
    const slider = this.root.querySelector('#sk-seek-slider');
    if (curEl) curEl.textContent = formatMusicDuration(this.currentTime);
    if (durEl) durEl.textContent = formatMusicDuration(this.duration || (track ? track.durationSec : 0));
    if (slider) {
      slider.max = String(maxDur);
      slider.value = String(Math.min(this.currentTime, maxDur));
    }
  },

  renderTrackRows(tracks, listKey) {
    const currentTrack = this.getCurrentTrack();
    return tracks.map((track, idx) => {
      const active = currentTrack && currentTrack.id === track.id;
      const art = track.artworkUrl
        ? `<img class="sk-track-art" src="${escapeHtml(track.artworkUrl)}" alt="${escapeHtml(track.title)}" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none'" />`
        : `<div class="sk-track-art sk-art-fallback">🎵</div>`;
      return `
        <button type="button" class="sk-track-row ${active ? 'active' : ''}" data-play-list="${listKey}" data-play-idx="${idx}">
          ${art}
          <div class="sk-track-meta">
            <div class="sk-track-name">${escapeHtml(track.title)}</div>
            <div class="sk-track-sub">${escapeHtml(track.artist)} · ${escapeHtml(track.album)}</div>
          </div>
          <span class="sk-track-dur">${formatMusicDuration(track.durationSec)}</span>
        </button>
      `;
    }).join('');
  },

  getListByKey(key) {
    if (key === 'search') return this.searchResults;
    if (key === 'trending') return (this.discovery && this.discovery.trending) || [];
    if (key === 'popular') return (this.discovery && this.discovery.popular) || [];
    return [];
  },

  render() {
    if (!this.root) return;
    const currentTrack = this.getCurrentTrack();

    // 1. Floating Music Button when closed
    if (!this.isOpen) {
      this.root.innerHTML = `
        <button type="button" class="sk-music-fab ${this.isPlaying ? 'playing' : ''}" id="sk-music-fab-btn" aria-label="Open SK MUSIC Player" title="SK MUSIC">
          ${currentTrack && currentTrack.artworkUrl
            ? `<img src="${escapeHtml(currentTrack.artworkUrl)}" alt="${escapeHtml(currentTrack.title)}" referrerpolicy="no-referrer" />`
            : `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`}
        </button>
      `;
      this.root.querySelector('#sk-music-fab-btn')?.addEventListener('click', () => this.open());
      return;
    }

    // 2. Minimized Compact Floating Mini Player
    if (this.minimized) {
      this.root.innerHTML = `
        <div class="sk-mini-player" role="region" aria-label="SK MUSIC Mini Player">
          ${currentTrack && currentTrack.artworkUrl
            ? `<img class="sk-mini-art" src="${escapeHtml(currentTrack.artworkUrl)}" alt="" referrerpolicy="no-referrer" />`
            : `<div class="sk-mini-art sk-art-fallback">🎵</div>`}
          <div class="sk-mini-info" id="sk-mini-expand">
            <div class="sk-mini-title">${currentTrack ? escapeHtml(currentTrack.title) : 'SK MUSIC'}</div>
            <div class="sk-mini-artist">${currentTrack ? escapeHtml(currentTrack.artist) : 'Tap to search & play'}</div>
          </div>
          <div class="sk-mini-actions">
            <button type="button" class="sk-ctrl-btn" id="sk-mini-prev" aria-label="Previous track">⏮</button>
            <button type="button" class="sk-ctrl-btn primary" data-sk-play-btn aria-label="${this.isPlaying ? 'Pause' : 'Play'}">${this.isPlaying ? '⏸' : '▶'}</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mini-next" aria-label="Next track">⏭</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mini-max" aria-label="Expand music panel" title="Expand">⤢</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mini-close" aria-label="Close music panel" title="Close">✕</button>
          </div>
        </div>
      `;
      this.root.querySelector('#sk-mini-expand')?.addEventListener('click', () => this.toggleMinimize());
      this.root.querySelector('#sk-mini-max')?.addEventListener('click', () => this.toggleMinimize());
      this.root.querySelector('#sk-mini-close')?.addEventListener('click', () => this.close());
      this.root.querySelector('#sk-mini-prev')?.addEventListener('click', () => this.handlePrev());
      this.root.querySelector('#sk-mini-next')?.addEventListener('click', () => this.handleNext());
      this.root.querySelector('[data-sk-play-btn]')?.addEventListener('click', () => this.togglePlayPause());
      return;
    }

    // 3. Expanded Compact Floating SK MUSIC Panel
    const maxDur = Math.max(1, this.duration || (currentTrack ? currentTrack.durationSec : 1) || 1);
    const volPct = Math.round((this.muted ? 0 : this.volume) * 100);

    let scrollContentHtml = '';
    if (this.mode === 'integrated') {
      if (this.loading || this.discoveryLoading) {
        scrollContentHtml = `<div class="sk-mp-empty">Loading live tracks from jiosaavn-music-player.vercel.app...</div>`;
      } else if (this.hasSearched) {
        const heading = this.selectedArtist
          ? `Songs by ${escapeHtml(this.selectedArtist)}`
          : `Search Results for "${escapeHtml(this.query)}"`;
        scrollContentHtml = `
          <div class="sk-mp-section-head">
            <span class="sk-mp-section-lbl">${heading}</span>
            <button type="button" class="sk-link-btn" id="sk-back-discovery">← Discovery</button>
          </div>
          ${this.searchResults.length > 0
            ? `<div class="sk-track-list">${this.renderTrackRows(this.searchResults, 'search')}</div>`
            : `<div class="sk-mp-empty">No tracks found. Try another song or artist name.</div>`}
        `;
      } else if (this.discovery) {
        const { artists = [], trending = [], popular = [] } = this.discovery;
        if (artists.length > 0) {
          scrollContentHtml += `
            <div class="sk-mp-section">
              <div class="sk-mp-section-lbl">Popular Artists</div>
              <div class="sk-artist-strip">
                ${artists.map((a) => `
                  <button type="button" class="sk-artist-chip" data-artist-name="${escapeHtml(a.name)}" title="${escapeHtml(a.name)}">
                    ${a.artworkUrl
                      ? `<img src="${escapeHtml(a.artworkUrl)}" alt="${escapeHtml(a.name)}" referrerpolicy="no-referrer" loading="lazy" />`
                      : `<div class="sk-artist-fallback">🎤</div>`}
                    <span>${escapeHtml(a.name)}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        }
        if (trending.length > 0) {
          scrollContentHtml += `
            <div class="sk-mp-section">
              <div class="sk-mp-section-lbl">Trending Songs</div>
              <div class="sk-track-list">${this.renderTrackRows(trending, 'trending')}</div>
            </div>
          `;
        }
        if (popular.length > 0) {
          scrollContentHtml += `
            <div class="sk-mp-section">
              <div class="sk-mp-section-lbl">Popular Music</div>
              <div class="sk-track-list">${this.renderTrackRows(popular, 'popular')}</div>
            </div>
          `;
        }
      } else {
        scrollContentHtml = `<div class="sk-mp-empty">Search any song or artist above to start listening.</div>`;
      }
    }

    this.root.innerHTML = `
      <section class="sk-music-panel" role="dialog" aria-label="SK MUSIC Player">
        <!-- Header -->
        <div class="sk-mp-header">
          <div class="sk-mp-brand-wrap">
            <div class="sk-mp-brand">
              ${this.isPlaying
                ? `<span class="music-eq-mini" aria-hidden="true"><span></span><span></span><span></span><span></span></span>`
                : `<span>🎵</span>`}
              <span>SK MUSIC</span>
            </div>
            <div class="sk-mp-sub">Source: jiosaavn-music-player.vercel.app</div>
          </div>
          <div class="sk-mp-head-actions">
            <button type="button" class="sk-ctrl-btn ${this.visualsOn ? 'primary' : ''}" id="sk-mp-visuals" aria-label="Toggle Ambient Visuals" title="Ambient Visuals">✨</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mp-min" aria-label="Minimize music panel" title="Minimize">–</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mp-close" aria-label="Close music panel" title="Close">✕</button>
          </div>
        </div>

        <!-- Mode Tabs + External Link -->
        <div class="sk-mp-mode-bar">
          <div class="sk-mp-mode-tabs" role="tablist">
            <button type="button" class="sk-mp-tab ${this.mode === 'integrated' ? 'active' : ''}" data-mp-mode="integrated">Integrated Search</button>
            <button type="button" class="sk-mp-tab ${this.mode === 'embed' ? 'active' : ''}" data-mp-mode="embed">Web Player</button>
          </div>
          <a href="${MUSIC_SOURCE_BASE_URL}" target="_blank" rel="noopener noreferrer" class="sk-ext-link">Open Site ↗</a>
        </div>

        ${this.mode === 'embed' ? `
          <div class="sk-mp-embed-wrap">
            <iframe
              src="${MUSIC_SOURCE_BASE_URL}"
              title="JioSaavn Music Player"
              allow="autoplay; encrypted-media"
              class="sk-mp-iframe"
            ></iframe>
            <div class="sk-mp-embed-note">
              If your browser restricts embedded audio, open
              <a href="${MUSIC_SOURCE_BASE_URL}" target="_blank" rel="noopener noreferrer">jiosaavn-music-player.vercel.app</a> directly.
            </div>
          </div>
        ` : `
          <!-- Search Form -->
          <form id="sk-mp-search-form" class="sk-mp-search-wrap">
            <input
              type="text"
              id="sk-mp-search-input"
              value="${escapeHtml(this.query)}"
              placeholder="Search songs, artists, study mixes..."
              autocomplete="off"
            />
            ${this.query ? `<button type="button" class="sk-ctrl-btn" id="sk-mp-clear" aria-label="Clear search">✕</button>` : ''}
            <button type="submit" class="sk-search-submit" ${this.loading ? 'disabled' : ''}>${this.loading ? '...' : 'Search'}</button>
          </form>

          <!-- Quick Suggestions -->
          <div class="sk-quick-chips">
            ${SK_MUSIC_QUICK_CHIPS.map((chip) => `<button type="button" class="sk-chip-btn" data-quick-chip="${escapeHtml(chip)}">${escapeHtml(chip)}</button>`).join('')}
          </div>

          <!-- Honest Error Banner -->
          ${this.errorMsg ? `
            <div class="sk-mp-error">
              <div>${escapeHtml(this.errorMsg)}</div>
              <div class="sk-mp-error-actions">
                <a href="${MUSIC_SOURCE_BASE_URL}" target="_blank" rel="noopener noreferrer">Open jiosaavn-music-player.vercel.app ↗</a>
                <button type="button" class="sk-link-btn" id="sk-mp-retry">Retry</button>
              </div>
            </div>
          ` : ''}

          <!-- Independently Scrollable Discovery & Results Area -->
          <div class="sk-mp-body" id="sk-mp-body">${scrollContentHtml}</div>

          <!-- Always-Accessible Bottom Playback Deck -->
          <div class="sk-mp-deck">
            <div class="sk-deck-top">
              ${currentTrack && currentTrack.artworkUrl
                ? `<img class="sk-deck-art" src="${escapeHtml(currentTrack.artworkUrl)}" alt="" referrerpolicy="no-referrer" />`
                : `<div class="sk-deck-art sk-art-fallback">🎵</div>`}
              <div class="sk-deck-meta">
                <div class="sk-mini-title">${currentTrack ? escapeHtml(currentTrack.title) : 'No Track Selected'}</div>
                <div class="sk-mini-artist" id="sk-deck-status">
                  ${currentTrack
                    ? `${escapeHtml(currentTrack.artist)} · ${this.isPlaying ? 'Playing' : 'Paused'}`
                    : 'Pick a song from Discovery or Search'}
                </div>
              </div>
              <div class="sk-mini-actions">
                <button type="button" class="sk-ctrl-btn" id="sk-deck-prev" aria-label="Previous">⏮</button>
                <button type="button" class="sk-ctrl-btn primary" data-sk-play-btn aria-label="${this.isPlaying ? 'Pause' : 'Play'}">${this.isPlaying ? '⏸' : '▶'}</button>
                <button type="button" class="sk-ctrl-btn" id="sk-deck-next" aria-label="Next">⏭</button>
              </div>
            </div>

            <div class="sk-seek-row">
              <span id="sk-seek-cur">${formatMusicDuration(this.currentTime)}</span>
              <input type="range" class="sk-seek-slider" id="sk-seek-slider" min="0" max="${maxDur}" step="0.5" value="${Math.min(this.currentTime, maxDur)}" aria-label="Seek audio position" />
              <span id="sk-seek-dur">${formatMusicDuration(this.duration || (currentTrack ? currentTrack.durationSec : 0))}</span>
            </div>

            <div class="sk-vol-row">
              <button type="button" class="sk-ctrl-btn sk-vol-btn" id="sk-mute-btn" aria-label="${this.muted ? 'Unmute' : 'Mute'}">${this.muted || this.volume === 0 ? '🔇' : '🔊'}</button>
              <input type="range" class="sk-seek-slider" id="sk-vol-slider" min="0" max="1" step="0.02" value="${this.muted ? 0 : this.volume}" aria-label="Music Volume" />
              <span class="sk-vol-pct" id="sk-vol-pct">${volPct}%</span>
            </div>
          </div>
        `}
      </section>
    `;

    // Bind Header & Mode Tab events
    this.root.querySelector('#sk-mp-visuals')?.addEventListener('click', () => this.toggleVisuals());
    this.root.querySelector('#sk-mp-min')?.addEventListener('click', () => this.toggleMinimize());
    this.root.querySelector('#sk-mp-close')?.addEventListener('click', () => this.close());
    this.root.querySelectorAll('[data-mp-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.mode = btn.dataset.mpMode;
        this.render();
      });
    });

    if (this.mode !== 'integrated') return;

    // Bind Search Form & Quick Chips
    const searchForm = this.root.querySelector('#sk-mp-search-form');
    const searchInput = this.root.querySelector('#sk-mp-search-input');
    searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (searchInput) this.handleSearch(searchInput.value);
    });
    this.root.querySelector('#sk-mp-clear')?.addEventListener('click', () => this.clearSearch());
    this.root.querySelector('#sk-back-discovery')?.addEventListener('click', () => this.clearSearch());
    this.root.querySelector('#sk-mp-retry')?.addEventListener('click', () => {
      if (this.hasSearched && this.query) this.handleSearch(this.query, this.selectedArtist);
      else this.loadDiscovery();
    });

    this.root.querySelectorAll('[data-quick-chip]').forEach((btn) => {
      btn.addEventListener('click', () => this.handleSearch(btn.dataset.quickChip));
    });

    // Bind Popular Artists selection
    this.root.querySelectorAll('[data-artist-name]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const artistName = btn.dataset.artistName;
        this.handleSearch(artistName, artistName);
      });
    });

    // Bind Track selection
    this.root.querySelectorAll('[data-play-list]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const list = this.getListByKey(btn.dataset.playList);
        const idx = Number(btn.dataset.playIdx);
        this.playTrackFromList(list, idx);
      });
    });

    // Bind Playback Deck controls
    this.root.querySelector('#sk-deck-prev')?.addEventListener('click', () => this.handlePrev());
    this.root.querySelector('#sk-deck-next')?.addEventListener('click', () => this.handleNext());
    this.root.querySelector('.sk-mp-deck [data-sk-play-btn]')?.addEventListener('click', () => this.togglePlayPause());
    this.root.querySelector('#sk-seek-slider')?.addEventListener('input', (e) => this.handleSeek(e.target.value));
    this.root.querySelector('#sk-mute-btn')?.addEventListener('click', () => this.toggleMute());
    this.root.querySelector('#sk-vol-slider')?.addEventListener('input', (e) => this.handleVolumeChange(e.target.value));
  }
};
