// SK MUSIC — Reused Music Service adapted from src/services/musicService.ts & MusicTrack.interface.ts
// Uses the verified working source directly: https://jiosaavn-music-player.vercel.app/api/search/songs

const MUSIC_SOURCE_BASE_URL = 'https://jiosaavn-music-player.vercel.app';

/**
 * @typedef {Object} MusicTrack
 * @property {string} id
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * @property {number} durationSec
 * @property {string} artworkUrl
 * @property {string} streamUrl
 * @property {string} sourcePageUrl
 */

/**
 * @typedef {Object} MusicArtistItem
 * @property {string} id
 * @property {string} name
 * @property {string} artworkUrl
 * @property {number} count
 */

function decodeMusicHtmlEntities(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function sanitizeStreamUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  // Strip trailing non-printable padding bytes sometimes returned in stream URLs
  return rawUrl.replace(/[\u0000-\u001F\u007F]+/g, '').trim();
}

function pickBestArtwork(images) {
  if (typeof images === 'string') return sanitizeStreamUrl(images);
  if (!Array.isArray(images) || images.length === 0) return '';
  const preferred = images.find((img) => img && img.quality === '150x150') || images[images.length - 1];
  return preferred && preferred.url ? sanitizeStreamUrl(preferred.url) : '';
}

function pickBestAudioUrl(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return '';
  const preferred =
    urls.find((u) => u && u.quality === '160kbps') ||
    urls.find((u) => u && u.quality === '320kbps') ||
    urls.find((u) => u && u.quality === '96kbps') ||
    urls[urls.length - 1];
  return preferred && preferred.url ? sanitizeStreamUrl(preferred.url) : '';
}

function formatMusicDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function parseSongsAndArtists(results) {
  const tracks = [];
  const rawArtists = [];

  if (!Array.isArray(results)) {
    return { tracks, rawArtists };
  }

  for (const item of results) {
    if (!item) continue;
    const streamUrl = pickBestAudioUrl(item.downloadUrl);
    if (!item.id || !streamUrl) continue;

    const primaryList = (item.artists && Array.isArray(item.artists.primary)) ? item.artists.primary : [];
    const allList = (item.artists && Array.isArray(item.artists.all)) ? item.artists.all : [];

    const primaryNames = primaryList.map((a) => a && a.name).filter(Boolean);
    const fallbackNames = allList.map((a) => a && a.name).filter(Boolean);
    const artistNames = primaryNames.length > 0 ? primaryNames : fallbackNames;
    const artworkUrl = pickBestArtwork(item.image);

    tracks.push({
      id: String(item.id),
      title: decodeMusicHtmlEntities(item.name || 'Untitled Track'),
      artist: decodeMusicHtmlEntities(artistNames.slice(0, 2).join(', ') || 'Unknown Artist'),
      album: decodeMusicHtmlEntities((item.album && item.album.name) || 'Single'),
      durationSec: Number(item.duration) || 0,
      artworkUrl,
      streamUrl,
      sourcePageUrl: MUSIC_SOURCE_BASE_URL
    });

    // Collect real artist metadata returned by /api/search/songs
    for (const a of primaryList) {
      const cleanName = decodeMusicHtmlEntities(a && a.name ? a.name : '');
      if (!cleanName) continue;
      const artistArt = pickBestArtwork(a.image) || artworkUrl;
      rawArtists.push({
        id: a.id ? String(a.id) : cleanName.toLowerCase(),
        name: cleanName,
        artworkUrl: artistArt
      });
    }
  }

  return { tracks, rawArtists };
}

async function searchMusicTracksWithArtists(query, limit = 14) {
  const trimmed = String(query || '').trim();
  if (!trimmed) return { tracks: [], rawArtists: [] };

  const endpoint = `${MUSIC_SOURCE_BASE_URL}/api/search/songs?query=${encodeURIComponent(trimmed)}&page=0&limit=${limit}`;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Music service returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    const results = payload && payload.data && payload.data.results;
    return parseSongsAndArtists(results);
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error('Music service timed out. Try again or open the external player.');
    }
    throw new Error(
      err instanceof Error
        ? `Unable to reach ${MUSIC_SOURCE_BASE_URL}: ${err.message}`
        : `Unable to reach ${MUSIC_SOURCE_BASE_URL}`
    );
  } finally {
    window.clearTimeout(timeout);
  }
}

async function searchMusicTracks(query, limit = 14) {
  const { tracks } = await searchMusicTracksWithArtists(query, limit);
  return tracks;
}

function aggregatePopularArtists(artistEntries, maxCount = 12) {
  const map = new Map();
  for (const entry of artistEntries) {
    if (!entry || !entry.name) continue;
    const key = entry.name.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      if (!existing.artworkUrl && entry.artworkUrl) {
        existing.artworkUrl = entry.artworkUrl;
      }
    } else {
      map.set(key, {
        id: entry.id || key,
        name: entry.name,
        artworkUrl: entry.artworkUrl || '',
        count: 1
      });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, maxCount);
}

async function loadMusicDiscovery() {
  const [trendingRes, popularRes] = await Promise.allSettled([
    searchMusicTracksWithArtists('trending hindi', 12),
    searchMusicTracksWithArtists('top bollywood hits', 12)
  ]);

  if (trendingRes.status === 'rejected' && popularRes.status === 'rejected') {
    throw trendingRes.reason || new Error(`Unable to reach ${MUSIC_SOURCE_BASE_URL}`);
  }

  const trending = trendingRes.status === 'fulfilled' ? trendingRes.value.tracks : [];
  const trendingIds = new Set(trending.map((t) => t.id));
  const popularRaw = popularRes.status === 'fulfilled' ? popularRes.value.tracks : [];
  const popular = popularRaw.filter((t) => !trendingIds.has(t.id));

  const combinedArtists = [
    ...(trendingRes.status === 'fulfilled' ? trendingRes.value.rawArtists : []),
    ...(popularRes.status === 'fulfilled' ? popularRes.value.rawArtists : [])
  ];
  const artists = aggregatePopularArtists(combinedArtists, 12);

  return {
    artists,
    trending,
    popular: popular.length > 0 ? popular : popularRaw
  };
}
