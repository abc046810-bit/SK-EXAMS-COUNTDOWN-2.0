const BOT_UA_REGEX = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|phantom|puppeteer|playwright|curl|wget|python-requests|go-http-client|facebookexternalhit|whatsapp|telegrambot|discordbot|uptimerobot|pingdom/i;

function isBotRequest(request) {
  const ua = request.headers.get('User-Agent') || '';
  if (!ua.trim() || BOT_UA_REGEX.test(ua)) return true;
  return false;
}

function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '*';
  const allowed = (env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim()).filter(Boolean);
  let allowOrigin = '*';
  if (!allowed.includes('*')) {
    allowOrigin = allowed.includes(origin) ? origin : allowed[0] || '*';
  }
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store'
  };
}

export class PresenceRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    // Map<visitorId, { lastSeen: number, sockets: Set<WebSocket> }>
    this.visitors = new Map();
    this.TTL_MS = 45000;
  }

  pruneExpired(now = Date.now()) {
    let changed = false;
    for (const [id, entry] of this.visitors.entries()) {
      if (entry.sockets.size === 0 && now - entry.lastSeen > this.TTL_MS) {
        this.visitors.delete(id);
        changed = true;
      } else if (entry.sockets.size > 0 && now - entry.lastSeen > this.TTL_MS * 2) {
        // Safety cleanup for stale half-open sockets
        this.visitors.delete(id);
        changed = true;
      }
    }
    return changed;
  }

  getCount() {
    this.pruneExpired();
    return this.visitors.size;
  }

  broadcastCount() {
    const payload = JSON.stringify({ type: 'count', count: this.getCount() });
    for (const entry of this.visitors.values()) {
      for (const ws of entry.sockets) {
        try {
          ws.send(payload);
        } catch {
          entry.sockets.delete(ws);
        }
      }
    }
  }

  touchVisitor(visitorId, ws = null) {
    if (!visitorId || typeof visitorId !== 'string' || visitorId.length > 80) return false;
    const now = Date.now();
    let entry = this.visitors.get(visitorId);
    const isNew = !entry;
    if (!entry) {
      entry = { lastSeen: now, sockets: new Set() };
      this.visitors.set(visitorId, entry);
    } else {
      entry.lastSeen = now;
    }
    if (ws) entry.sockets.add(ws);
    return isNew;
  }

  removeVisitor(visitorId, ws = null) {
    const entry = this.visitors.get(visitorId);
    if (!entry) return false;
    if (ws) {
      entry.sockets.delete(ws);
      if (entry.sockets.size > 0) return false;
    }
    this.visitors.delete(visitorId);
    return true;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const cors = getCorsHeaders(request, this.env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // WebSocket realtime connection
    if (request.headers.get('Upgrade') === 'websocket') {
      if (isBotRequest(request)) {
        return new Response('Bots excluded', { status: 403, headers: cors });
      }
      const visitorId = (url.searchParams.get('vid') || '').trim();
      if (!visitorId || visitorId.length > 80) {
        return new Response('Missing vid', { status: 400, headers: cors });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      server.accept();

      this.touchVisitor(visitorId, server);
      this.broadcastCount();

      server.addEventListener('message', (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg && msg.type === 'ping') {
            this.touchVisitor(visitorId, server);
            server.send(JSON.stringify({ type: 'count', count: this.getCount() }));
          } else if (msg && msg.type === 'leave') {
            if (this.removeVisitor(visitorId, server)) {
              this.broadcastCount();
            }
          }
        } catch {
          // Ignore malformed frames
        }
      });

      const handleDisconnect = () => {
        const entry = this.visitors.get(visitorId);
        if (entry) {
          entry.sockets.delete(server);
          if (entry.sockets.size === 0) {
            // Short 10s grace period for page reloads before expiring
            entry.lastSeen = Math.min(entry.lastSeen, Date.now() - (this.TTL_MS - 10000));
          }
        }
        this.broadcastCount();
      };

      server.addEventListener('close', handleDisconnect);
      server.addEventListener('error', handleDisconnect);

      return new Response(null, { status: 101, webSocket: client });
    }

    // HTTP Heartbeat fallback
    if (url.pathname === '/heartbeat' && request.method === 'POST') {
      if (isBotRequest(request)) {
        return Response.json({ count: this.getCount(), ignored: true }, { headers: cors });
      }
      let body = {};
      try {
        body = await request.json();
      } catch {
        // Ignore empty body
      }
      const visitorId = (body.vid || url.searchParams.get('vid') || '').trim();
      const changed = this.touchVisitor(visitorId);
      if (changed) this.broadcastCount();
      return Response.json({ count: this.getCount() }, { headers: cors });
    }

    // HTTP Leave beacon
    if (url.pathname === '/leave' && request.method === 'POST') {
      let body = {};
      try {
        const text = await request.text();
        if (text) body = JSON.parse(text);
      } catch {
        // Ignore parse errors
      }
      const visitorId = (body.vid || url.searchParams.get('vid') || '').trim();
      if (visitorId && this.removeVisitor(visitorId)) {
        this.broadcastCount();
      }
      return Response.json({ count: this.getCount() }, { headers: cors });
    }

    // Read-only current count
    if (url.pathname === '/count' && request.method === 'GET') {
      return Response.json({ count: this.getCount() }, { headers: cors });
    }

    return new Response('Not Found', { status: 404, headers: cors });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = getCorsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'sk-exams-presence' }, { headers: cors });
    }

    const id = env.PRESENCE_ROOM.idFromName('global-sk-exams-presence');
    const stub = env.PRESENCE_ROOM.get(id);
    return stub.fetch(request);
  }
};
