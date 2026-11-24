# SK EXAMS COUNTDOWN 2.0

**Your Exam Journey, One Second Closer.**

A complete, production-ready redesign of **SK EXAMS COUNTDOWN** built from scratch as a modular, bilingual (English & हिंदी), zero-dependency web application that deploys identically to **Cloudflare Pages (Free)** and **Render Free Web Service** from the exact same codebase.

---

## Key Features

- **Premium Dark-First & Crisp Light Mode UI**: Glassmorphism cards, refined typography (`Plus Jakarta Sans`, `Noto Sans Devanagari`, `JetBrains Mono`), responsive desktop navigation + mobile bottom navigation bar.
- **Interactive Animated Background**: HTML5 Canvas engine with 4 auto-rotating presets (`Constellation`, `Aurora`, `Stardust`, `Waves`), interactive click/touch light ripples and particle bursts, toggleable in Settings, with mobile optimization and `prefers-reduced-motion` support.
- **12 Structured Exam Categories**: Medical, Engineering, National Competitive, Central Govt, Rajasthan Govt, CBSE & ICSE Boards, State Boards, Defence, University Entrance, Banking & Railway, Other State Govt, and Other Important Exams — with **NEET UG 2027**, **JEE Main 2027 (Sessions 1 & 2)**, and **JEE Advanced 2027** prioritized prominently.
- **Verified Official 2026–2027 Exam Database (`public/data/exams.json`)**:
  - Audited against official portals (`jeemain.nta.nic.in`, `neet.nta.nic.in`, `jeeadv.ac.in`, `upsc.gov.in`, `ssc.gov.in`, `cbse.gov.in`, `cisce.org`, `rajeduboard.rajasthan.gov.in`, `rpsc.rajasthan.gov.in`, `rssb.rajasthan.gov.in`, `gate2027.iitm.ac.in`, `iimcat.ac.in`, `consortiumofnlus.ac.in`, `nationallawuniversitydelhi.in`, `afcat.cdac.in`, `upmsp.edu.in`, `mahahsscboard.in`, `ibps.in`, `rrbcdg.gov.in`).
  - Uses `Asia/Kolkata` (`+05:30`) timezone throughout.
  - Explicitly labels `Official`, `Tentative`, `Date Awaited`, `Postponed` (e.g., RBSE 2027 deferred due to Census enumeration), and `Completed` states without ever presenting unannounced dates as confirmed.
  - Easy to update without touching UI code: edit `public/data/exams.json` and run `npm run validate:exams`.
- **Original Study-Buddy Mascot System**: 4 original SVG cartoon characters (**Chotu Owl**, **Golu Panda**, **Sparky Fox**, **Chai Buddy**) with rotating expressions and 24 natural English & Hindi funny message boards.
- **Smart Study-Break Prompt & Distinct Music Mode**:
  - Interactive `"Yes, Play Music"` / `"No, Keep Studying"` prompt with configurable cooldown.
  - Opens a desktop split-screen side drawer (or mobile full-width drawer) loading `https://jiosaavn-music-player.vercel.app`, with a clean one-click fallback to open in a new tab if embedding is restricted.
  - Activates a separate animated Music Mode visual canvas (flowing waves, bokeh orbs, ambient equalizer bars, auto-rotating palettes).
- **Personal Countdowns, Favourites, Search & PWA**:
  - Instant bilingual search modal (`Ctrl/Cmd + K`) with recent searches and keyboard navigation.
  - Create, edit, and delete personal custom countdowns (auto-migrates saved timers from v1).
  - Save favourites, copy/share countdown links, browser reminders, last-10-seconds alert tone, fullscreen mode, and offline PWA support (`manifest.json` + `sw.js`).

---

## Project Structure

```text
sk-exams-countdown-2.0/
├── package.json              # Scripts: dev, build, start, test, validate:exams
├── package-lock.json         # Lockfile (zero external dependencies)
├── render.yaml               # Render Free Web Service Blueprint
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
├── README.md                 # Documentation & deployment guide
├── TESTING_REPORT.md         # Automated QA verification report
├── public/
│   ├── _redirects            # Cloudflare Pages SPA fallback
│   ├── _headers              # Cloudflare Pages security & cache headers
│   ├── manifest.json         # PWA Web App Manifest
│   ├── sw.js                 # Service Worker (offline caching)
│   ├── favicon.svg           # Brand SVG icon
│   ├── og-image.svg          # Open Graph preview image
│   └── data/
│       └── exams.json        # Verified 2026–2027 exam database
├── scripts/
│   ├── build.mjs             # Production bundler -> dist/
│   ├── validate-exams.mjs    # Schema & timezone validator
│   └── test-qa.mjs           # Automated QA test suite
├── server/
│   └── index.mjs             # Production Node.js HTTP server for Render
└── src/
    ├── index.html            # Semantic HTML5 shell
    ├── styles/               # Modular CSS (tokens, base, components, mascot-music)
    └── js/                   # Modular ES2022+ app modules
```

---

## Local Development & Testing

Requirements: **Node.js 18+** (no external `npm` packages required).

```bash
# 1. Validate the exam database
npm run validate:exams

# 2. Build production output into dist/
npm run build

# 3. Run automated QA test suite
npm test

# 4. Start local production server (http://localhost:3000)
npm start
```

---

## Deployment Guide

### Option A: Cloudflare Pages (Free)

Cloudflare Pages builds and serves the static `dist/` folder directly and does not execute `server/index.mjs`.

1. Push this project to a **new** GitHub repository (do not overwrite your old repository).
2. Open **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Select your new repository and configure:
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.
   - SPA routing (`_redirects`), security headers (`_headers`), and PWA caching (`sw.js`) are automatically deployed inside `dist/`.

### Option B: Render Free Web Service

Render runs the included lightweight Node.js production server (`server/index.mjs`) listening on `0.0.0.0` and `process.env.PORT`.

1. Push this project to a **new** GitHub repository.
2. Open **Render Dashboard → New → Web Service** (or **New → Blueprint** to auto-import `render.yaml`).
3. Connect your repository and configure:
   - **Runtime**: `Node`
   - **Plan**: `Free`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. Click **Create Web Service**.

---

## GitHub Upload Workflow (Keeping Original Repo Safe)

Your original `SK-EXAMS-COUNTDOWN` repository remains completely untouched. To publish v2.0 safely:

```bash
# 1. Unzip sk-exams-countdown-2.0.zip and enter the folder
cd sk-exams-countdown-2.0

# 2. Initialize a brand-new Git repository
git init
git branch -M main
git add .
git commit -m "Initial release: SK EXAMS COUNTDOWN 2.0"

# 3. Create a NEW empty repository on GitHub (e.g. SK-EXAMS-COUNTDOWN-2.0)
# 4. Link and push
git remote add origin https://github.com/<your-username>/SK-EXAMS-COUNTDOWN-2.0.git
git push -u origin main
```

---

## Updating Exam Dates

1. Edit `public/data/exams.json` (update `date`, `endDate`, `status`, `statusNote`, `officialSourceUrl`, `lastVerified`, and root `lastUpdated`).
2. Run `npm run validate:exams` to confirm schema & `+05:30` IST timezone formatting.
3. Commit and push to GitHub — both Cloudflare Pages and Render will automatically rebuild and redeploy.

---

**SK EXAMS COUNTDOWN 2.0** — Made with ❤️ by [@The_Sk08](https://t.me/The_Sk08)
