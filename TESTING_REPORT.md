# SK EXAMS COUNTDOWN 2.0 — Testing & QA Report

**Date Tested**: 24 November 2026  
**Environment**: Node.js v18.20.4, npm 9.2.0, Linux x86_64

---

## Automated Test Suite Results (`npm test`)

| # | Test Case | Result | Details |
|---|---|---|---|
| 1 | Exam database schema & IST validation (`npm run validate:exams`) | **PASS** | All entries validated with unique IDs, valid categories, HTTPS official source URLs, `YYYY-MM-DD` verification dates, and `+05:30` Asia/Kolkata offsets. |
| 2 | Production build (`npm run build`) | **PASS** | Completed cleanly in ~17ms; generated minified `dist/assets/app.css` (30.9 KB), `dist/assets/app.js` (134.8 KB), `dist/index.html`, and copied all public/Cloudflare/PWA assets. |
| 3 | Cloudflare Pages build output verification | **PASS** | Confirmed `dist/_redirects`, `dist/_headers`, `dist/manifest.json`, `dist/sw.js`, `dist/data/exams.json`, and zero server files in `dist/`. |
| 4 | Category coverage & exam priority sorting | **PASS** | All 12 categories populated; NEET UG 2027 prioritized #1 in Medical (`tentative`); JEE Main 2027 S1 & JEE Advanced 2027 prioritized in Engineering (`official`); RBSE 2027 marked `postponed`. |
| 5 | Bilingual EN/HI translation parity | **PASS** | 100% key parity verified across `TRANSLATIONS.en` and `TRANSLATIONS.hi` (100+ UI keys). |
| 6 | Production JS bundle syntax check | **PASS** | `dist/assets/app.js` parsed cleanly via Node `vm.Script` with zero syntax errors. |
| 7 | Render Free Web Service startup & `/health` | **PASS** | `node server/index.mjs` bound cleanly to `0.0.0.0:$PORT`; `GET /health` returned `200 OK` JSON. |
| 8 | Static asset serving & security headers | **PASS** | `/`, `/assets/app.css`, `/assets/app.js`, `/data/exams.json`, `/manifest.json`, `/sw.js`, `/favicon.svg` returned `200 OK` with `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN`. |
| 9 | SPA fallback routing, 404 assets & security | **PASS** | Client routes (`/categories`, `/category/engineering`, `/exam/neet-ug-2027`, `/my-countdown`, `/settings`) returned `200 OK` HTML; missing static files returned `404`; directory traversal blocked; `POST /` returned `405`. |

---

## Technical Limitations & Transparent Notes

1. **Offline Build Environment (Zero-Dependency Architecture)**: Because the build sandbox had no outbound internet access to download external npm packages (React, Vite, TypeScript, Express), the application was engineered as a clean, modular **ES2022+ Web Application** with a native Node.js production bundler (`scripts/build.mjs`) and native Node.js HTTP server (`server/index.mjs`). This ensures `npm install && npm run build`, `npm test`, and `npm start` are 100% tested and verified end-to-end while keeping the exact same Cloudflare Pages (`dist/`) and Render Free Web Service (`npm start`) deployment contract.
2. **Interactive Browser Rendering Verification**: The sandbox container's headless Chromium enforces an enterprise `URLBlocklist` policy that blocks local `http://` and `file://` navigation. All server endpoints, static bundles, syntax, i18n parity, and data integrity were verified live via Node.js automated tests; a final visual walkthrough in your local browser (`npm run dev` -> `http://localhost:3000`) is recommended before pushing live.
3. **JioSaavn Iframe & Audio Analysis**: `https://jiosaavn-music-player.vercel.app` is embedded in the Music Side Panel with a one-click fallback to open in a new tab if blocked by browser or third-party headers. Due to browser cross-origin security, Music Mode uses independent animated canvas visuals (clearly disclosed in the panel footer) rather than claiming live iframe audio-sync.
