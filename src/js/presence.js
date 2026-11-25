// Global Live Website Visitor Count Client
// - Anonymous browser-level visitorId (zero PII, no login)
// - Multi-tab deduplication via BroadcastChannel + shared open-tabs registry
// - Bot & crawler exclusion
// - Realtime WebSocket to Cloudflare Worker Durable Object, with HTTP heartbeat + Render fallback
const PresenceClient = {
  VISITOR_ID_KEY: 'sk2_anon_visitor_id',
  OPEN_TABS_KEY: 'sk2_presence_open_tabs',
  HEARTBEAT_MS: 20000,
  TAB_STALE_MS: 35000,

  tabId: `t_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`,
  visitorId: null,
  endpoint: '',
  ws: null,
  heartbeatTimer: null,
  reconnectTimer: null,
  channel: null,
  isLeader: false,
  currentCount: null,
  isOffline: false,

  isLikelyBot() {
    try {
      if (navigator.webdriver) return true;
      const ua = navigator.userAgent || '';
      if (!ua) return true;
      return /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|phantom|puppeteer|playwright|facebookexternalhit|whatsapp|telegrambot|discordbot/i.test(ua);
    } catch {
      return false;
    }
  },

  getVisitorId() {
    if (this.visitorId) return this.visitorId;
    try {
      let id = window.localStorage.getItem(this.VISITOR_ID_KEY);
      if (!id || id.length > 80) {
        id = (window.crypto && typeof window.crypto.randomUUID === 'function')
          ? `v_${window.crypto.randomUUID()}`
          : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
        window.localStorage.setItem(this.VISITOR_ID_KEY, id);
      }
      this.visitorId = id;
      return id;
    } catch {
      this.visitorId = `v_mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      return this.visitorId;
    }
  },

  readOpenTabs() {
    try {
      const raw = window.localStorage.getItem(this.OPEN_TABS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const now = Date.now();
      const cleaned = {};
      for (const [id, ts] of Object.entries(parsed)) {
        if (typeof ts === 'number' && now - ts < this.TAB_STALE_MS) {
          cleaned[id] = ts;
        }
      }
      return cleaned;
    } catch {
      return {};
    }
  },

  writeOpenTabs(tabs) {
    try {
      window.localStorage.setItem(this.OPEN_TABS_KEY, JSON.stringify(tabs));
    } catch {
      // Ignore storage quota errors
    }
  },

  registerTab() {
    const tabs = this.readOpenTabs();
    tabs[this.tabId] = Date.now();
    this.writeOpenTabs(tabs);
    const ids = Object.keys(tabs).sort();
    this.isLeader = ids[0] === this.tabId;
    return ids.length;
  },

  unregisterTab() {
    const tabs = this.readOpenTabs();
    delete tabs[this.tabId];
    this.writeOpenTabs(tabs);
    return Object.keys(tabs).length;
  },

  async resolveEndpoint() {
    const configured = (window.__SK_PRESENCE_URL__ || '').trim().replace(/\/+$/, '');
    if (configured) return configured;

    // Check if running on Render Node server (which provides /api/presence/*)
    try {
      const res = await fetch('/api/presence/count', { method: 'GET', cache: 'no-store' });
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          return `${window.location.origin}/api/presence`;
        }
      }
    } catch {
      // Not on Render server
    }
    return '';
  },

  async init() {
    if (this.isLikelyBot()) {
      this.renderCount(null);
      return;
    }

    this.getVisitorId();
    this.endpoint = await this.resolveEndpoint();
    if (!this.endpoint) {
      this.isOffline = true;
      this.renderCount(null);
      return;
    }

    this.setupBroadcastChannel();
    this.registerTab();
    this.startHeartbeatLoop();

    if (this.isLeader) {
      this.connect();
    } else {
      // Request latest count from active leader tab; fallback to direct connect if no reply
      this.channel?.postMessage({ type: 'sync-request' });
      setTimeout(() => {
        if (this.currentCount === null) {
          this.registerTab();
          if (this.isLeader) this.connect();
          else this.sendHttpHeartbeat();
        }
      }, 1200);
    }

    window.addEventListener('pagehide', () => this.handleUnload());
    window.addEventListener('beforeunload', () => this.handleUnload());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.registerTab();
        if (this.isLeader && (!this.ws || this.ws.readyState !== WebSocket.OPEN)) {
          this.connect();
        } else if (this.isLeader) {
          this.sendPing();
        }
      }
    });
  },

  setupBroadcastChannel() {
    if (!('BroadcastChannel' in window)) return;
    try {
      this.channel = new BroadcastChannel('sk2_visitor_presence');
      this.channel.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;
        if (msg.type === 'count' && typeof msg.count === 'number') {
          this.isOffline = false;
          this.renderCount(msg.count);
        } else if (msg.type === 'sync-request' && this.isLeader && this.currentCount !== null) {
          this.channel.postMessage({ type: 'count', count: this.currentCount });
        } else if (msg.type === 'leader-left') {
          this.registerTab();
          if (this.isLeader) this.connect();
        }
      };
    } catch {
      this.channel = null;
    }
  },

  connect() {
    if (!this.endpoint) return;
    // Render fallback (/api/presence) uses HTTP heartbeat; Cloudflare Worker supports WebSocket + HTTP
    const isWorker = !this.endpoint.endsWith('/api/presence');
    if (isWorker && 'WebSocket' in window) {
      this.connectWebSocket();
    } else {
      this.sendHttpHeartbeat();
    }
  },

  connectWebSocket() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    try {
      const wsBase = this.endpoint.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
      const wsUrl = `${wsBase}/ws?vid=${encodeURIComponent(this.visitorId)}`;
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        this.isOffline = false;
        this.sendPing();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data.count === 'number') {
            this.isOffline = false;
            this.renderCount(data.count);
            this.channel?.postMessage({ type: 'count', count: data.count });
          }
        } catch {
          // Ignore malformed message
        }
      };

      ws.onclose = () => {
        this.ws = null;
        if (this.isLeader) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => this.sendHttpHeartbeat(), 2500);
        }
      };

      ws.onerror = () => {
        try { ws.close(); } catch {}
      };
    } catch {
      this.sendHttpHeartbeat();
    }
  },

  sendPing() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'ping', vid: this.visitorId }));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  },

  async sendHttpHeartbeat() {
    if (!this.endpoint) return;
    try {
      const res = await fetch(`${this.endpoint}/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vid: this.visitorId }),
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof data.count === 'number') {
        this.isOffline = false;
        this.renderCount(data.count);
        this.channel?.postMessage({ type: 'count', count: data.count });
      }
    } catch {
      if (this.currentCount === null) {
        this.isOffline = true;
        this.renderCount(null);
      }
    }
  },

  startHeartbeatLoop() {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.registerTab();
      if (!this.isLeader) return;
      if (!this.sendPing()) {
        this.sendHttpHeartbeat();
      }
    }, this.HEARTBEAT_MS);
  },

  handleUnload() {
    const remainingTabs = this.unregisterTab();
    if (remainingTabs > 0) {
      if (this.isLeader) {
        try { this.ws?.close(); } catch {}
        this.channel?.postMessage({ type: 'leader-left' });
      }
      return;
    }

    // Last tab in this browser is closing: notify server immediately
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'leave', vid: this.visitorId }));
      } catch {}
    }
    if (this.endpoint && navigator.sendBeacon) {
      try {
        const blob = new Blob([JSON.stringify({ vid: this.visitorId })], { type: 'application/json' });
        navigator.sendBeacon(`${this.endpoint}/leave`, blob);
      } catch {}
    }
  },

  renderCount(count) {
    if (typeof count === 'number') {
      this.currentCount = count;
    }
    const pill = document.getElementById('live-visitors-pill');
    const numEl = document.getElementById('live-visitors-count');
    const labelEl = document.getElementById('live-visitors-label');
    if (!pill || !numEl) return;

    if (typeof this.currentCount === 'number') {
      numEl.textContent = String(this.currentCount);
      pill.classList.remove('offline');
      pill.title = t('visitorsTooltip');
      if (labelEl) labelEl.textContent = t('visitorsOnline');
    } else {
      numEl.textContent = '—';
      pill.classList.add('offline');
      pill.title = t('visitorsOfflineTooltip');
      if (labelEl) labelEl.textContent = t('visitorsOnline');
    }
  }
};
