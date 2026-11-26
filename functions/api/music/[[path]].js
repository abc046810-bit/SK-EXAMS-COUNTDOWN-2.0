// Cloudflare Pages Function — Server-side JioSaavn Music API Proxy for SK MUSIC
// Route: /api/music/* (e.g., /api/music/health, /api/music/discover, /api/music/search, /api/music/album, /api/music/playlist, /api/music/artist, /api/music/suggestions)

const DEFAULT_UPSTREAM = 'https://saavn.dev/api';

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

function pickBestImage(imgList) {
  if (typeof imgList === 'string') return imgList;
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

function normalizeSong(item) {
  if (!item || !item.id) return null;
  const artistsPrimary = item.artists && Array.isArray(item.artists.primary)
    ? item.artists.primary.map((a) => decodeHtml(a.name)).filter(Boolean).join(', ')
    : '';
  const artist = artistsPrimary || decodeHtml(item.primaryArtists || item.subtitle || 'Unknown Artist');
  const audioUrl = pickBestAudio(item.downloadUrl);
  return {
    id: String(item.id),
    name: decodeHtml(item.name || item.title || 'Untitled'),
    artist,
    album: decodeHtml((item.album && item.album.name) || item.album || ''),
    duration: Number(item.duration) || 0,
    year: item.year ? String(item.year) : '',
    image: pickBestImage(item.image),
    url: audioUrl
  };
}

function normalizeArtist(item) {
  if (!item || !item.id) return null;
  return {
    id: String(item.id),
    name: decodeHtml(item.name || item.title || 'Artist'),
    role: decodeHtml(item.role || item.description || 'Artist'),
    image: pickBestImage(item.image)
  };
}

function normalizeAlbum(item) {
  if (!item || !item.id) return null;
  const artistsPrimary = item.artists && Array.isArray(item.artists.primary)
    ? item.artists.primary.map((a) => decodeHtml(a.name)).filter(Boolean).join(', ')
    : '';
  return {
    id: String(item.id),
    name: decodeHtml(item.name || item.title || 'Album'),
    artist: artistsPrimary || decodeHtml(item.artist || item.description || ''),
    year: item.year ? String(item.year) : '',
    image: pickBestImage(item.image)
  };
}

function normalizePlaylist(item) {
  if (!item || !item.id) return null;
  return {
    id: String(item.id),
    name: decodeHtml(item.name || item.title || 'Playlist'),
    songCount: Number(item.songCount) || 0,
    image: pickBestImage(item.image)
  };
}

function jsonResponse(data, status = 200, maxAge = 120) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': maxAge > 0 ? `public, max-age=${maxAge}` : 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

async function fetchJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json', 'User-Agent': 'SK-Exams-Countdown/2.2' }
    });
    if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequest(context) {
  const { request, env, params } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405, 0);
  }

  const upstreamBase = (env && env.JIOSAAVN_API_URL ? String(env.JIOSAAVN_API_URL) : DEFAULT_UPSTREAM).replace(/\/+$/, '');
  const reqUrl = new URL(request.url);
  const pathParts = Array.isArray(params.path) ? params.path : (params.path ? [params.path] : []);
  const route = pathParts.join('/').toLowerCase();

  try {
    if (route === 'health') {
      return jsonResponse({ ok: true, status: 'ok', service: 'sk-music-proxy', upstream: upstreamBase }, 200, 0);
    }

    if (route === 'discover') {
      const [trendingRes, popularRes, artistsRes] = await Promise.allSettled([
        fetchJson(`${upstreamBase}/search/songs?query=${encodeURIComponent('trending hindi')}&limit=10`),
        fetchJson(`${upstreamBase}/search/songs?query=${encodeURIComponent('lofi study instrumental')}&limit=10`),
        fetchJson(`${upstreamBase}/search/artists?query=${encodeURIComponent('Arijit Singh')}&limit=8`)
      ]);

      const trending = trendingRes.status === 'fulfilled'
        ? ((trendingRes.value && trendingRes.value.data && trendingRes.value.data.results) || []).map(normalizeSong).filter((s) => s && s.url)
        : [];
      const popular = popularRes.status === 'fulfilled'
        ? ((popularRes.value && popularRes.value.data && popularRes.value.data.results) || []).map(normalizeSong).filter((s) => s && s.url)
        : [];
      const artists = artistsRes.status === 'fulfilled'
        ? ((artistsRes.value && artistsRes.value.data && artistsRes.value.data.results) || []).map(normalizeArtist).filter(Boolean)
        : [];

      if (trending.length === 0 && popular.length === 0 && artists.length === 0) {
        return jsonResponse({ ok: false, error: 'Music discovery service is temporarily unavailable. Please try again.' }, 502, 0);
      }

      return jsonResponse({ ok: true, trending, popular, artists }, 200, 300);
    }

    if (route === 'search') {
      const q = (reqUrl.searchParams.get('q') || '').trim();
      const limit = Math.min(Math.max(Number(reqUrl.searchParams.get('limit')) || 12, 1), 25);
      if (!q) {
        return jsonResponse({ ok: false, error: 'Missing search query parameter "q".' }, 400, 0);
      }

      const [songsRes, artistsRes, albumsRes, playlistsRes] = await Promise.allSettled([
        fetchJson(`${upstreamBase}/search/songs?query=${encodeURIComponent(q)}&limit=${limit}`),
        fetchJson(`${upstreamBase}/search/artists?query=${encodeURIComponent(q)}&limit=6`),
        fetchJson(`${upstreamBase}/search/albums?query=${encodeURIComponent(q)}&limit=6`),
        fetchJson(`${upstreamBase}/search/playlists?query=${encodeURIComponent(q)}&limit=6`)
      ]);

      const songs = songsRes.status === 'fulfilled'
        ? ((songsRes.value && songsRes.value.data && songsRes.value.data.results) || []).map(normalizeSong).filter((s) => s && s.url)
        : [];
      const artists = artistsRes.status === 'fulfilled'
        ? ((artistsRes.value && artistsRes.value.data && artistsRes.value.data.results) || []).map(normalizeArtist).filter(Boolean)
        : [];
      const albums = albumsRes.status === 'fulfilled'
        ? ((albumsRes.value && albumsRes.value.data && albumsRes.value.data.results) || []).map(normalizeAlbum).filter(Boolean)
        : [];
      const playlists = playlistsRes.status === 'fulfilled'
        ? ((playlistsRes.value && playlistsRes.value.data && playlistsRes.value.data.results) || []).map(normalizePlaylist).filter(Boolean)
        : [];

      if (songsRes.status === 'rejected' && artistsRes.status === 'rejected' && albumsRes.status === 'rejected') {
        return jsonResponse({ ok: false, error: 'Unable to reach JioSaavn music service right now.' }, 502, 0);
      }

      return jsonResponse({ ok: true, query: q, songs, artists, albums, playlists }, 200, 120);
    }

    if (route === 'album') {
      const id = (reqUrl.searchParams.get('id') || '').trim();
      if (!id) return jsonResponse({ ok: false, error: 'Missing album id.' }, 400, 0);
      const data = await fetchJson(`${upstreamBase}/albums?id=${encodeURIComponent(id)}`);
      const albumData = (data && data.data) || {};
      const songs = (albumData.songs || []).map(normalizeSong).filter((s) => s && s.url);
      return jsonResponse({ ok: true, title: decodeHtml(albumData.name || 'Album'), songs }, 200, 300);
    }

    if (route === 'playlist') {
      const id = (reqUrl.searchParams.get('id') || '').trim();
      if (!id) return jsonResponse({ ok: false, error: 'Missing playlist id.' }, 400, 0);
      const data = await fetchJson(`${upstreamBase}/playlists?id=${encodeURIComponent(id)}&limit=30`);
      const plData = (data && data.data) || {};
      const songs = (plData.songs || []).map(normalizeSong).filter((s) => s && s.url);
      return jsonResponse({ ok: true, title: decodeHtml(plData.name || 'Playlist'), songs }, 200, 300);
    }

    if (route === 'artist') {
      const id = (reqUrl.searchParams.get('id') || '').trim();
      if (!id) return jsonResponse({ ok: false, error: 'Missing artist id.' }, 400, 0);
      const data = await fetchJson(`${upstreamBase}/artists/${encodeURIComponent(id)}/songs`);
      const artData = (data && data.data) || {};
      const songs = (artData.songs || []).map(normalizeSong).filter((s) => s && s.url);
      return jsonResponse({ ok: true, title: decodeHtml(artData.name || 'Artist Top Songs'), songs }, 200, 300);
    }

    if (route === 'suggestions') {
      const id = (reqUrl.searchParams.get('id') || '').trim();
      if (!id) return jsonResponse({ ok: false, error: 'Missing song id.' }, 400, 0);
      const data = await fetchJson(`${upstreamBase}/songs/${encodeURIComponent(id)}/suggestions?limit=10`);
      const list = Array.isArray(data && data.data) ? data.data : [];
      const songs = list.map(normalizeSong).filter((s) => s && s.url);
      return jsonResponse({ ok: true, songs }, 200, 180);
    }

    return jsonResponse({ ok: false, error: 'Unknown music API endpoint.' }, 404, 0);
  } catch (err) {
    return jsonResponse({ ok: false, error: err && err.message ? err.message : 'Music API request failed.' }, 502, 0);
  }
      }
