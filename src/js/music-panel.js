// SK MUSIC — Custom Floating JioSaavn Music Player
// Single shared HTMLAudioElement persists seamlessly across page navigation, minimize, and expand.
const SK_MUSIC_RECENT_KEY = 'sk_music_recent_v1';
const SK_MUSIC_VOL_KEY = 'sk_music_vol_v1';

function formatMusicTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const MusicPanel = {
  isOpen: false,
  viewMode: 'fab', // 'fab' | 'mini' | 'expanded'
  activeTab: 'discover', // 'discover' | 'playing' | 'queue'
  root: null,
  audio: null,

  // Playback state
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  isLoadingAudio: false,
  repeatMode: 'off', // 'off' | 'all' | 'one'
  shuffle: false,
  volume: 0.85,
  muted: false,
  visualsOn: false,

  // Data state
  discoverData: null,
  discoverLoading: false,
  searchQuery: '',
  searchResults: null,
  searchLoading: false,
  collectionView: null, // { title, songs } when drilling into artist/album/playlist
  errorMessage: '',
  recentTracks: [],
  _searchTimer: null,
  _lastFetchId: 0,

  init() {
    this.root = document.getElementById('sk-music-root');
    if (!this.root) return;

    this.loadLocalPrefs();

    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      this.audio.volume = this.volume;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.isLoadingAudio = false;
        this.syncPlaybackUI();
      });
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.syncPlaybackUI();
      });
      this.audio.addEventListener('waiting', () => {
        this.isLoadingAudio = true;
        this.syncPlaybackUI();
      });
      this.audio.addEventListener('canplay', () => {
        this.isLoadingAudio = false;
        this.syncPlaybackUI();
      });
      this.audio.addEventListener('timeupdate', () => {
        this.syncSeekUI();
      });
      this.audio.addEventListener('ended', () => {
        this.handleTrackEnded();
      });
      this.audio.addEventListener('error', () => {
        this.isPlaying = false;
        this.isLoadingAudio = false;
        this.errorMessage = 'Could not stream this track. Try another song or check your connection.';
        this.render();
      });
    }

    this.render();
  },

  loadLocalPrefs() {
    try {
      const savedRecent = JSON.parse(localStorage.getItem(SK_MUSIC_RECENT_KEY) || '[]');
      if (Array.isArray(savedRecent)) this.recentTracks = savedRecent.slice(0, 15);
    } catch {
      this.recentTracks = [];
    }
    try {
      const savedVol = Number(localStorage.getItem(SK_MUSIC_VOL_KEY));
      if (Number.isFinite(savedVol) && savedVol >= 0 && savedVol <= 1) this.volume = savedVol;
    } catch {}
  },

  saveRecent(track) {
    if (!track || !track.id) return;
    this.recentTracks = [track, ...this.recentTracks.filter((x) => x.id !== track.id)].slice(0, 15);
    try {
      localStorage.setItem(SK_MUSIC_RECENT_KEY, JSON.stringify(this.recentTracks));
    } catch {}
  },

  getCurrentTrack() {
    if (this.currentIndex < 0 || this.currentIndex >= this.queue.length) return null;
    return this.queue[this.currentIndex] || null;
  },

  open() {
    if (!this.root) this.init();
    this.viewMode = 'expanded';
    this.isOpen = true;
    this.errorMessage = '';
    if (!this.discoverData && !this.discoverLoading) {
      this.fetchDiscover();
    }
    this.render();
  },

  minimize() {
    this.isOpen = false;
    this.viewMode = this.getCurrentTrack() ? 'mini' : 'fab';
    this.render();
  },

  close() {
    this.isOpen = false;
    this.viewMode = 'fab';
    if (this.visualsOn) {
      this.visualsOn = false;
      document.body.classList.remove('music-mode-active');
      if (typeof MusicVisuals !== 'undefined') MusicVisuals.stop();
    }
    this.render();
  },

  toggle() {
    if (this.viewMode === 'expanded') this.minimize();
    else this.open();
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

  async fetchDiscover() {
    this.discoverLoading = true;
    this.errorMessage = '';
    this.render();
    try {
      const res = await fetch('/api/music/discover');
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Could not load music discovery.');
      }
      this.discoverData = data;
    } catch (err) {
      this.errorMessage = err.message || 'Unable to connect to SK MUSIC service.';
    } finally {
      this.discoverLoading = false;
      this.render();
    }
  },

  handleSearchInput(val) {
    this.searchQuery = val;
    this.collectionView = null;
    clearTimeout(this._searchTimer);
    const trimmed = val.trim();
    if (!trimmed) {
      this.searchResults = null;
      this.searchLoading = false;
      this.errorMessage = '';
      this.renderBodyOnly();
      return;
    }
    this.searchLoading = true;
    this.errorMessage = '';
    this.renderBodyOnly();
    this._searchTimer = setTimeout(() => this.runSearch(trimmed), 360);
  },

  async runSearch(query) {
    const reqId = ++this._lastFetchId;
    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}&limit=15`);
      const data = await res.json();
      if (reqId !== this._lastFetchId) return;
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Search failed.');
      }
      this.searchResults = data;
      this.errorMessage = '';
    } catch (err) {
      if (reqId !== this._lastFetchId) return;
      this.errorMessage = err.message || 'Search unavailable right now.';
      this.searchResults = null;
    } finally {
      if (reqId === this._lastFetchId) {
        this.searchLoading = false;
        this.renderBodyOnly();
      }
    }
  },

  async openCollection(type, id, fallbackTitle) {
    this.searchLoading = true;
    this.errorMessage = '';
    this.renderBodyOnly();
    try {
      const res = await fetch(`/api/music/${type}?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not load tracks.');
      this.collectionView = {
        title: data.title || fallbackTitle || 'Collection',
        songs: Array.isArray(data.songs) ? data.songs : []
      };
    } catch (err) {
      this.errorMessage = err.message || 'Could not load collection.';
    } finally {
      this.searchLoading = false;
      this.renderBodyOnly();
    }
  },

  playTrackFromList(list, index) {
    if (!Array.isArray(list) || !list[index]) return;
    this.queue = list.slice();
    this.currentIndex = index;
    this.playCurrent();
  },

  playSingleTrack(track) {
    if (!track || !track.url) return;
    const existingIdx = this.queue.findIndex((t) => t.id === track.id);
    if (existingIdx >= 0) {
      this.currentIndex = existingIdx;
    } else {
      this.queue.push(track);
      this.currentIndex = this.queue.length - 1;
    }
    this.playCurrent();
  },

  addToQueue(track) {
    if (!track || !track.url) return;
    if (!this.queue.some((t) => t.id === track.id)) {
      this.queue.push(track);
      if (typeof showToast === 'function') showToast(`Added "${track.name}" to queue`);
      this.render();
    }
  },

  playCurrent() {
    const track = this.getCurrentTrack();
    if (!track || !track.url || !this.audio) return;
    this.errorMessage = '';
    this.isLoadingAudio = true;
    if (this.audio.src !== track.url) {
      this.audio.src = track.url;
    }
    this.audio.play().catch(() => {
      this.isPlaying = false;
      this.isLoadingAudio = false;
      this.syncPlaybackUI();
    });
    this.saveRecent(track);
    this.render();
  },

  togglePlayPause() {
    const track = this.getCurrentTrack();
    if (!track || !this.audio) return;
    if (this.audio.paused) {
      this.audio.play().catch(() => {});
    } else {
      this.audio.pause();
    }
  },

  async nextTrack() {
    if (this.queue.length === 0) return;
    if (this.shuffle && this.queue.length > 1) {
      let nextIdx = this.currentIndex;
      while (nextIdx === this.currentIndex) {
        nextIdx = Math.floor(Math.random() * this.queue.length);
      }
      this.currentIndex = nextIdx;
      this.playCurrent();
      return;
    }
    if (this.currentIndex + 1 < this.queue.length) {
      this.currentIndex++;
      this.playCurrent();
    } else if (this.repeatMode === 'all') {
      this.currentIndex = 0;
      this.playCurrent();
    } else {
      const curr = this.getCurrentTrack();
      if (curr && curr.id) {
        try {
          const res = await fetch(`/api/music/suggestions?id=${encodeURIComponent(curr.id)}`);
          const data = await res.json();
          if (data && data.ok && Array.isArray(data.songs) && data.songs.length > 0) {
            const fresh = data.songs.filter((s) => !this.queue.some((q) => q.id === s.id));
            if (fresh.length > 0) {
              this.queue.push(...fresh);
              this.currentIndex++;
              this.playCurrent();
              return;
            }
          }
        } catch {}
      }
      this.isPlaying = false;
      this.syncPlaybackUI();
    }
  },

  prevTrack() {
    if (!this.audio || this.queue.length === 0) return;
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playCurrent();
    } else if (this.repeatMode === 'all') {
      this.currentIndex = this.queue.length - 1;
      this.playCurrent();
    }
  },

  handleTrackEnded() {
    if (this.repeatMode === 'one' && this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
      return;
    }
    this.nextTrack();
  },

  cycleRepeat() {
    const order = ['off', 'all', 'one'];
    this.repeatMode = order[(order.indexOf(this.repeatMode) + 1) % order.length];
    this.render();
  },

  toggleShuffle() {
    this.shuffle = !this.shuffle;
    this.render();
  },

  setVolume(val) {
    const num = Math.min(1, Math.max(0, Number(val)));
    this.volume = num;
    this.muted = num === 0;
    if (this.audio) {
      this.audio.volume = num;
      this.audio.muted = this.muted;
    }
    try { localStorage.setItem(SK_MUSIC_VOL_KEY, String(num)); } catch {}
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.audio) this.audio.muted = this.muted;
    this.render();
  },

  seekTo(pct) {
    if (!this.audio || !Number.isFinite(this.audio.duration) || this.audio.duration <= 0) return;
    this.audio.currentTime = (Number(pct) / 100) * this.audio.duration;
  },

  syncPlaybackUI() {
    const playBtns = this.root ? this.root.querySelectorAll('[data-sk-play-toggle]') : [];
    playBtns.forEach((btn) => {
      btn.textContent = this.isLoadingAudio ? '⏳' : (this.isPlaying ? '⏸' : '▶');
    });
    const fab = this.root ? this.root.querySelector('.sk-music-fab') : null;
    if (fab) fab.classList.toggle('playing', this.isPlaying);
  },

  syncSeekUI() {
    if (!this.root || !this.audio) return;
    const dur = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    const cur = this.audio.currentTime || 0;
    const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0;
    this.root.querySelectorAll('[data-sk-seek]').forEach((el) => { el.value = String(pct); });
    this.root.querySelectorAll('[data-sk-cur-time]').forEach((el) => { el.textContent = formatMusicTime(cur); });
    this.root.querySelectorAll('[data-sk-dur-time]').forEach((el) => { el.textContent = formatMusicTime(dur); });
  },

  renderTrackList(songs, listKey) {
    const curr = this.getCurrentTrack();
    return songs.map((song, idx) => {
      const isActive = curr && curr.id === song.id;
      const safeName = escapeHtml(song.name);
      const safeArtist = escapeHtml(song.artist);
      const art = song.image ? `<img class="sk-track-art" src="${escapeHtml(song.image)}" alt="" loading="lazy" />` : `<div class="sk-track-art" style="display:flex;align-items:center;justify-content:center;">🎵</div>`;
      return `
        <div class="sk-track-row ${isActive ? 'active' : ''}" data-play-list="${listKey}" data-play-idx="${idx}" role="button" tabindex="0">
          ${art}
          <div class="sk-track-meta">
            <div class="sk-track-name">${safeName}</div>
            <div class="sk-track-sub">${safeArtist}${song.duration ? ` • ${formatMusicTime(song.duration)}` : ''}</div>
          </div>
          <button type="button" class="sk-ctrl-btn" data-queue-list="${listKey}" data-queue-idx="${idx}" title="Add to queue" aria-label="Add to queue">＋</button>
        </div>
      `;
    }).join('');
  },

  buildBodyHtml() {
    if (this.activeTab === 'playing') {
      const track = this.getCurrentTrack();
      if (!track) {
        return `<div style="text-align:center;padding:2rem 1rem;color:var(--text-secondary);">
          <div style="font-size:2rem;margin-bottom:0.5rem;">🎧</div>
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:0.35rem;">Nothing playing yet</div>
          <div style="font-size:0.82rem;">Search or pick a song from Discover to start listening.</div>
        </div>`;
      }
      const dur = this.audio && Number.isFinite(this.audio.duration) ? this.audio.duration : (track.duration || 0);
      const cur = this.audio ? (this.audio.currentTime || 0) : 0;
      const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0;
      const repeatLabel = this.repeatMode === 'one' ? '🔂' : (this.repeatMode === 'all' ? '🔁' : '↻');
      return `
        <div class="sk-now-playing">
          ${track.image ? `<img class="sk-np-art" src="${escapeHtml(track.image)}" alt="${escapeHtml(track.name)}" />` : `<div class="sk-np-art" style="display:flex;align-items:center;justify-content:center;font-size:3rem;">🎵</div>`}
          <div style="width:100%;">
            <div style="font-weight:800;font-size:1rem;color:var(--text-primary);margin-bottom:0.2rem;">${escapeHtml(track.name)}</div>
            <div style="font-size:0.82rem;color:var(--text-secondary);">${escapeHtml(track.artist)}${track.album ? ` • ${escapeHtml(track.album)}` : ''}</div>
          </div>
          <div class="sk-seek-row">
            <span data-sk-cur-time>${formatMusicTime(cur)}</span>
            <input type="range" class="sk-seek-slider" data-sk-seek min="0" max="100" step="0.2" value="${pct}" aria-label="Seek position" />
            <span data-sk-dur-time>${formatMusicTime(dur)}</span>
          </div>
          <div class="sk-np-controls">
            <button type="button" class="sk-ctrl-btn ${this.shuffle ? 'primary' : ''}" id="sk-np-shuffle" title="Shuffle" aria-label="Shuffle">🔀</button>
            <button type="button" class="sk-ctrl-btn" id="sk-np-prev" title="Previous" aria-label="Previous">⏮</button>
            <button type="button" class="sk-ctrl-btn primary" style="width:46px;height:46px;border-radius:50%;font-size:1.05rem;" data-sk-play-toggle aria-label="Play or Pause">${this.isLoadingAudio ? '⏳' : (this.isPlaying ? '⏸' : '▶')}</button>
            <button type="button" class="sk-ctrl-btn" id="sk-np-next" title="Next" aria-label="Next">⏭</button>
            <button type="button" class="sk-ctrl-btn ${this.repeatMode !== 'off' ? 'primary' : ''}" id="sk-np-repeat" title="Repeat: ${this.repeatMode}" aria-label="Repeat">${repeatLabel}</button>
          </div>
          <div class="sk-seek-row" style="max-width:240px;">
            <button type="button" class="sk-ctrl-btn" style="width:30px;height:30px;" id="sk-np-mute" aria-label="Mute">${this.muted || this.volume === 0 ? '🔇' : '🔊'}</button>
            <input type="range" class="sk-seek-slider" id="sk-np-vol" min="0" max="1" step="0.05" value="${this.muted ? 0 : this.volume}" aria-label="Volume" />
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'queue') {
      if (this.queue.length === 0) {
        return `<div style="text-align:center;padding:2rem 1rem;color:var(--text-secondary);font-size:0.84rem;">Queue is empty. Play a track or tap ＋ on any song.</div>`;
      }
      const curr = this.getCurrentTrack();
      return `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="sk-mp-section-lbl" style="margin:0;">Up Next (${this.queue.length})</div>
          <button type="button" class="btn btn-secondary btn-sm" id="sk-queue-clear">Clear</button>
        </div>
        ${this.queue.map((song, idx) => `
          <div class="sk-track-row ${curr && curr.id === song.id && idx === this.currentIndex ? 'active' : ''}" data-queue-play="${idx}" role="button" tabindex="0">
            ${song.image ? `<img class="sk-track-art" src="${escapeHtml(song.image)}" alt="" loading="lazy" />` : `<div class="sk-track-art" style="display:flex;align-items:center;justify-content:center;">🎵</div>`}
            <div class="sk-track-meta">
              <div class="sk-track-name">${escapeHtml(song.name)}</div>
              <div class="sk-track-sub">${escapeHtml(song.artist)}</div>
            </div>
            <button type="button" class="sk-ctrl-btn" data-queue-remove="${idx}" aria-label="Remove from queue">✕</button>
          </div>
        `).join('')}
      `;
    }

    // Discover & Search tab
    let html = '';
    if (this.errorMessage) {
      html += `<div class="sk-mp-error">${escapeHtml(this.errorMessage)} <button type="button" class="btn btn-secondary btn-sm" id="sk-mp-retry" style="margin-left:0.5rem;">Retry</button></div>`;
    }

    if (this.searchLoading || this.discoverLoading) {
      return html + `<div style="text-align:center;padding:2rem 1rem;color:var(--text-secondary);font-size:0.85rem;">Loading live tracks from JioSaavn...</div>`;
    }

    if (this.collectionView) {
      return html + `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;">
          <div class="sk-mp-section-lbl" style="margin:0;">${escapeHtml(this.collectionView.title)}</div>
          <button type="button" class="btn btn-secondary btn-sm" id="sk-col-back">← Back</button>
        </div>
        ${this.collectionView.songs.length > 0
          ? this.renderTrackList(this.collectionView.songs, 'collection')
          : `<div style="font-size:0.82rem;color:var(--text-secondary);padding:1rem 0;">No playable tracks found in this collection.</div>`}
      `;
    }

    if (this.searchResults) {
      const { songs = [], artists = [], albums = [], playlists = [] } = this.searchResults;
      const total = songs.length + artists.length + albums.length + playlists.length;
      if (total === 0) {
        return html + `<div style="text-align:center;padding:1.5rem;color:var(--text-secondary);font-size:0.84rem;">No results found for "${escapeHtml(this.searchQuery)}".</div>`;
      }
      if (songs.length > 0) {
        html += `<div><div class="sk-mp-section-lbl">Songs</div>${this.renderTrackList(songs, 'searchSongs')}</div>`;
      }
      if (artists.length > 0) {
        html += `<div><div class="sk-mp-section-lbl">Artists</div><div class="sk-artist-strip">${artists.map((a) => `
          <button type="button" class="sk-artist-chip" data-open-col="artist" data-col-id="${escapeHtml(a.id)}" data-col-title="${escapeHtml(a.name)}">
            ${a.image ? `<img src="${escapeHtml(a.image)}" alt="" loading="lazy" />` : `<div style="width:56px;height:56px;border-radius:50%;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;">🎤</div>`}
            <span>${escapeHtml(a.name)}</span>
          </button>
        `).join('')}</div></div>`;
      }
      if (albums.length > 0) {
        html += `<div><div class="sk-mp-section-lbl">Albums</div>${albums.map((al) => `
          <div class="sk-track-row" data-open-col="album" data-col-id="${escapeHtml(al.id)}" data-col-title="${escapeHtml(al.name)}" role="button" tabindex="0">
            ${al.image ? `<img class="sk-track-art" src="${escapeHtml(al.image)}" alt="" loading="lazy" />` : `<div class="sk-track-art">💿</div>`}
            <div class="sk-track-meta">
              <div class="sk-track-name">${escapeHtml(al.name)}</div>
              <div class="sk-track-sub">${escapeHtml(al.artist || al.year || 'Album')}</div>
            </div>
            <span style="color:var(--text-muted);font-size:0.8rem;">→</span>
          </div>
        `).join('')}</div>`;
      }
      if (playlists.length > 0) {
        html += `<div><div class="sk-mp-section-lbl">Playlists</div>${playlists.map((pl) => `
          <div class="sk-track-row" data-open-col="playlist" data-col-id="${escapeHtml(pl.id)}" data-col-title="${escapeHtml(pl.name)}" role="button" tabindex="0">
            ${pl.image ? `<img class="sk-track-art" src="${escapeHtml(pl.image)}" alt="" loading="lazy" />` : `<div class="sk-track-art">📻</div>`}
            <div class="sk-track-meta">
              <div class="sk-track-name">${escapeHtml(pl.name)}</div>
              <div class="sk-track-sub">${pl.songCount ? `${pl.songCount} songs` : 'Playlist'}</div>
            </div>
            <span style="color:var(--text-muted);font-size:0.8rem;">→</span>
          </div>
        `).join('')}</div>`;
      }
      return html;
    }

    // Default Discover sections
    if (this.recentTracks.length > 0) {
      html += `<div><div class="sk-mp-section-lbl">Recently Played</div>${this.renderTrackList(this.recentTracks.slice(0, 5), 'recent')}</div>`;
    }
    if (this.discoverData) {
      const { trending = [], popular = [], artists = [] } = this.discoverData;
      if (artists.length > 0) {
        html += `<div><div class="sk-mp-section-lbl">Popular Artists</div><div class="sk-artist-strip">${artists.map((a) => `
          <button type="button" class="sk-artist-chip" data-open-col="artist" data-col-id="${escapeHtml(a.id)}" data-col-title="${escapeHtml(a.name)}">
            ${a.image ? `<img src="${escapeHtml(a.image)}" alt="" loading="lazy" />` : `<div style="width:56px;height:56px;border-radius:50%;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;">🎤</div>`}
            <span>${escapeHtml(a.name)}</span>
          </button>
        `).join('')}</div></div>`;
      }
      if (trending.length > 0) {
        html += `<div><div class="sk-mp-section-lbl">Trending Now</div>${this.renderTrackList(trending, 'trending')}</div>`;
      }
      if (popular.length > 0) {
        html += `<div><div class="sk-mp-section-lbl">Study & Lo-Fi Focus</div>${this.renderTrackList(popular, 'popular')}</div>`;
      }
    }
    return html || `<div style="text-align:center;padding:1.5rem;color:var(--text-secondary);font-size:0.84rem;">Search any song, artist, album, or playlist above.</div>`;
  },

  getListByKey(key) {
    if (key === 'recent') return this.recentTracks;
    if (key === 'trending') return (this.discoverData && this.discoverData.trending) || [];
    if (key === 'popular') return (this.discoverData && this.discoverData.popular) || [];
    if (key === 'searchSongs') return (this.searchResults && this.searchResults.songs) || [];
    if (key === 'collection') return (this.collectionView && this.collectionView.songs) || [];
    return [];
  },

  bindBodyEvents(container) {
    if (!container) return;

    container.querySelector('#sk-mp-retry')?.addEventListener('click', () => {
      if (this.searchQuery.trim()) this.runSearch(this.searchQuery.trim());
      else this.fetchDiscover();
    });

    container.querySelector('#sk-col-back')?.addEventListener('click', () => {
      this.collectionView = null;
      this.renderBodyOnly();
    });

    container.querySelectorAll('[data-play-list]').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-queue-list]')) return;
        const list = this.getListByKey(row.dataset.playList);
        const idx = Number(row.dataset.playIdx);
        this.playTrackFromList(list, idx);
      });
    });

    container.querySelectorAll('[data-queue-list]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = this.getListByKey(btn.dataset.queueList);
        const idx = Number(btn.dataset.queueIdx);
        if (list[idx]) this.addToQueue(list[idx]);
      });
    });

    container.querySelectorAll('[data-open-col]').forEach((el) => {
      el.addEventListener('click', () => {
        this.openCollection(el.dataset.openCol, el.dataset.colId, el.dataset.colTitle);
      });
    });

    container.querySelectorAll('[data-queue-play]').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-queue-remove]')) return;
        this.currentIndex = Number(row.dataset.queuePlay);
        this.playCurrent();
      });
    });

    container.querySelectorAll('[data-queue-remove]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = Number(btn.dataset.queueRemove);
        this.queue.splice(idx, 1);
        if (idx < this.currentIndex) this.currentIndex--;
        else if (idx === this.currentIndex) {
          if (this.queue.length === 0) {
            this.currentIndex = -1;
            if (this.audio) { this.audio.pause(); this.audio.src = ''; }
            this.isPlaying = false;
          } else {
            this.currentIndex = Math.min(this.currentIndex, this.queue.length - 1);
            this.playCurrent();
          }
        }
        this.render();
      });
    });

    container.querySelector('#sk-queue-clear')?.addEventListener('click', () => {
      this.queue = [];
      this.currentIndex = -1;
      if (this.audio) { this.audio.pause(); this.audio.src = ''; }
      this.isPlaying = false;
      this.render();
    });

    container.querySelector('[data-sk-play-toggle]')?.addEventListener('click', () => this.togglePlayPause());
    container.querySelector('#sk-np-next')?.addEventListener('click', () => this.nextTrack());
    container.querySelector('#sk-np-prev')?.addEventListener('click', () => this.prevTrack());
    container.querySelector('#sk-np-shuffle')?.addEventListener('click', () => this.toggleShuffle());
    container.querySelector('#sk-np-repeat')?.addEventListener('click', () => this.cycleRepeat());
    container.querySelector('#sk-np-mute')?.addEventListener('click', () => this.toggleMute());
    container.querySelector('#sk-np-vol')?.addEventListener('input', (e) => this.setVolume(e.target.value));
    container.querySelector('[data-sk-seek]')?.addEventListener('input', (e) => this.seekTo(e.target.value));
  },

  renderBodyOnly() {
    const bodyEl = this.root ? this.root.querySelector('#sk-mp-body') : null;
    if (!bodyEl) {
      this.render();
      return;
    }
    bodyEl.innerHTML = this.buildBodyHtml();
    this.bindBodyEvents(bodyEl);
  },

  render() {
    if (!this.root) return;
    const track = this.getCurrentTrack();

    if (this.viewMode === 'fab') {
      this.root.innerHTML = `
        <button type="button" class="sk-music-fab ${this.isPlaying ? 'playing' : ''}" id="sk-music-fab-btn" aria-label="Open SK MUSIC Player" title="SK MUSIC">
          ${track && track.image
            ? `<img src="${escapeHtml(track.image)}" alt="${escapeHtml(track.name)}" />`
            : `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`}
        </button>
      `;
      this.root.querySelector('#sk-music-fab-btn')?.addEventListener('click', () => this.open());
      return;
    }

    if (this.viewMode === 'mini' && track) {
      this.root.innerHTML = `
        <div class="sk-mini-player" role="region" aria-label="SK MUSIC Mini Player">
          ${track.image ? `<img class="sk-mini-art" src="${escapeHtml(track.image)}" alt="" />` : `<div class="sk-mini-art" style="display:flex;align-items:center;justify-content:center;">🎵</div>`}
          <div class="sk-mini-info" id="sk-mini-expand">
            <div class="sk-mini-title">${escapeHtml(track.name)}</div>
            <div class="sk-mini-artist">${escapeHtml(track.artist)}</div>
          </div>
          <div class="sk-mini-actions">
            <button type="button" class="sk-ctrl-btn primary" data-sk-play-toggle aria-label="Play or Pause">${this.isLoadingAudio ? '⏳' : (this.isPlaying ? '⏸' : '▶')}</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mini-next" aria-label="Next track">⏭</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mini-open" aria-label="Expand SK MUSIC">⤢</button>
          </div>
        </div>
      `;
      this.root.querySelector('#sk-mini-expand')?.addEventListener('click', () => this.open());
      this.root.querySelector('#sk-mini-open')?.addEventListener('click', () => this.open());
      this.root.querySelector('[data-sk-play-toggle]')?.addEventListener('click', () => this.togglePlayPause());
      this.root.querySelector('#sk-mini-next')?.addEventListener('click', () => this.nextTrack());
      return;
    }

    // Expanded Floating SK MUSIC Panel
    const dur = this.audio && Number.isFinite(this.audio.duration) ? this.audio.duration : (track ? (track.duration || 0) : 0);
    const cur = this.audio ? (this.audio.currentTime || 0) : 0;
    const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0;

    this.root.innerHTML = `
      <section class="sk-music-panel" role="dialog" aria-label="SK MUSIC Player">
        <div class="sk-mp-header">
          <div class="sk-mp-brand">
            ${this.isPlaying ? `<span class="music-eq-mini" aria-hidden="true"><span></span><span></span><span></span><span></span></span>` : `<span>🎵</span>`}
            <span>SK MUSIC</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.35rem;">
            <button type="button" class="sk-ctrl-btn ${this.visualsOn ? 'primary' : ''}" id="sk-mp-visuals" title="Toggle Ambient Visuals" aria-label="Toggle Ambient Visuals">✨</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mp-minimize" title="Minimize" aria-label="Minimize">–</button>
            <button type="button" class="sk-ctrl-btn" id="sk-mp-close" title="Close" aria-label="Close">✕</button>
          </div>
        </div>

        <div class="sk-mp-tabs" role="tablist">
          <button type="button" class="sk-mp-tab ${this.activeTab === 'discover' ? 'active' : ''}" data-mp-tab="discover">Discover</button>
          <button type="button" class="sk-mp-tab ${this.activeTab === 'playing' ? 'active' : ''}" data-mp-tab="playing">Now Playing</button>
          <button type="button" class="sk-mp-tab ${this.activeTab === 'queue' ? 'active' : ''}" data-mp-tab="queue">Queue (${this.queue.length})</button>
        </div>

        ${this.activeTab === 'discover' ? `
          <div class="sk-mp-search-wrap">
            <input type="search" id="sk-mp-search" placeholder="Search songs, artists, albums, playlists..." value="${escapeHtml(this.searchQuery)}" autocomplete="off" />
            ${this.searchQuery ? `<button type="button" class="sk-ctrl-btn" id="sk-mp-clear-search" aria-label="Clear search">✕</button>` : ''}
          </div>
        ` : ''}

        <div class="sk-mp-body" id="sk-mp-body">${this.buildBodyHtml()}</div>

        ${track && this.activeTab !== 'playing' ? `
          <div class="sk-mp-footer-bar">
            <div style="display:flex;align-items:center;gap:0.6rem;">
              ${track.image ? `<img class="sk-mini-art" style="width:38px;height:38px;" src="${escapeHtml(track.image)}" alt="" />` : ''}
              <div class="sk-mini-info" id="sk-mp-goto-playing">
                <div class="sk-mini-title">${escapeHtml(track.name)}</div>
                <div class="sk-mini-artist">${escapeHtml(track.artist)}</div>
              </div>
              <button type="button" class="sk-ctrl-btn" id="sk-mp-foot-prev" aria-label="Previous">⏮</button>
              <button type="button" class="sk-ctrl-btn primary" data-sk-play-toggle aria-label="Play or Pause">${this.isLoadingAudio ? '⏳' : (this.isPlaying ? '⏸' : '▶')}</button>
              <button type="button" class="sk-ctrl-btn" id="sk-mp-foot-next" aria-label="Next">⏭</button>
            </div>
            <div class="sk-seek-row">
              <span data-sk-cur-time>${formatMusicTime(cur)}</span>
              <input type="range" class="sk-seek-slider" data-sk-seek min="0" max="100" step="0.2" value="${pct}" aria-label="Seek position" />
              <span data-sk-dur-time>${formatMusicTime(dur)}</span>
            </div>
          </div>
        ` : ''}
      </section>
    `;

    this.root.querySelector('#sk-mp-visuals')?.addEventListener('click', () => this.toggleVisuals());
    this.root.querySelector('#sk-mp-minimize')?.addEventListener('click', () => this.minimize());
    this.root.querySelector('#sk-mp-close')?.addEventListener('click', () => this.close());

    this.root.querySelectorAll('[data-mp-tab]').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        this.activeTab = tabBtn.dataset.mpTab;
        this.render();
      });
    });

    const searchInput = this.root.querySelector('#sk-mp-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
    }
    this.root.querySelector('#sk-mp-clear-search')?.addEventListener('click', () => {
      this.searchQuery = '';
      this.searchResults = null;
      this.collectionView = null;
      this.render();
    });

    this.root.querySelector('#sk-mp-goto-playing')?.addEventListener('click', () => {
      this.activeTab = 'playing';
      this.render();
    });
    this.root.querySelector('#sk-mp-foot-prev')?.addEventListener('click', () => this.prevTrack());
    this.root.querySelector('#sk-mp-foot-next')?.addEventListener('click', () => this.nextTrack());
    this.root.querySelector('.sk-mp-footer-bar [data-sk-play-toggle]')?.addEventListener('click', () => this.togglePlayPause());
    this.root.querySelector('.sk-mp-footer-bar [data-sk-seek]')?.addEventListener('input', (e) => this.seekTo(e.target.value));

    this.bindBodyEvents(this.root.querySelector('#sk-mp-body'));
  }
};
