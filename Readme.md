&lt;div align=&quot;center&quot;&gt;

# SK EXAMS COUNTDOWN

**Your Exam Journey, One Second Closer.**

A fast, zero-dependency, bilingual (**English & हिंदी**) Indian exam countdown portal, student productivity suite, and floating music companion — built for **Mobile, Tablet, and Desktop**, and deployable on both **Render Free Web Service** and **Cloudflare Pages**.

[Live Website](https://sk-exams-countdown-2-0.onrender.com/)
[](https://nodejs.org/)
[](#architecture)
[](#local-development--testing)
[](https://t.me/The_Sk08)

&lt;/div&gt;

---

## Live Links

- **Live Website:** [https://sk-exams-countdown-2-0.onrender.com/](https://www.google.com/search?q=https://sk-exams-countdown-2-0.onrender.com/)
- **Telegram Community:** [THE SK 08](https://t.me/The_Sk08)
- **Feedback & Bug Report Bot:** [@SK\_EXAMS\_COUNTDOWN\_bot](https://www.google.com/search?q=https://t.me/SK_EXAMS_COUNTDOWN_bot)

---

## Core Features

### 1. Verified Live Exam Countdowns (`Asia/Kolkata` IST)
- **48 Verified 2026–2027 Exams Across 12 Categories:** Medical, Engineering, National Competitive, Central Govt, Rajasthan Govt, CBSE & ICSE Boards, State Boards, Defence, University Entrance, Banking & Railway, Other State Govt, and Other Important Exams.
- **Priority National Exams:** Featured spotlight for **NEET UG 2027**, **JEE Main 2027 (Sessions 1 & 2)**, **JEE Advanced 2027**, and **UPSC CSE Prelims 2027**.
- **Real-Time 1-Second Ticking Everywhere:** Live countdowns tick every second on both full exam pages and outside summary cards.
- **Transparent Status Labels:** Clearly distinguishes `Official`, `Tentative`, `Date Awaited`, `Postponed`, and `Completed` schedules with links to official portals (`jeemain.nta.nic.in`, `neet.nta.nic.in`, `jeeadv.ac.in`, `upsc.gov.in`, `ssc.gov.in`, `cbse.gov.in`, `rpsc.rajasthan.gov.in`, `rssb.rajasthan.gov.in`, and more).
- **Custom Personal Countdowns:** Create, edit, favorite, share, and fullscreen your own personal exam or goal timers with optional last-10-second alert tones.

### 2. All-in-One Student Productivity Platform
All personal study data stays strictly in your browser (`localStorage`) — no login, no account, and no database required.

| Module | Route | What It Does |
| :--- | :--- | :--- |
| **Student Dashboard** | `/dashboard` | Unified overview of target exam, today's tasks, study streak, readiness score, and quick actions. |
| **Smart Study Planner** | `/planner` | Daily & weekly study schedule builder organized by subject and priority. |
| **To-Do Manager** | `/todo` | Actionable task list with status filters, due dates, and completion tracking. |
| **Syllabus Tracker** | `/syllabus` | Subject- and chapter-level progress tracking with visual completion percentages. |
| **Focus Timer** | `/focus` | Timestamp-accurate Pomodoro & custom focus timer with study-break prompts. |
| **Calculator & Study Tools** | `/tools` | Safe Basic & Scientific Calculator (DEG/RAD, trig, logs, powers) plus quick study utilities. |
| **IST Exam Calendar** | `/calendar` | Monthly calendar view of upcoming exam dates and personal milestones. |
| **Notes, Flashcards & Revisions** | `/notes` | Quick revision notes, spaced-repetition flashcards, and bookmarked topics. |
| **Daily Practice Quiz** | `/quiz` | Curated MCQ practice questions (`public/data/quiz.json`) with instant explanations and score tracking. |
| **Streaks & Achievements** | `/achievements` | Study streak counter and unlockable milestone badges. |
| **Exam Resources Hub** | `/resources` | Direct links to official exam portals, admit cards, and syllabus references. |
| **Shareable PNG Cards** | `/cards` | Generate and download clean countdown & progress cards as PNG images. |
| **Readiness & Exam-Day Mode** | `/readiness` | Backlog analyzer, readiness gauge, and distraction-free Exam-Day checklist. |
| **Privacy & JSON Backup** | `/privacy` | One-click full JSON export/import and local data reset controls. |
| **Feedback & Bug Reports** | `/report` | Direct issue & suggestion submission via [@SK\_EXAMS\_COUNTDOWN\_bot](https://www.google.com/search?q=https://t.me/SK_EXAMS_COUNTDOWN_bot). |

### 3. Custom Floating SK MUSIC Player
- **Floating Bottom-Right Experience:** Non-intrusive music button that expands into a compact dark-first floating panel on desktop/tablet and a responsive bottom-sheet on mobile — keeping the exam website visible behind it.
- **Persistent Playback Across Navigation:** Powered by a single shared HTML5 `<audio>` instance so music never stops or restarts when minimizing the player or switching between pages.
- **Discovery & Integrated Search:** Displays **Popular Artists**, **Trending Songs**, **Popular Music**, quick search suggestions, and live song search powered directly by `https://jiosaavn-music-player.vercel.app/api/search/songs`.
- **Dual Mode Support:** Includes both **Integrated Search** (with bottom playback deck: artwork, title, artist, previous/play-pause/next, seek bar, duration, volume/mute, and minimized mini player) and a **Web Player** tab + direct external fallback link.

### 4. Global Live Website Visitor Count
- **Real-Time Active Online Count:** Shows actual active visitors across mobile and desktop with a live status indicator — never fake or estimated numbers.
- **Zero-Database Presence Architecture:**
  - **Global Mode:** Cloudflare Workers + Durable Objects (`workers/visitor-presence/`) for shared real-time presence across all regions.
  - **Built-In Fallback:** Automatic in-memory `/api/presence/*` endpoints on Render (`server/index.mjs`).
- **Smart Accuracy:** Deduplicates multiple browser tabs from the same visitor, filters bots/crawlers, and automatically expires inactive or closed sessions via heartbeat + `pagehide` leave beacons.

### 5. Responsive UI, Bilingual Support, Mascots & PWA
- **Mobile, Tablet & Desktop First:** Centered max-width containers, symmetrical responsive grids (1/2/3/4 columns), zero horizontal overflow, touch-friendly controls, and safe-area-aware mobile bottom navigation.
- **Dark-First & Light Themes:** Glassmorphism panels, `Plus Jakarta Sans`, `Noto Sans Devanagari`, and `JetBrains Mono` typography.
- **100% Bilingual (EN / हिंदी):** Instant language switching with verified key parity across all UI labels, search (`Ctrl/Cmd + K`), and mascot messages.
- **Study-Buddy Mascots & Animated Canvas:** 4 original SVG mascots (**Chotu Owl**, **Golu Panda**, **Sparky Fox**, **Chai Buddy**) + toggleable HTML5 Canvas background (`Constellation`, `Aurora`, `Stardust`, `Waves`) with `prefers-reduced-motion` support.
- **Installable PWA:** Network-first service worker (`public/sw.js`) and web manifest (`public/manifest.json`) for fast repeat loads and offline access.

---

## Architecture

Zero external npm runtime dependencies — pure ES2022+ modular JavaScript, modular CSS, and a lightweight Node.js build & server pipeline.

```text
SK-EXAMS-COUNTDOWN-2.0/
├── package.json                      # Scripts: dev, build, start, test, validate:exams
├── render.yaml                       # Render Free Web Service Blueprint
├── .env.example                      # Environment variable template
├── README.md                         # Project documentation
├── public/
│   ├── _redirects                    # Cloudflare Pages SPA fallback
│   ├── _headers                      # Cloudflare Pages security & cache headers
│   ├── manifest.json                 # PWA Web App Manifest
│   ├── sw.js                         # Service Worker (network-first + offline cache)
│   ├── presence-config.js            # Runtime global visitor worker URL injection
│   ├── favicon.svg & og-image.svg    # Brand icons & social preview
│   └── data/
│       ├── exams.json                # 48 verified 2026–2027 Indian exam entries
│       └── quiz.json                 # Practice MCQ dataset with explanations
├── src/
│   ├── index.html                    # Semantic HTML5 shell + #sk-music-root
│   ├── styles/
│   │   ├── tokens.css                # Theme color, spacing & typography tokens
│   │   ├── base.css                  # Centered layout shell, header & mobile nav
│   │   ├── components.css            # Symmetrical grids, exam cards & forms
│   │   ├── platform.css              # Dashboard, planner, tools & quiz layouts
│   │   ├── mascot-music.css          # Mascots & ambient music visuals
│   │   └── music-player.css          # Floating SK MUSIC button, panel & mini player
│   └── js/
│       ├── i18n.js                   # English & Hindi translation dictionaries
│       ├── icons.js                  # Inline SVG icon system
│       ├── store.js & student-store.js # localStorage persistence & backup helpers
│       ├── exams.js & countdown.js   # IST countdown math & 1-second live engine
│       ├── music-service.js          # JioSaavn song search & Popular Artists derivation
│       ├── music-panel.js            # Floating SK MUSIC UI & persistent <audio> engine
│       ├── presence.js               # Live visitor heartbeat & tab deduplication
│       ├── background.js & music-visuals.js # HTML5 Canvas visualizers
│       ├── mascots.js                # Study-buddy mascot rotation & prompts
│       ├── views.js                  # Core exam, category, search & settings views
│       ├── dashboard-planner.js      # Dashboard & Smart Study Planner
│       ├── tasks-syllabus.js         # To-Do Manager & Syllabus Tracker
│       ├── focus-tools.js            # Focus Timer & Scientific Calculator
│       ├── calendar-notes.js         # IST Calendar, Notes & Flashcards
│       ├── quiz-gamification.js      # Daily Practice Quiz, Streaks & Badges
│       ├── resources-cards-report.js # Resources Hub, PNG Cards & Telegram Reports
│       └── main.js                   # SPA router & app bootstrap
├── scripts/
│   ├── build.mjs                     # Validates data, bundles CSS/JS -> dist/
│   ├── validate-exams.mjs            # Exam schema, +05:30 IST & URL validator
│   └── test-qa.mjs                   # Automated QA & live HTTP server test suite
├── server/
│   └── index.mjs                     # Zero-dependency Node.js production server (Render)
└── workers/
    └── visitor-presence/             # Optional Cloudflare Worker + Durable Object
```

---

## Local Development & Testing

**Requirements:** Node.js **18+** (no external packages needed).

```bash
# 1. Validate the exam database (schema, IST +05:30 timezone, official URLs)
npm run validate:exams

# 2. Build production assets into dist/
npm run build

# 3. Run the automated QA test suite (bundle checks, music service tests, live server routes)
npm test

# 4. Start the local production server (http://localhost:3000)
npm start
```

---

## Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `3000` | HTTP server port (set automatically by Render). |
| `NODE_ENV` | No | `production` | Runtime environment mode. |
| `PRESENCE_WORKER_URL` | Optional | `""` | Deployed Cloudflare Worker URL for global live visitor count (e.g., `https://sk-exams-presence.<subdomain>.workers.dev`). If left blank, Render uses its built-in `/api/presence/*` endpoints automatically. |

---

## Deployment Guide

### Option A: Render Free Web Service (Recommended)
Render runs `server/index.mjs` on `0.0.0.0:$PORT` with gzip compression, security headers, SPA fallback, `/health`, and `/api/presence/*`.

1. Open **Render Dashboard → New → Web Service** (or **New → Blueprint** using `render.yaml`).
2. Connect your GitHub repository and configure:
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/health`
3. *(Optional)* Add `PRESENCE_WORKER_URL` under **Environment** if you have deployed the Cloudflare presence worker.
4. Click **Deploy Web Service**.

### Option B: Cloudflare Pages (Free)
Cloudflare Pages serves the static `dist/` directory globally with `_redirects` and `_headers`.

1. Open **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
2. Select your repository and configure:
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. *(Optional)* Add `PRESENCE_WORKER_URL` in **Settings → Environment Variables** so `scripts/build.mjs` writes it into `dist/presence-config.js`.
4. Click **Save and Deploy**.

### Option C: Global Live Visitor Count Worker (Optional Free Tier)
To share live visitor counts globally across Cloudflare Pages and Render instances:

```bash
cd workers/visitor-presence
npx wrangler deploy
```

Copy the deployed `*.workers.dev` URL into `PRESENCE_WORKER_URL` in Render / Cloudflare Pages and redeploy.

---

## Updating Exam Dates & Quiz Questions

- **Exams:** Edit `public/data/exams.json` and run `npm run validate:exams` to verify IST (`+05:30`) timestamps and official URLs.
- **Daily Quiz:** Edit `public/data/quiz.json` (each item requires `id`, `subject`, `q`, 4 `options`, `answer` index `0–3`, and `explanation`).
- Commit and push to GitHub — Render and Cloudflare Pages rebuild automatically.

---

## Privacy & Data Ownership

- **Zero Database & Zero Tracking:** No user accounts, no login walls, and no personal data collection.
- **100% Local Storage:** Custom countdowns, study plans, tasks, syllabus progress, notes, quiz scores, and theme/language preferences are stored locally in your browser.
- **Full Portability:** Export or restore all your personal data anytime from `/privacy`.

---

&lt;div align=&quot;center&quot;&gt;

&lt;a href=&quot;https://t.me/The_Sk08&quot; target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;&gt;
  &lt;img src=&quot;https://img.shields.io/badge/THE%20SK%2008-Join%20on%20Telegram-229ED9?style=for-the-badge&amp;logo=telegram&amp;logoColor=white&quot; alt=&quot;THE SK 08 on Telegram&quot; /&gt;
&lt;/a&gt;

&lt;/div&gt;
