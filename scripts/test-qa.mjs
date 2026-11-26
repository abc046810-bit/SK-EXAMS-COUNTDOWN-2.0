import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateExamsFile } from './validate-exams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4186;

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}\n    ${err.message}`);
  }
}

async function httpFetch(reqPath, method = 'GET', headers = {}, body = undefined) {
  const res = await fetch(`http://127.0.0.1:${PORT}${reqPath}`, { method, headers, body });
  const buf = Buffer.from(await res.arrayBuffer());
  return { status: res.status, headers: res.headers, body: buf };
}

async function main() {
  console.log('\n=== SK EXAMS COUNTDOWN — Automated QA Suite (v2.3.0) ===\n');

  await test('Production dist/ directory contains all required Cloudflare Pages, PWA & quiz assets', () => {
    const required = [
      'index.html',
      '_redirects',
      '_headers',
      'manifest.json',
      'sw.js',
      'favicon.svg',
      'og-image.svg',
      'presence-config.js',
      'assets/app.css',
      'assets/app.js',
      'data/exams.json',
      'data/quiz.json'
    ];
    for (const rel of required) {
      assert.ok(fs.existsSync(path.join(DIST, rel)), `Missing dist/${rel}`);
    }
    assert.ok(!fs.existsSync(path.join(DIST, 'server')), 'Server code must not be copied into dist/');
  });

  await test('Exam database passes schema, timezone (+05:30), and official URL validation', () => {
    const res = validateExamsFile(path.join(DIST, 'data/exams.json'));
    assert.ok(res.count >= 30, `Expected >= 30 exams, got ${res.count}`);
  });

  await test('Practice quiz dataset is valid JSON with >= 15 verified questions and explanations', () => {
    const quiz = JSON.parse(fs.readFileSync(path.join(DIST, 'data/quiz.json'), 'utf8'));
    assert.ok(Array.isArray(quiz.questions) && quiz.questions.length >= 15);
    for (const q of quiz.questions) {
      assert.ok(q.id && q.subject && q.q && Array.isArray(q.options) && q.options.length === 4);
      assert.ok(typeof q.answer === 'number' && q.answer >= 0 && q.answer < 4);
      assert.ok(q.explanation && q.explanation.length > 5);
    }
  });

  await test('English and Hindi i18n dictionaries have 100% key parity', () => {
    const i18nSrc = fs.readFileSync(path.join(ROOT, 'src/js/i18n.js'), 'utf8');
    const sandbox = {};
    vm.runInNewContext(`${i18nSrc}\nthis.__T = TRANSLATIONS;`, sandbox);
    const enKeys = Object.keys(sandbox.__T.en).sort();
    const hiKeys = Object.keys(sandbox.__T.hi).sort();
    assert.deepEqual(enKeys, hiKeys, 'Mismatch between EN and HI translation keys');
  });

  await test('music-service.js reuses jiosaavn-music-player.vercel.app, sanitizes stream URLs, and derives real Popular Artists', () => {
    const svcSrc = fs.readFileSync(path.join(ROOT, 'src/js/music-service.js'), 'utf8');
    const sandbox = {};
    vm.runInNewContext(`${svcSrc}\nthis.__api = { MUSIC_SOURCE_BASE_URL, sanitizeStreamUrl, pickBestArtwork, pickBestAudioUrl, formatMusicDuration, parseSongsAndArtists, aggregatePopularArtists };`, sandbox);
    const api = sandbox.__api;
    assert.equal(api.MUSIC_SOURCE_BASE_URL, 'https://jiosaavn-music-player.vercel.app');
    assert.equal(api.sanitizeStreamUrl('https://cdn.example/a.mp4\u0000\u0007 '), 'https://cdn.example/a.mp4');
    assert.equal(api.formatMusicDuration(205), '3:25');
    assert.equal(
      api.pickBestAudioUrl([
        { quality: '96kbps', url: 'https://cdn.example/96.mp4' },
        { quality: '160kbps', url: 'https://cdn.example/160.mp4\u0003' }
      ]),
      'https://cdn.example/160.mp4'
    );
    const parsed = api.parseSongsAndArtists([
      {
        id: 's1',
        name: 'Kesariya &amp; More',
        duration: 268,
        album: { name: 'Brahmastra' },
        artists: { primary: [{ id: 'a1', name: 'Arijit Singh', image: [{ quality: '150x150', url: 'https://img/arijit.jpg' }] }] },
        image: [{ quality: '150x150', url: 'https://img/song1.jpg' }],
        downloadUrl: [{ quality: '160kbps', url: 'https://audio/song1.mp4' }]
      }
    ]);
    assert.equal(parsed.tracks.length, 1);
    assert.equal(parsed.tracks[0].title, 'Kesariya & More');
    assert.equal(parsed.tracks[0].artist, 'Arijit Singh');
    const artists = api.aggregatePopularArtists(parsed.rawArtists, 8);
    assert.equal(artists.length, 1);
    assert.equal(artists[0].name, 'Arijit Singh');
    assert.equal(artists[0].artworkUrl, 'https://img/arijit.jpg');
  });

  await test('Production dist/assets/app.js parses cleanly, preserves Telegram URL, THE SK 08 & uses working game music source', () => {
    const code = fs.readFileSync(path.join(DIST, 'assets/app.js'), 'utf8');
    new vm.Script(code, { filename: 'dist/assets/app.js' });
    assert.ok(code.includes('https://t.me/The_Sk08'), 'Missing preserved Telegram URL');
    assert.ok(code.includes('THE SK 08'), 'Missing THE SK 08 footer text');
    assert.ok(code.includes('https://t.me/SK_EXAMS_COUNTDOWN_bot'), 'Missing Telegram Feedback Bot URL');
    assert.ok(code.includes('https://jiosaavn-music-player.vercel.app'), 'Missing verified music source URL');
    assert.ok(code.includes('/api/search/songs'), 'Missing verified /api/search/songs endpoint');
    assert.ok(code.includes('Popular Artists'), 'Missing Popular Artists discovery section');
    assert.ok(code.includes('Trending Songs'), 'Missing Trending Songs discovery section');
    assert.ok(code.includes('Web Player'), 'Missing Web Player tab');
    assert.ok(!code.includes('madeWithLove'), 'Legacy credit text must be removed');
  });

  await test('Production dist/assets/app.css includes floating SK MUSIC styles and removes 430px drawer shift', () => {
    const css = fs.readFileSync(path.join(DIST, 'assets/app.css'), 'utf8');
    assert.ok(css.includes('.sk-music-root'), 'Missing .sk-music-root styles');
    assert.ok(css.includes('.sk-music-panel'), 'Missing .sk-music-panel styles');
    assert.ok(css.includes('.sk-mini-player'), 'Missing .sk-mini-player styles');
    assert.ok(css.includes('.sk-artist-strip'), 'Missing .sk-artist-strip styles');
    assert.ok(css.includes('.sk-mp-deck'), 'Missing .sk-mp-deck bottom playback deck styles');
    assert.ok(!css.includes('padding-right:430px'), 'Legacy 430px drawer shift must be removed');
  });

  await test('Scientific & Basic calculator expression evaluator computes accurately and rejects unsafe code', () => {
    const toolsSrc = fs.readFileSync(path.join(ROOT, 'src/js/focus-tools.js'), 'utf8');
    const sandbox = { PlatformViews: {}, StudentStore: {}, CountdownController: {}, MusicPanel: {}, showToast: () => {}, escapeHtml: (s) => s, icon: () => '' };
    vm.runInNewContext(`${toolsSrc}\nthis.__evalMath = evaluateMathExpression;`, sandbox);
    assert.equal(sandbox.__evalMath('2 + 3 * 4', true), 14);
    assert.equal(sandbox.__evalMath('sin(30)', true), 0.5);
    assert.equal(sandbox.__evalMath('sqrt(144) + 2^3', true), 20);
    assert.equal(sandbox.__evalMath('log(100)', true), 2);
    assert.throws(() => sandbox.__evalMath('process.exit(1)', true));
  });

  // Render Free Web Service Live Server Tests
  const serverProc = spawn('node', ['server/index.mjs'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    let ready = false;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await httpFetch('/health');
        if (res.status === 200) { ready = true; break; }
      } catch {}
      await new Promise((r) => setTimeout(r, 150));
    }
    assert.ok(ready, 'Render server failed to start on configured PORT');

    await test('Render server /health returns 200 OK JSON', async () => {
      const res = await httpFetch('/health');
      assert.equal(res.status, 200);
      const body = JSON.parse(res.body.toString('utf8'));
      assert.equal(body.status, 'ok');
    });

    await test('Render server serves all static assets including quiz.json and presence-config.js', async () => {
      for (const p of ['/', '/assets/app.css', '/assets/app.js', '/data/exams.json', '/data/quiz.json', '/presence-config.js', '/manifest.json', '/sw.js', '/favicon.svg']) {
        const res = await httpFetch(p);
        assert.equal(res.status, 200, `${p} returned ${res.status}`);
        assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      }
    });

    await test('Render server serves SPA fallback (200 HTML) for all existing and new productivity routes', async () => {
      const routes = [
        '/dashboard', '/planner', '/todo', '/syllabus', '/focus', '/tools',
        '/calendar', '/notes', '/quiz', '/achievements', '/resources',
        '/cards', '/readiness', '/notifications', '/report', '/privacy',
        '/categories', '/exam/neet-ug-2027', '/my-countdown', '/settings'
      ];
      for (const route of routes) {
        const res = await httpFetch(route);
        assert.equal(res.status, 200, `SPA route ${route} returned ${res.status}`);
        assert.ok(res.headers.get('content-type').includes('text/html'));
      }
    });

    await test('Live visitor presence endpoints deduplicate tabs, filter bots, and remove on leave', async () => {
      const uaHuman = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36';
      const uaBot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

      let r = await httpFetch('/api/presence/heartbeat', 'POST', { 'Content-Type': 'application/json', 'User-Agent': uaHuman }, JSON.stringify({ vid: 'v_qa_1' }));
      assert.equal(JSON.parse(r.body.toString('utf8')).count, 1);

      r = await httpFetch('/api/presence/heartbeat', 'POST', { 'Content-Type': 'application/json', 'User-Agent': uaHuman }, JSON.stringify({ vid: 'v_qa_1' }));
      assert.equal(JSON.parse(r.body.toString('utf8')).count, 1);

      r = await httpFetch('/api/presence/heartbeat', 'POST', { 'Content-Type': 'application/json', 'User-Agent': uaBot }, JSON.stringify({ vid: 'v_bot' }));
      assert.equal(JSON.parse(r.body.toString('utf8')).count, 1);

      r = await httpFetch('/api/presence/leave', 'POST', { 'Content-Type': 'application/json', 'User-Agent': uaHuman }, JSON.stringify({ vid: 'v_qa_1' }));
      assert.equal(JSON.parse(r.body.toString('utf8')).count, 0);
    });
  } finally {
    serverProc.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\nSummary: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
