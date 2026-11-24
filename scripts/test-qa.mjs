import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateExamsFile } from './validate-exams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4185;

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

async function httpFetch(reqPath, method = 'GET', headers = {}) {
  const res = await fetch(`http://127.0.0.1:${PORT}${reqPath}`, { method, headers });
  const buf = Buffer.from(await res.arrayBuffer());
  return { status: res.status, headers: res.headers, body: buf };
}

async function main() {
  console.log('\n=== SK EXAMS COUNTDOWN 2.0 — Automated QA Suite ===\n');

  // 1. Build & Cloudflare Pages Dist Verification
  await test('Production dist/ directory contains all required Cloudflare Pages & PWA assets', () => {
    const required = [
      'index.html',
      '_redirects',
      '_headers',
      'manifest.json',
      'sw.js',
      'favicon.svg',
      'og-image.svg',
      'assets/app.css',
      'assets/app.js',
      'data/exams.json'
    ];
    for (const rel of required) {
      assert.ok(fs.existsSync(path.join(DIST, rel)), `Missing dist/${rel}`);
    }
    assert.ok(!fs.existsSync(path.join(DIST, 'server')), 'Server code must not be copied into dist/');
  });

  // 2. Exam Database Validation & Sorting Priorities
  await test('Exam database passes schema, timezone (+05:30), and official URL validation', () => {
    const res = validateExamsFile(path.join(DIST, 'data/exams.json'));
    assert.ok(res.count >= 30, `Expected >= 30 exams, got ${res.count}`);
  });

  await test('All 12 exam categories are populated and NEET UG 2027 / JEE 2027 are top priority', () => {
    const data = JSON.parse(fs.readFileSync(path.join(DIST, 'data/exams.json'), 'utf8'));
    const cats = new Set(data.exams.map((e) => e.category));
    assert.equal(cats.size, 12, `Expected 12 categories, got ${cats.size}`);

    const neet = data.exams.find((e) => e.id === 'neet-ug-2027');
    assert.ok(neet && neet.category === 'medical' && neet.manualPriority === 1 && neet.status === 'tentative');

    const jeeS1 = data.exams.find((e) => e.id === 'jee-main-2027-s1');
    const jeeAdv = data.exams.find((e) => e.id === 'jee-advanced-2027');
    assert.ok(jeeS1 && jeeS1.category === 'engineering' && jeeS1.status === 'official');
    assert.ok(jeeAdv && jeeAdv.category === 'engineering' && jeeAdv.status === 'official');

    const rbse = data.exams.find((e) => e.id === 'rbse-class-10-12-2027');
    assert.ok(rbse && rbse.status === 'postponed' && rbse.date === null);
  });

  // 3. Bilingual EN/HI Key Parity Check
  await test('English and Hindi i18n dictionaries have 100% key parity', () => {
    const i18nSrc = fs.readFileSync(path.join(ROOT, 'src/js/i18n.js'), 'utf8');
    const sandbox = {};
    vm.runInNewContext(`${i18nSrc}\nthis.__T = TRANSLATIONS;`, sandbox);
    const enKeys = Object.keys(sandbox.__T.en).sort();
    const hiKeys = Object.keys(sandbox.__T.hi).sort();
    assert.deepEqual(enKeys, hiKeys, 'Mismatch between EN and HI translation keys');
    assert.ok(enKeys.length >= 100, `Expected >= 100 bilingual keys, got ${enKeys.length}`);
  });

  // 4. Production JS Bundle Syntax & Clean Parse
  await test('Production dist/assets/app.js parses with zero syntax errors', () => {
    const code = fs.readFileSync(path.join(DIST, 'assets/app.js'), 'utf8');
    new vm.Script(code, { filename: 'dist/assets/app.js' });
  });

  // 5. Render Free Web Service Live Server Tests
  const serverProc = spawn('node', ['server/index.mjs'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    // Wait for server startup
    let ready = false;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await httpFetch('/health');
        if (res.status === 200) { ready = true; break; }
      } catch {}
      await new Promise((r) => setTimeout(r, 150));
    }
    assert.ok(ready, 'Render server failed to start on configured PORT');

    await test('Render server /health endpoint returns 200 OK JSON', async () => {
      const res = await httpFetch('/health');
      assert.equal(res.status, 200);
      const body = JSON.parse(res.body.toString('utf8'));
      assert.equal(body.status, 'ok');
      assert.equal(body.service, 'sk-exams-countdown-2');
    });

    await test('Render server serves /, CSS, JS, exams.json, manifest, sw.js with security headers', async () => {
      for (const p of ['/', '/assets/app.css', '/assets/app.js', '/data/exams.json', '/manifest.json', '/sw.js', '/favicon.svg']) {
        const res = await httpFetch(p);
        assert.equal(res.status, 200, `${p} returned ${res.status}`);
        assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
        assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
      }
    });

    await test('Render server serves SPA fallback (200 HTML) for client-side routes', async () => {
      for (const route of ['/categories', '/category/engineering', '/exam/neet-ug-2027', '/my-countdown', '/settings']) {
        const res = await httpFetch(route);
        assert.equal(res.status, 200, `SPA route ${route} returned ${res.status}`);
        assert.ok(res.headers.get('content-type').includes('text/html'));
        assert.ok(res.body.toString('utf8').includes('SK EXAMS COUNTDOWN'));
      }
    });

    await test('Render server returns 404 for missing static assets and blocks directory traversal', async () => {
      const missing = await httpFetch('/assets/nonexistent-xyz.js');
      assert.equal(missing.status, 404);
      const trav = await httpFetch('/..%2Fpackage.json');
      assert.notEqual(trav.body.toString('utf8').includes('"sk-exams-countdown-2"'), true);
      const post = await httpFetch('/', 'POST');
      assert.equal(post.status, 405);
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
