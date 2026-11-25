// Focus Timer (Timestamp-Accurate Pomodoro) + Basic/Scientific Calculator & Study Utilities
const FocusEngine = {
  timerId: null,
  running: false,
  paused: false,
  phase: 'study', // study | break
  studyMinutes: 25,
  breakMinutes: 5,
  subject: 'General Study',
  endTimestamp: 0,
  remainingMs: 25 * 60000,

  stopTick() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },

  setPreset(studyM, breakM) {
    this.stopTick();
    this.running = false;
    this.paused = false;
    this.phase = 'study';
    this.studyMinutes = studyM;
    this.breakMinutes = breakM;
    this.remainingMs = studyM * 60000;
  },

  start(onTick, onComplete) {
    if (this.running) return;
    this.running = true;
    this.paused = false;
    this.endTimestamp = Date.now() + this.remainingMs;
    this.stopTick();

    const step = () => {
      const left = Math.max(0, this.endTimestamp - Date.now());
      this.remainingMs = left;
      onTick(left);
      if (left <= 0) {
        this.stopTick();
        this.running = false;
        onComplete();
      }
    };
    step();
    this.timerId = setInterval(step, 250);
  },

  pause() {
    if (!this.running) return;
    this.remainingMs = Math.max(0, this.endTimestamp - Date.now());
    this.running = false;
    this.paused = true;
    this.stopTick();
  },

  reset() {
    this.stopTick();
    this.running = false;
    this.paused = false;
    this.remainingMs = (this.phase === 'study' ? this.studyMinutes : this.breakMinutes) * 60000;
  },

  format(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
};

PlatformViews.focus = function (container) {
  StudentStore.recordRecentTool('/focus', 'Focus Timer');

  const draw = () => {
    const d = StudentStore.get();
    const todayMin = StudentStore.getTodayFocusMinutes();
    const weekly = StudentStore.getWeeklyFocusByDay();
    const maxM = Math.max(30, ...weekly.map((x) => x.minutes));

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Focus Timer & Pomodoro</h1>
          <p class="section-desc">Timestamp-accurate focus timer — stays exact even if you switch browser tabs.</p>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <button type="button" class="btn btn-secondary btn-sm" id="foc-music-btn">${icon('music')} Music</button>
          <button type="button" class="btn btn-secondary btn-sm" id="foc-fs-btn">${icon('expand')} Fullscreen</button>
        </div>
      </div>

      <section class="focus-display-card">
        <span class="pill-badge">${FocusEngine.phase === 'study' ? 'Focus Session' : 'Break Time'} • ${escapeHtml(FocusEngine.subject)}</span>
        <div class="focus-clock" id="foc-clock-val">${FocusEngine.format(FocusEngine.remainingMs)}</div>

        <div class="chip-row" style="justify-content:center;margin-bottom:1.1rem;">
          <button type="button" class="filter-chip ${FocusEngine.studyMinutes === 25 ? 'active' : ''}" data-preset="25|5">25 / 5</button>
          <button type="button" class="filter-chip ${FocusEngine.studyMinutes === 50 ? 'active' : ''}" data-preset="50|10">50 / 10</button>
          <button type="button" class="filter-chip ${FocusEngine.studyMinutes === 90 ? 'active' : ''}" data-preset="90|15">90 Deep Focus</button>
        </div>

        <div style="display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;margin-bottom:1.1rem;">
          ${!FocusEngine.running
            ? `<button type="button" class="btn btn-primary" id="foc-start-btn">${FocusEngine.paused ? 'Resume' : 'Start Focus'}</button>`
            : `<button type="button" class="btn btn-secondary" id="foc-pause-btn">Pause</button>`}
          <button type="button" class="btn btn-secondary" id="foc-reset-btn">Reset</button>
          <button type="button" class="btn btn-secondary" id="foc-switch-btn">Switch to ${FocusEngine.phase === 'study' ? 'Break' : 'Study'}</button>
        </div>

        <div style="display:flex;justify-content:center;gap:0.65rem;flex-wrap:wrap;align-items:center;">
          <input id="foc-subject-inp" class="input-field" style="max-width:210px;" value="${escapeHtml(FocusEngine.subject)}" placeholder="Subject name..." />
          <input id="foc-custom-min" type="number" class="input-field" style="width:95px;" min="1" max="240" value="${FocusEngine.studyMinutes}" title="Custom Study Minutes" />
          <button type="button" class="btn btn-secondary btn-sm" id="foc-apply-custom">Set Min</button>
        </div>
      </section>

      <div class="dash-grid">
        <section class="panel-card" style="margin-bottom:0;">
          <h2 class="section-title" style="font-size:1.05rem;">Today: ${todayMin} min / ${d.dailyStudyTargetMinutes} min goal</h2>
          <div class="progress-track" style="margin-top:0.6rem;"><div class="progress-fill" style="width:${Math.min(100, Math.round((todayMin / Math.max(1, d.dailyStudyTargetMinutes)) * 100))}%;"></div></div>
          <div class="mini-bar-chart">
            ${weekly.map((day) => `
              <div class="mini-bar-col" title="${day.dateStr}: ${day.minutes}m">
                <div class="mini-bar-fill" style="height:${Math.max(8, Math.round((day.minutes / maxM) * 100))}%;"></div>
                <span class="mini-bar-lbl">${day.label}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="panel-card" style="margin-bottom:0;">
          <h2 class="section-title" style="font-size:1.05rem;margin-bottom:0.75rem;">Recent Sessions (${d.focusSessions.length})</h2>
          <div class="item-list" style="max-height:210px;overflow-y:auto;">
            ${d.focusSessions.length ? d.focusSessions.slice(0, 10).map((s) => `
              <div class="list-row-card" style="padding:0.55rem 0.75rem;">
                <div><div class="row-title" style="font-size:0.86rem;">${escapeHtml(s.subject)}</div><div class="row-meta">${escapeHtml(s.dateStr)}</div></div>
                <span class="status-badge status-official">${s.minutes} min</span>
              </div>
            `).join('') : '<p class="row-meta">Complete a focus session to log your study history.</p>'}
          </div>
        </section>
      </div>
    `;

    const bindRunningTick = () => {
      FocusEngine.start(
        (left) => {
          const el = document.getElementById('foc-clock-val');
          if (el) el.textContent = FocusEngine.format(left);
        },
        () => {
          if (FocusEngine.phase === 'study') {
            d.focusSessions.unshift({
              id: `foc_${Date.now()}`,
              subject: FocusEngine.subject || 'Study',
              minutes: FocusEngine.studyMinutes,
              dateStr: getISTDateString(),
              completedAt: new Date().toISOString()
            });
            d.focusSessions = d.focusSessions.slice(0, 120);
            StudentStore.recordStudyActivity();
            StudentStore.addNotification('Focus Session Completed', `${FocusEngine.studyMinutes} min of ${FocusEngine.subject} logged!`, 'focus');
            StudentStore.save();
            CountdownController.playBeep();
            if ('Notification' in window && Notification.permission === 'granted') {
              try { new Notification('SK EXAMS COUNTDOWN', { body: `Focus complete: ${FocusEngine.studyMinutes} min (${FocusEngine.subject})` }); } catch {}
            }
            FocusEngine.phase = 'break';
            FocusEngine.remainingMs = FocusEngine.breakMinutes * 60000;
            showToast('Focus complete! Break timer ready.');
          } else {
            CountdownController.playBeep();
            FocusEngine.phase = 'study';
            FocusEngine.remainingMs = FocusEngine.studyMinutes * 60000;
            showToast('Break finished! Ready for next study session.');
          }
          draw();
        }
      );
    };

    if (FocusEngine.running) bindRunningTick();

    container.querySelector('#foc-start-btn')?.addEventListener('click', () => {
      FocusEngine.subject = container.querySelector('#foc-subject-inp')?.value.trim() || 'General Study';
      bindRunningTick();
      draw();
    });
    container.querySelector('#foc-pause-btn')?.addEventListener('click', () => { FocusEngine.pause(); draw(); });
    container.querySelector('#foc-reset-btn')?.addEventListener('click', () => { FocusEngine.reset(); draw(); });
    container.querySelector('#foc-switch-btn')?.addEventListener('click', () => {
      FocusEngine.phase = FocusEngine.phase === 'study' ? 'break' : 'study';
      FocusEngine.reset();
      draw();
    });
    container.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => {
      const [sm, bm] = b.getAttribute('data-preset').split('|').map(Number);
      FocusEngine.setPreset(sm, bm);
      draw();
    }));
    container.querySelector('#foc-apply-custom')?.addEventListener('click', () => {
      const m = Math.max(1, Math.min(240, Number(container.querySelector('#foc-custom-min').value) || 25));
      FocusEngine.setPreset(m, Math.max(5, Math.round(m / 5)));
      draw();
    });
    container.querySelector('#foc-music-btn')?.addEventListener('click', () => MusicPanel.open());
    container.querySelector('#foc-fs-btn')?.addEventListener('click', () => CountdownController.toggleFullscreen());
  };

  draw();
};

// Safe Math Expression Evaluator (no raw eval on arbitrary identifiers)
function evaluateMathExpression(expr, degMode = true) {
  let clean = String(expr || '').trim().replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
  if (!clean) return 0;
  const toRad = (x) => (degMode ? (x * Math.PI) / 180 : x);
  const scope = {
    sin: (x) => Math.sin(toRad(x)),
    cos: (x) => Math.cos(toRad(x)),
    tan: (x) => Math.tan(toRad(x)),
    log: (x) => Math.log10(x),
    ln: (x) => Math.log(x),
    sqrt: (x) => Math.sqrt(x),
    exp: (x) => Math.exp(x),
    abs: (x) => Math.abs(x),
    PI: Math.PI,
    E: Math.E
  };
  // Whitelist strictly numbers, operators, parentheses, commas, whitespace, and allowed math function names
  const stripped = clean.replace(/\b(sin|cos|tan|log|ln|sqrt|exp|abs|PI|E)\b/g, '');
  if (/[^0-9+\-*/().,%\s]/.test(stripped)) {
    throw new Error('Invalid characters');
  }
  const fn = new Function(...Object.keys(scope), `"use strict"; return (${clean});`);
  const val = fn(...Object.values(scope));
  if (typeof val !== 'number' || !Number.isFinite(val)) throw new Error('Math Error');
  return Number(val.toPrecision(12));
}

PlatformViews.tools = function (container) {
  StudentStore.recordRecentTool('/tools', 'Calculator & Tools');
  let activeTab = 'calc'; // calc | stopwatch | converters | study-math
  let sciMode = false;
  let degMode = true;
  let expr = '';
  let lastRes = '0';
  let history = [];

  // Stopwatch state
  let swRunning = false;
  let swStart = 0;
  let swElapsed = 0;
  let swLaps = [];
  let swTimer = null;

  const stopSw = () => { if (swTimer) { clearInterval(swTimer); swTimer = null; } };

  const formatSw = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const draw = () => {
    stopSw();
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Calculator & Study Utilities</h1>
          <p class="section-desc">Basic & scientific calculators, stopwatch, unit converter, and exam score utilities.</p>
        </div>
      </div>

      <div class="tab-bar">
        <button type="button" class="tab-btn ${activeTab === 'calc' ? 'active' : ''}" data-t-tab="calc">Calculator</button>
        <button type="button" class="tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}" data-t-tab="stopwatch">Stopwatch & Timer</button>
        <button type="button" class="tab-btn ${activeTab === 'converters' ? 'active' : ''}" data-t-tab="converters">Unit Converter</button>
        <button type="button" class="tab-btn ${activeTab === 'study-math' ? 'active' : ''}" data-t-tab="study-math">Marks, Date & Study Math</button>
      </div>

      ${activeTab === 'calc' ? `
        <div class="dash-grid">
          <div class="calc-shell">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.65rem;">
              <div class="chip-row">
                <button type="button" class="filter-chip ${!sciMode ? 'active' : ''}" id="calc-basic-btn">Basic</button>
                <button type="button" class="filter-chip ${sciMode ? 'active' : ''}" id="calc-sci-btn">Scientific</button>
              </div>
              <div style="display:flex;gap:0.35rem;">
                ${sciMode ? `<button type="button" class="filter-chip active" id="calc-deg-btn">${degMode ? 'DEG' : 'RAD'}</button>` : ''}
                <button type="button" class="filter-chip" id="calc-copy-btn">Copy</button>
              </div>
            </div>
            <div class="calc-screen">
              <div class="calc-expr" id="calc-expr-disp">${escapeHtml(expr || '0')}</div>
              <div class="calc-result" id="calc-res-disp">${escapeHtml(lastRes)}</div>
            </div>
            ${sciMode ? `
              <div class="calc-grid-sci">
                ${['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt(', 'exp(', 'PI', 'E', '^'].map((k) => `<button type="button" class="calc-key op" data-ck="${k}">${k}</button>`).join('')}
              </div>
            ` : ''}
            <div class="calc-grid">
              <button type="button" class="calc-key op" data-ck="C">C</button>
              <button type="button" class="calc-key op" data-ck="(">(</button>
              <button type="button" class="calc-key op" data-ck=")">)</button>
              <button type="button" class="calc-key op" data-ck="BS">⌫</button>
              <button type="button" class="calc-key" data-ck="7">7</button>
              <button type="button" class="calc-key" data-ck="8">8</button>
              <button type="button" class="calc-key" data-ck="9">9</button>
              <button type="button" class="calc-key op" data-ck="/">÷</button>
              <button type="button" class="calc-key" data-ck="4">4</button>
              <button type="button" class="calc-key" data-ck="5">5</button>
              <button type="button" class="calc-key" data-ck="6">6</button>
              <button type="button" class="calc-key op" data-ck="*">×</button>
              <button type="button" class="calc-key" data-ck="1">1</button>
              <button type="button" class="calc-key" data-ck="2">2</button>
              <button type="button" class="calc-key" data-ck="3">3</button>
              <button type="button" class="calc-key op" data-ck="-">−</button>
              <button type="button" class="calc-key" data-ck="0">0</button>
              <button type="button" class="calc-key" data-ck=".">.</button>
              <button type="button" class="calc-key op" data-ck="%">%</button>
              <button type="button" class="calc-key op" data-ck="+">+</button>
              <button type="button" class="calc-key op" data-ck="SQ">x²</button>
              <button type="button" class="calc-key op" data-ck="CB">x³</button>
              <button type="button" class="calc-key op" data-ck="sqrt(">√</button>
              <button type="button" class="calc-key eq" data-ck="=">=</button>
            </div>
          </div>

          <section class="panel-card" style="margin-bottom:0;">
            <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">Calculation History</h2>
            <div class="item-list">
              ${history.length ? history.map((h) => `<div class="list-row-card" style="padding:0.55rem 0.75rem;"><span>${escapeHtml(h.expr)}</span><strong>= ${escapeHtml(h.res)}</strong></div>`).join('') : '<p class="row-meta">Calculations appear here.</p>'}
            </div>
          </section>
        </div>
      ` : ''}

      ${activeTab === 'stopwatch' ? `
        <section class="panel-card" style="text-align:center;">
          <h2 class="section-title" style="font-size:1.1rem;">Precision Stopwatch</h2>
          <div class="focus-clock" id="sw-disp">${formatSw(swElapsed)}</div>
          <div style="display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;margin-bottom:1rem;">
            <button type="button" class="btn btn-primary" id="sw-toggle-btn">${swRunning ? 'Pause' : 'Start'}</button>
            <button type="button" class="btn btn-secondary" id="sw-lap-btn">Lap</button>
            <button type="button" class="btn btn-secondary" id="sw-reset-btn">Reset</button>
          </div>
          ${swLaps.length ? `<div class="item-list" style="max-width:360px;margin:0 auto;">${swLaps.map((l, i) => `<div class="list-row-card" style="padding:0.45rem 0.75rem;"><span>Lap ${swLaps.length - i}</span><strong>${l}</strong></div>`).join('')}</div>` : ''}
        </section>
      ` : ''}

      ${activeTab === 'converters' ? `
        <section class="panel-card">
          <h2 class="section-title" style="font-size:1.05rem;margin-bottom:0.85rem;">Unit Converter</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0.75rem;align-items:end;">
            <div>
              <label class="form-label">Category</label>
              <select id="uc-cat" class="input-field" style="width:100%;">
                <option value="length">Length (m / km / cm / ft / mi)</option>
                <option value="mass">Mass (kg / g / lb)</option>
                <option value="temp">Temperature (°C / °F / K)</option>
                <option value="time">Time (sec / min / hr / day)</option>
                <option value="data">Data (KB / MB / GB)</option>
              </select>
            </div>
            <div><label class="form-label">Value</label><input type="number" id="uc-val" class="input-field" style="width:100%;" value="1" /></div>
            <div><label class="form-label">From</label><select id="uc-from" class="input-field" style="width:100%;"></select></div>
            <div><label class="form-label">To</label><select id="uc-to" class="input-field" style="width:100%;"></select></div>
            <button type="button" class="btn btn-primary" id="uc-go">Convert</button>
          </div>
          <div id="uc-out" style="margin-top:1rem;font-family:var(--font-mono);font-size:1.25rem;font-weight:800;color:var(--accent-light);">—</div>
        </section>
      ` : ''}

      ${activeTab === 'study-math' ? `
        <div class="dash-grid">
          <section class="panel-card" style="margin-bottom:0;">
            <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">Marks Percentage & Target Marks</h2>
            <div style="display:grid;gap:0.6rem;">
              <input type="number" id="sm-obt" class="input-field" placeholder="Marks Obtained (e.g. 615)" />
              <input type="number" id="sm-tot" class="input-field" placeholder="Total Marks (e.g. 720)" />
              <input type="number" id="sm-tgt" class="input-field" placeholder="Target % (e.g. 90)" />
              <button type="button" class="btn btn-primary btn-sm" id="sm-calc-btn">Calculate</button>
              <div id="sm-out" class="row-meta" style="font-weight:700;color:var(--accent-light);"></div>
            </div>
          </section>

          <section class="panel-card" style="margin-bottom:0;">
            <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">Date Difference & Days Remaining</h2>
            <div style="display:grid;gap:0.6rem;">
              <input type="date" id="dd-start" class="input-field" value="${getISTDateString()}" />
              <input type="date" id="dd-end" class="input-field" value="${addDaysIST(getISTDateString(), 30)}" />
              <button type="button" class="btn btn-primary btn-sm" id="dd-calc-btn">Calculate Days</button>
              <div id="dd-out" class="row-meta" style="font-weight:700;color:var(--accent-light);"></div>
            </div>
          </section>

          <section class="panel-card" style="margin-bottom:0;">
            <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">Study Time & Average Calculator</h2>
            <div style="display:grid;gap:0.6rem;">
              <input type="text" id="avg-inp" class="input-field" placeholder="Comma-separated numbers (e.g. 85, 92, 78, 88)" />
              <button type="button" class="btn btn-primary btn-sm" id="avg-calc-btn">Compute Average & Sum</button>
              <div id="avg-out" class="row-meta" style="font-weight:700;color:var(--accent-light);"></div>
            </div>
          </section>
        </div>
      ` : ''}
    `;

    container.querySelectorAll('[data-t-tab]').forEach((b) => b.addEventListener('click', () => {
      activeTab = b.getAttribute('data-t-tab');
      draw();
    }));

    if (activeTab === 'calc') {
      container.querySelector('#calc-basic-btn')?.addEventListener('click', () => { sciMode = false; draw(); });
      container.querySelector('#calc-sci-btn')?.addEventListener('click', () => { sciMode = true; draw(); });
      container.querySelector('#calc-deg-btn')?.addEventListener('click', () => { degMode = !degMode; draw(); });
      container.querySelector('#calc-copy-btn')?.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(String(lastRes)); showToast('Result copied!'); } catch {}
      });
      container.querySelectorAll('[data-ck]').forEach((btn) => btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-ck');
        if (k === 'C') { expr = ''; lastRes = '0'; }
        else if (k === 'BS') { expr = expr.slice(0, -1); }
        else if (k === 'SQ') { expr = `(${expr || lastRes})^2`; }
        else if (k === 'CB') { expr = `(${expr || lastRes})^3`; }
        else if (k === '=') {
          try {
            const val = evaluateMathExpression(expr, degMode);
            history.unshift({ expr, res: String(val) });
            history = history.slice(0, 12);
            lastRes = String(val);
            expr = String(val);
          } catch {
            lastRes = 'Error';
          }
        } else {
          expr += k;
        }
        draw();
      }));
    }

    if (activeTab === 'stopwatch') {
      const startTick = () => {
        swTimer = setInterval(() => {
          const cur = swElapsed + (Date.now() - swStart);
          const el = document.getElementById('sw-disp');
          if (el) el.textContent = formatSw(cur);
        }, 50);
      };
      if (swRunning) startTick();
      container.querySelector('#sw-toggle-btn')?.addEventListener('click', () => {
        if (!swRunning) { swRunning = true; swStart = Date.now(); startTick(); }
        else { swElapsed += Date.now() - swStart; swRunning = false; stopSw(); }
        draw();
      });
      container.querySelector('#sw-lap-btn')?.addEventListener('click', () => {
        const cur = swRunning ? swElapsed + (Date.now() - swStart) : swElapsed;
        swLaps.unshift(formatSw(cur));
        draw();
      });
      container.querySelector('#sw-reset-btn')?.addEventListener('click', () => {
        swRunning = false; swElapsed = 0; swLaps = []; stopSw(); draw();
      });
    }

    if (activeTab === 'converters') {
      const units = {
        length: { m: 1, km: 1000, cm: 0.01, ft: 0.3048, mi: 1609.344 },
        mass: { kg: 1, g: 0.001, lb: 0.45359237 },
        temp: { C: 1, F: 1, K: 1 },
        time: { sec: 1, min: 60, hr: 3600, day: 86400 },
        data: { KB: 1, MB: 1024, GB: 1048576 }
      };
      const catSel = container.querySelector('#uc-cat');
      const fromSel = container.querySelector('#uc-from');
      const toSel = container.querySelector('#uc-to');
      const fillUnits = () => {
        const keys = Object.keys(units[catSel.value]);
        fromSel.innerHTML = keys.map((k) => `<option value="${k}">${k}</option>`).join('');
        toSel.innerHTML = keys.map((k, i) => `<option value="${k}" ${i === 1 ? 'selected' : ''}>${k}</option>`).join('');
      };
      fillUnits();
      catSel.addEventListener('change', fillUnits);
      container.querySelector('#uc-go')?.addEventListener('click', () => {
        const cat = catSel.value;
        const val = Number(container.querySelector('#uc-val').value);
        const f = fromSel.value;
        const tUnit = toSel.value;
        let out = 0;
        if (cat === 'temp') {
          let c = f === 'C' ? val : f === 'F' ? (val - 32) * (5 / 9) : val - 273.15;
          out = tUnit === 'C' ? c : tUnit === 'F' ? c * (9 / 5) + 32 : c + 273.15;
        } else {
          out = (val * units[cat][f]) / units[cat][tUnit];
        }
        container.querySelector('#uc-out').textContent = `${val} ${f} = ${Number(out.toPrecision(8))} ${tUnit}`;
      });
    }

    if (activeTab === 'study-math') {
      container.querySelector('#sm-calc-btn')?.addEventListener('click', () => {
        const obt = Number(container.querySelector('#sm-obt').value);
        const tot = Number(container.querySelector('#sm-tot').value);
        const tgt = Number(container.querySelector('#sm-tgt').value);
        if (!tot || tot <= 0) return;
        const pct = ((obt / tot) * 100).toFixed(2);
        const needed = tgt ? Math.ceil((tgt / 100) * tot) : null;
        container.querySelector('#sm-out').textContent = `Score: ${pct}%` + (needed !== null ? ` • Marks needed for ${tgt}%: ${needed}/${tot}` : '');
      });
      container.querySelector('#dd-calc-btn')?.addEventListener('click', () => {
        const s = Date.parse(`${container.querySelector('#dd-start').value}T00:00:00+05:30`);
        const e = Date.parse(`${container.querySelector('#dd-end').value}T00:00:00+05:30`);
        if (Number.isNaN(s) || Number.isNaN(e)) return;
        const diffDays = Math.round((e - s) / 86400000);
        container.querySelector('#dd-out').textContent = `${diffDays} days (${(diffDays * 24)} hours)`;
      });
      container.querySelector('#avg-calc-btn')?.addEventListener('click', () => {
        const nums = container.querySelector('#avg-inp').value.split(',').map((x) => Number(x.trim())).filter((n) => !Number.isNaN(n));
        if (!nums.length) return;
        const sum = nums.reduce((a, b) => a + b, 0);
        container.querySelector('#avg-out').textContent = `Count: ${nums.length} • Sum: ${sum.toFixed(2)} • Average: ${(sum / nums.length).toFixed(2)}`;
      });
    }
  };

  draw();
};
