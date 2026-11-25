import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const PRESENCE_WORKER_URL = (process.env.PRESENCE_WORKER_URL || '').trim();

const BOT_UA_REGEX = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|phantom|puppeteer|playwright|curl|wget|python-requests|go-http-client|facebookexternalhit|whatsapp|telegrambot|discordbot|uptimerobot|pingdom/i;
const PRESENCE_TTL_MS = 45000;
const localVisitors = new Map();

function pruneLocalVisitors(now = Date.now()) {
  for (const [vid, lastSeen] of localVisitors.entries()) {
    if (now - lastSeen > PRESENCE_TTL_MS) {
      localVisitors.delete(vid);
    }
  }
}

function isBotUa(req) {
  const ua = req.headers['user-agent'] || '';
  return !ua.trim() || BOT_UA_REGEX.test(ua);
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 4096) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.txt']);

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function sendFile(req, res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  setSecurityHeaders(res);
  res.setHeader('Content-Type', contentType);

  if (filePath.endsWith('sw.js') || filePath.endsWith('presence-config.js')) {
    res.setHeader('Cache-Control', 'no-cache');
  } else if (filePath.endsWith('exams.json')) {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=60');
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const shouldGzip = COMPRESSIBLE.has(ext) && acceptEncoding.includes('gzip');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
      return;
    }

    if (shouldGzip) {
      zlib.gzip(data, (zipErr, compressed) => {
        if (zipErr) {
          res.writeHead(statusCode, { 'Content-Length': data.length });
          res.end(req.method === 'HEAD' ? undefined : data);
          return;
        }
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Vary', 'Accept-Encoding');
        res.writeHead(statusCode, { 'Content-Length': compressed.length });
        res.end(req.method === 'HEAD' ? undefined : compressed);
      });
    } else {
      res.writeHead(statusCode, { 'Content-Length': data.length });
      res.end(req.method === 'HEAD' ? undefined : data);
    }
  });
}

if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  console.error('❌ dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(reqUrl.pathname);

    // Health check endpoint for Render Free Web Service
    if (pathname === '/health' || pathname === '/api/health') {
      setSecurityHeaders(res);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({
        status: 'ok',
        service: 'sk-exams-countdown-2',
        version: '2.0.0',
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Dynamic presence runtime configuration for Render
    if (pathname === '/presence-config.js' && (req.method === 'GET' || req.method === 'HEAD')) {
      setSecurityHeaders(res);
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(req.method === 'HEAD' ? undefined : `window.__SK_PRESENCE_URL__ = ${JSON.stringify(PRESENCE_WORKER_URL)};\n`);
      return;
    }

    // Lightweight single-instance presence fallback when PRESENCE_WORKER_URL is not set on Render
    if (pathname === '/api/presence/count' && req.method === 'GET') {
      pruneLocalVisitors();
      setSecurityHeaders(res);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ count: localVisitors.size }));
      return;
    }

    if (pathname === '/api/presence/heartbeat' && req.method === 'POST') {
      pruneLocalVisitors();
      setSecurityHeaders(res);
      if (!isBotUa(req)) {
        const body = await readJsonBody(req);
        const vid = typeof body.vid === 'string' ? body.vid.trim() : '';
        if (vid && vid.length <= 80) {
          localVisitors.set(vid, Date.now());
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ count: localVisitors.size }));
      return;
    }

    if (pathname === '/api/presence/leave' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const vid = typeof body.vid === 'string' ? body.vid.trim() : '';
      if (vid) localVisitors.delete(vid);
      pruneLocalVisitors();
      setSecurityHeaders(res);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ count: localVisitors.size }));
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    // Prevent directory traversal
    const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    const candidate = path.join(DIST_DIR, safePath === '/' ? 'index.html' : safePath);

    if (!candidate.startsWith(DIST_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      sendFile(req, res, candidate, 200);
      return;
    }

    // If requesting a missing static asset (with file extension), return 404
    if (path.extname(pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    // SPA fallback for client-side routes
    sendFile(req, res, path.join(DIST_DIR, 'index.html'), 200);
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 SK EXAMS COUNTDOWN 2.0 running on http://${HOST}:${PORT} (serving dist/)`);
});

function shutdown(signal) {
  console.log(`\nReceived ${signal}. Closing server gracefully...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
