// Safe Browser Storage & Centralized State Manager
const KEYS = {
  SETTINGS: 'sk2_settings',
  FAVOURITES: 'sk2_favourites',
  CUSTOMS: 'sk2_custom_countdowns',
  RECENT_SEARCH: 'sk2_recent_searches',
  BREAK_COOLDOWN_UNTIL: 'sk2_break_cooldown_until',
  REMINDERS: 'sk2_reminders'
};

const DEFAULT_SETTINGS = {
  theme: 'dark',
  lang: 'en',
  bgEnabled: true,
  bgPreset: 'auto', // auto | constellation | aurora | stardust | waves
  mascotEnabled: true,
  musicCooldownMinutes: 15,
  reducedMotion: false,
  soundEnabled: false
};

function safeRead(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const Store = {
  settings: null,
  favourites: [],
  customs: [],
  recentSearches: [],

  init() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saved = safeRead(KEYS.SETTINGS, null);
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      { reducedMotion: Boolean(prefersReduced) },
      saved || {}
    );
    this.favourites = safeRead(KEYS.FAVOURITES, []);
    if (!Array.isArray(this.favourites)) this.favourites = [];

    // Also migrate any custom countdowns from v1 if present
    const v2Customs = safeRead(KEYS.CUSTOMS, null);
    if (Array.isArray(v2Customs)) {
      this.customs = v2Customs;
    } else {
      const legacy = safeRead('sk_custom_countdowns', []);
      this.customs = Array.isArray(legacy) ? legacy.map((c) => ({
        id: c.id || `custom-${Date.now()}`,
        shortName: c.name || 'Custom Countdown',
        fullName: c.fullName || c.name || 'Custom Countdown',
        date: c.date,
        note: c.note || '',
        custom: true
      })) : [];
      if (this.customs.length) safeWrite(KEYS.CUSTOMS, this.customs);
    }

    this.recentSearches = safeRead(KEYS.RECENT_SEARCH, []);
    if (!Array.isArray(this.recentSearches)) this.recentSearches = [];

    this.applySettingsToDOM();
  },

  getSettings() {
    if (!this.settings) this.init();
    return this.settings;
  },

  updateSettings(patch) {
    this.settings = Object.assign({}, this.getSettings(), patch);
    safeWrite(KEYS.SETTINGS, this.settings);
    this.applySettingsToDOM();
    return this.settings;
  },

  resetSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS);
    safeWrite(KEYS.SETTINGS, this.settings);
    this.applySettingsToDOM();
    return this.settings;
  },

  applySettingsToDOM() {
    const s = this.getSettings();
    document.documentElement.setAttribute('data-theme', s.theme);
    document.documentElement.setAttribute('lang', s.lang === 'hi' ? 'hi' : 'en');
    document.documentElement.setAttribute('data-reduced-motion', s.reducedMotion ? 'true' : 'false');
    document.body.classList.toggle('bg-disabled', !s.bgEnabled);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', s.theme === 'dark' ? '#070914' : '#f4f6fb');
    }
  },

  isFavourite(id) {
    return this.favourites.includes(id);
  },

  toggleFavourite(id) {
    if (this.isFavourite(id)) {
      this.favourites = this.favourites.filter((x) => x !== id);
      safeWrite(KEYS.FAVOURITES, this.favourites);
      return false;
    }
    this.favourites = [id, ...this.favourites];
    safeWrite(KEYS.FAVOURITES, this.favourites);
    return true;
  },

  getCustoms() {
    return this.customs;
  },

  saveCustom(item) {
    const idx = this.customs.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      this.customs[idx] = item;
    } else {
      this.customs.unshift(item);
      this.customs = this.customs.slice(0, 30);
    }
    safeWrite(KEYS.CUSTOMS, this.customs);
  },

  deleteCustom(id) {
    this.customs = this.customs.filter((c) => c.id !== id);
    safeWrite(KEYS.CUSTOMS, this.customs);
  },

  addRecentSearch(query) {
    const q = (query || '').trim();
    if (!q) return;
    this.recentSearches = [q, ...this.recentSearches.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6);
    safeWrite(KEYS.RECENT_SEARCH, this.recentSearches);
  },

  clearRecentSearches() {
    this.recentSearches = [];
    safeWrite(KEYS.RECENT_SEARCH, []);
  },

  isBreakPromptCoolingDown() {
    const until = Number(safeRead(KEYS.BREAK_COOLDOWN_UNTIL, 0));
    return Date.now() < until;
  },

  setBreakPromptCooldown() {
    const mins = Math.max(1, Number(this.getSettings().musicCooldownMinutes) || 15);
    safeWrite(KEYS.BREAK_COOLDOWN_UNTIL, Date.now() + mins * 60 * 1000);
  },

  clearSavedData() {
    this.favourites = [];
    this.customs = [];
    this.recentSearches = [];
    safeWrite(KEYS.FAVOURITES, []);
    safeWrite(KEYS.CUSTOMS, []);
    safeWrite(KEYS.RECENT_SEARCH, []);
    safeWrite(KEYS.BREAK_COOLDOWN_UNTIL, 0);
    safeWrite(KEYS.REMINDERS, []);
  },

  getReminders() {
    const list = safeRead(KEYS.REMINDERS, []);
    return Array.isArray(list) ? list : [];
  },

  saveReminders(list) {
    safeWrite(KEYS.REMINDERS, list);
  }
};
