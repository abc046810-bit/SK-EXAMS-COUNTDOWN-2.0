import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const PRESENCE_WORKER_URL = (process.env.PRESENCE_WORKER_URL || '').trim();
const JIOSAAVN_API_URL = (process.env.JIOSAAVN_API_URL || 'https://saavn.dev/api').trim().replace(/\/+$/, '');
const JIOSAAVN_DIRECT_BASE = 'https://www.jiosaavn.com/api.php?_format=json&_marker=0&ctx=web6dot0&api_version=4';

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

// ===== JIOSAAVN MUSIC PROXY HELPERS =====
function decodeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function decryptJioSaavnMediaUrl(encryptedUrl) {
  if (!encryptedUrl || typeof encryptedUrl !== 'string') return '';
  try {
    const decipher = crypto.createDecipheriv('des-ecb', Buffer.from('38346591', 'utf8'), null);
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encryptedUrl.trim(), 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.replace(/_96\.mp4$/, '_320.mp4');
  } catch {
    return '';
  }
}

function pickBestImage(imgList) {
  if (typeof imgList === 'string') return imgList.replace('150x150', '500x500').replace('50x50', '500x500');
  if (!Array.isArray(imgList) || imgList.length === 0) return '';
  const best = imgList[imgList.length - 1];
  return (best && (best.url || best.link)) || '';
}

function pickBestAudio(downloadList) {
  if (!Array.isArray(downloadList) || downloadList.length === 0) return '';
  const preferred = ['320kbps', '160kbps', '96kbps', '48kbps'];
  for (const q of preferred) {
    const match = downloadList.find((d) => d && d.quality === q && (d.url || d.link));
    if (match) return match.url || match.link;
  }
  const last = downloadList[downloadList.length - 1];
  return (last && (last.url || last.link)) || '';
}

function normalizeSaavnSong(item) {
  if (!item || !item.id) return null;
  const artistsPrimary = item.artists && Array.isArray(item.artists.primary)
    ? item.artists.primary.map((a) => decodeHtml(a.name)).filter(Boolean).join(', ')
    : '';
  const moreInfo = item.more_info || {};
  const artistMap = moreInfo.artistMap && Array.isArray(moreInfo.artistMap.primary_artists)
    ? moreInfo.artistMap.primary_artists.map((a) => decodeHtml(a.name)).filter(Boolean).join(', ')
    : '';
  const artist = artistsPrimary || artistMap || decodeHtml(item.primaryArtists || item.subtitle || 'Unknown Artist');
  const audioUrl = pickBestAudio(item.downloadUrl) || decryptJioSaavnMediaUrl(moreInfo.encrypted_media_url || item.encrypted_media_url);
  return {
    id: String(item.id),
    name: decodeHtml(item.name || item.title || 'Untitled'),
    artist,
    album: decodeHtml((item.album && item.album.name) || moreInfo.album || item.album || ''),
    duration: Number(item.duration || moreInfo.duration) || 0,
    year: item.year ? String(item.year) : '',
    image: pickBestImage(item.image),
    url: audioUrl
  };
}

function normalizeSaavnArtist(item) {
  if (!item || !item.id) return null;
  return {
    id: String(item.id),
    name: decodeHtml(item.name || item.title || 'Artist'),
    role: decodeHtml(item.role || item.description || 'Artist'),
    image: pickBestImage(item.image)
  };
}

function normalizeSaavnAlbum(item) {
  if (!item || !item.id) return null;
  const artistsPrimary = item.artists && Array.isArray(item.artists.primary)
    ? item.artists.primary.map((a) => decodeHtml(a.name)).filter(Boolean).join(', ')
    : '';
  return {
    id: String(item.id),
    name: decodeHtml(item.name || item.title || 'Album'),
    artist: artistsPrimary || decodeHtml(item.artist || item.subtitle || item.description || ''),
    year: item.year ? String(item.year) : '',
    image: pickBestImage(item.image)
  };
}

function normalizeSaavnPlaylist(item) {
  if (!item || !item.id) return null;
  return {
    id: String(item.id),
    name: decodeHtml(item.name || item.title || 'Playlist'),
    songCount: Number(item.songCount || (item.more_info && item.more_info.song_count)) || 0,
    image: pickBestImage(item.image)
  };
}

async function fetchUpstreamJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; SK-Exams-Countdown/2.2)'
      }
    });
    if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function searchSongsWithFallback(query, limit = 12) {
  try {
    const data = await fetchUpstreamJson(`${JIOSAAVN_API_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    const list = ((data && data.data && data.data.results) || []).map(normalizeSaavnSong).filter((s) => s && s.url);
    if (list.length > 0) return list;
  } catch {
    // Fall back to direct JioSaavn endpoint
  }
  const direct = await fetchUpstreamJson(`${JIOSAAVN_DIRECT_BASE}&__call=search.getResults&q=${encodeURIComponent(query)}&n=${limit}&p=1`);
  return ((direct && direct.results) || []).map(normalizeSaavnSong).filter((s) => s && s.url);
}

function sendJson(res, payload, statusCode = 200, maxAge = 0) {
  setSecurityHeaders(res);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': maxAge > 0 ? `public, max-age=${maxAge}` : 'no-store'
  });
  res.end(JSON.stringify(payload));
}

async function handleMusicApi(reqUrl, res) {
  const route = reqUrl.pathname.replace(/^\/api\/music\/?/, '').toLowerCase();

  try {
    if (route === 'health') {
      sendJson(res, {
        ok: true,
        status: 'ok',
        service: 'sk-music-proxy',
        upstream: JIOSAAVN_API_URL,
        directFallback: true
      }, 200, 0);
      return;
    }

    if (route === 'discover') {
      const [trendingRes, popularRes, artistsRes] = await Promise.allSettled([
        searchSongsWithFallback('trending hindi', 10),
        searchSongsWithFallback('lofi study instrumental', 10),
        fetchUpstreamJson(`${JIOSAAVN_API_URL}/search/artists?query=${encodeURIComponent('Arijit Singh')}&limit=8`)
      ]);

      const trending = trendingRes.status === 'fulfilled' ? trendingRes.value : [];
      const popular = popularRes.status === 'fulfilled' ? popularRes.value : [];
      const artists = artistsRes.status === 'fulfilled'
        ? ((artistsRes.value && artistsRes.value.data && artistsRes.value.data.results) || []).map(normalizeSaavnArtist).filter(Boolean)
        : [];

      if (trending.length === 0 && popular.length === 0 && artists.length === 0) {
        sendJson(res, { ok: false, error: 'Music discovery service is temporarily unavailable. Please try again.' }, 502, 0);
        return;
      }

      sendJson(res, { ok: true, trending, popular, artists }, 200, 300);
      return;
    }

    if (route === 'search') {
      const q = (reqUrl.searchParams.get('q') || '').trim();
      const limit = Math.min(Math.max(Number(reqUrl.searchParams.get('limit')) || 12, 1), 25);
      if (!q) {
        sendJson(res, { ok: false, error: 'Missing search query parameter "q".' }, 400, 0);
        return;
      }

      const [songsRes, artistsRes, albumsRes, playlistsRes] = await Promise.allSettled([
        searchSongsWithFallback(q, limit),
        fetchUpstreamJson(`${JIOSAAVN_API_URL}/search/artists?query=${encodeURIComponent(q)}&limit=6`),
        fetchUpstreamJson(`${JIOSAAVN_API_URL}/search/albums?query=${encodeURIComponent(q)}&limit=6`),
        fetchUpstreamJson(`${JIOSAAVN_API_URL}/search/playlists?query=${encodeURIComponent(q)}&limit=6`)
      ]);

      const songs = songsRes.status === 'fulfilled' ? songsRes.value : [];
      const artists = artistsRes.status === 'fulfilled'
        ? ((artistsRes.value && artistsRes.value.data && artistsRes.value.data.results) || []).map(normalizeSaavnArtist).filter(Boolean)
        : [];
      const albums = albumsRes.status === 'fulfilled'
        ? ((albumsRes.value && albumsRes.value.data && albumsRes.value.data.results) || []).map(normalizeSaavnAlbum).filter(Boolean)
        : [];
      const playlists = playlistsRes.status === 'fulfilled'
        ? ((playlistsRes.value && playlistsRes.value.data && playlistsRes.value.data.results) || []).map(normalizeSaavnPlaylist).filter(Boolean)
        : [];

      if (songsRes.status === 'rejected' && artistsRes.status === 'rejected' && albumsRes.status === 'rejected') {
        sendJson(res, { ok: false, error: 'Unable to reach JioSaavn music service right now.' }, 502, 0);
        return;
      }

      sendJson(res, { ok: true, query: q, songs, artists, albums, playlists }, 200, 120);
      return;
    }

    if (route === 'album') {
      const id = (reqUrl.searchParams.get('id') || '').trim();
      if (!id) { sendJson(res, { ok: false, error: 'Missing album id.' }, 400, 0); return; }
      const data = await fetchUpstreamJson(`${JIOSAAVN_API_URL}/albums?id=${encodeURIComponent(id)}`);
      const albumData = (data && data.data) || {};
      const songs = (albumData.songs || []).map(normalizeSaavnSong).filter((s) => s && s.url);
      sendJson(res, { ok: true, title: decodeHtml(albumData.name || 'Album'), songs }, 200, 300);
      return;
    }

    if (route === 'playlist') {
      const id = (reqUrl.searchParams.get('id') || '').trim();
      if (!id) { sendJson(res, { ok: false, error: 'Missing playlist id.' }, 400, 0); return; }
      const data = await fetchUpstreamJson(`${JIOSAAVN_API_URL}/playlists?id=${encodeURIComponent(id)}&limit=30`);
      const plData = (data && data.data) || {};
      const songs = (plData.songs || []).map(normalizeSaavnSong).filter((s) => s && s.url);
      sendJson(res, { ok: true, title: decodeHtml(plData.name || 'Playlist'), songs }, 200, 300);
      return;
    }

    if (route === 'artist') {
      const id = (reqUrl.searchParams.get('id') || '').trim();
      if (!id) { sendJson(res, { ok: false, error: 'Missing artist id.' }, 400, 0); return; }
      const data = await fetchUpstreamJson(`${JIOSAAVN_API_URL}/artists/${encodeURIComponent(id)}/songs`);
      const artData = (data && data.data) || {};
      const songs = (artData.songs || []).map(normalizeSaavnSong).filter((s) => s && s.url);
      sendJson(res, { ok: true, title: decodeHtml(artData.name || 'Artist Top Songs'), songs }, 200, 300);
      return;
    }

    if (route === 'suggestions') {
      const id = (reqUrl.searchParams.get('id') || '').trim();
      if (!id) { sendJson(res, { ok: false, error: 'Missing song id.' }, 400, 0); return; }
      const data = await fetchUpstreamJson(`${JIOSAAVN_API_URL}/songs/${encodeURIComponent(id)}/suggestions?limit=10`);
      const list = Array.isArray(data && data.data) ? data.data : [];
      const songs = list.map(normalizeSaavnSong).filter((s) => s && s.url);
      sendJson(res, { ok: true, songs }, 200, 180);
      return;
    }

    sendJson(res, { ok: false, error: 'Unknown music API endpoint.' }, 404, 0);
  } catch (err) {
    sendJson(res, { ok: false, error: err && err.message ? err.message : 'Music API request failed.' }, 502, 0);
  }
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

  if (filePath.endsWith('sw.js') || filePath.endsWith('presence-config.js') || filePath.endsWith('index.html')) {
    res.setHeader('Cache-Control', 'no-cache');
  } else if (filePath.endsWith('exams.json') || filePath.endsWith('quiz.json')) {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
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

    if (pathname === '/health' || pathname === '/api/health') {
      setSecurityHeaders(res);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({
        status: 'ok',
        service: 'sk-exams-countdown',
        version: '2.2.0',
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
      }));
      return;
    }

    if (pathname.startsWith('/api/music/')) {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        sendJson(res, { ok: false, error: 'Method Not Allowed' }, 405, 0);
        return;
      }
      await handleMusicApi(reqUrl, res);
      return;
    }

    if (pathname === '/presence-config.js' && (req.method === 'GET' || req.method === 'HEAD')) {
      setSecurityHeaders(res);
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(req.method === 'HEAD' ? undefined : `window.__SK_PRESENCE_URL__ = ${JSON.stringify(PRESENCE_WORKER_URL)};\n`);
      return;
    }

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

    if (path.extname(pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    sendFile(req, res, path.join(DIST_DIR, 'index.html'), 200);
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 SK EXAMS COUNTDOWN running on http://${HOST}:${PORT} (serving dist/)`);
});

function shutdown(signal) {
  console.log(`\nReceived ${signal}. Closing server gracefully...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
