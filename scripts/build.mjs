import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateExamsFile } from './validate-exams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');
const ASSET_VERSION = '2.2.0';

function rmrf(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(srcDir, destDir) {
  mkdirp(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function bundleCss() {
  const cssOrder = ['tokens.css', 'base.css', 'components.css', 'mascot-music.css', 'platform.css', 'music-player.css'];
  const parts = cssOrder.map((file) => {
    const full = path.join(SRC, 'styles', file);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing CSS file: ${full}`);
    }
    return `/* === ${file} === */\n${fs.readFileSync(full, 'utf8')}`;
  });
  const combined = parts.join('\n\n');
  const minified = minifyCss(combined);
  mkdirp(path.join(DIST, 'assets'));
  fs.writeFileSync(path.join(DIST, 'assets', 'app.css'), minified, 'utf8');
  return { rawBytes: Buffer.byteLength(combined), minBytes: Buffer.byteLength(minified) };
}

function bundleJs() {
  const jsOrder = [
    'i18n.js',
    'icons.js',
    'store.js',
    'student-store.js',
    'exams.js',
    'background.js',
    'music-visuals.js',
    'mascots.js',
    'music-panel.js',
    'countdown.js',
    'presence.js',
    'views.js',
    'dashboard-planner.js',
    'tasks-syllabus.js',
    'focus-tools.js',
    'calendar-notes.js',
    'quiz-gamification.js',
    'resources-cards-report.js',
    'main.js'
  ];

  const chunks = [];
  for (const file of jsOrder) {
    const full = path.join(SRC, 'js', file);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing JS module: ${full}`);
    }
    let code = fs.readFileSync(full, 'utf8');
    code = code
      .replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace(/^\s*export\s+(?=(?:async\s+)?(?:function|const|let|var|class)\b)/gm, '');
    chunks.push(`// ===== ${file} =====\n${code}`);
  }

  const bundle = `/* SK EXAMS COUNTDOWN — Production Bundle v${ASSET_VERSION} */\n'use strict';\n(function () {\n${chunks.join('\n\n')}\n})();\n`;
  mkdirp(path.join(DIST, 'assets'));
  fs.writeFileSync(path.join(DIST, 'assets', 'app.js'), bundle, 'utf8');
  return { bytes: Buffer.byteLength(bundle) };
}

function buildHtml() {
  const srcHtml = path.join(SRC, 'index.html');
  let html = fs.readFileSync(srcHtml, 'utf8');
  html = html
    .replace('<!-- APP_STYLES -->', `<link rel="stylesheet" href="/assets/app.css?v=${ASSET_VERSION}" />`)
    .replace('<!-- APP_SCRIPT -->', `<script defer src="/assets/app.js?v=${ASSET_VERSION}"></script>`);
  fs.writeFileSync(path.join(DIST, 'index.html'), html, 'utf8');
}

function writePresenceConfig() {
  const workerUrl = (process.env.PRESENCE_WORKER_URL || '').trim();
  if (workerUrl) {
    const content = `window.__SK_PRESENCE_URL__ = ${JSON.stringify(workerUrl)};\n`;
    fs.writeFileSync(path.join(DIST, 'presence-config.js'), content, 'utf8');
  }
}

function runBuild() {
  const start = Date.now();
  console.log(`Building SK EXAMS COUNTDOWN (v${ASSET_VERSION})...`);

  const examStats = validateExamsFile();
  console.log(`  ✓ Exam database validated (${examStats.count} verified entries)`);

  rmrf(DIST);
  mkdirp(DIST);

  copyDir(PUBLIC_DIR, DIST);
  writePresenceConfig();
  console.log('  ✓ Public assets & Cloudflare Pages config copied to dist/');

  const cssStats = bundleCss();
  console.log(`  ✓ CSS bundled & minified (${(cssStats.minBytes / 1024).toFixed(1)} KB)`);

  const jsStats = bundleJs();
  console.log(`  ✓ JS bundled (${(jsStats.bytes / 1024).toFixed(1)} KB)`);

  buildHtml();
  console.log('  ✓ Production index.html generated');

  const elapsed = Date.now() - start;
  console.log(`\n✅ Production build succeeded in ${elapsed}ms → dist/`);
}

runBuild();
