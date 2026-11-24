// Separate Music Mode Visual Engine (Independent Animated Equalizer, Waves & Bokeh Orbs)
const MusicVisuals = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  rafId: null,
  running: false,
  tick: 0,
  paletteIdx: 0,
  paletteTimer: null,
  orbs: [],
  palettes: [
    { name: 'Neon Rose', c1: '#ec4899', c2: '#8b5cf6', c3: '#22d3ee' },
    { name: 'Ocean Pulse', c1: '#06b6d4', c2: '#3b82f6', c3: '#34d399' },
    { name: 'Sunset Groove', c1: '#f97316', c2: '#ec4899', c3: '#a855f7' }
  ],

  init() {
    this.canvas = document.getElementById('music-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  },

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.orbs = Array.from({ length: 18 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      r: 22 + Math.random() * 55,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      phase: Math.random() * Math.PI * 2
    }));
  },

  nextPalette() {
    this.paletteIdx = (this.paletteIdx + 1) % this.palettes.length;
    return this.palettes[this.paletteIdx].name;
  },

  start() {
    if (this.running) return;
    this.running = true;
    this.resize();
    this.paletteTimer = setInterval(() => this.nextPalette(), 18000);
    this.render();
  },

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.paletteTimer) clearInterval(this.paletteTimer);
    this.rafId = null;
    this.paletteTimer = null;
    if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
  },

  render() {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(() => this.render());
    if (!this.ctx || Store.getSettings().reducedMotion) return;

    this.tick += 0.025;
    const ctx = this.ctx;
    const pal = this.palettes[this.paletteIdx];
    ctx.clearRect(0, 0, this.width, this.height);

    // Floating light bokeh orbs
    for (const orb of this.orbs) {
      orb.x += orb.vx;
      orb.y += orb.vy;
      if (orb.x < -80) orb.x = this.width + 80;
      if (orb.x > this.width + 80) orb.x = -80;
      if (orb.y < -80) orb.y = this.height + 80;
      if (orb.y > this.height + 80) orb.y = -80;

      const grad = ctx.createRadialGradient(orb.x, orb.y, 4, orb.x, orb.y, orb.r);
      grad.addColorStop(0, `${pal.c1}24`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flowing color waves
    const waveColors = [pal.c1, pal.c2, pal.c3];
    waveColors.forEach((col, idx) => {
      ctx.beginPath();
      const baseY = this.height * (0.45 + idx * 0.14);
      for (let x = 0; x <= this.width; x += 28) {
        const y = baseY
          + Math.sin(x * 0.006 + this.tick * (1.2 + idx * 0.35)) * (26 + idx * 8)
          + Math.cos(x * 0.003 - this.tick * 0.8) * 14;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `${col}44`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });

    // Bottom ambient equalizer bars
    const barCount = this.width < 640 ? 22 : 42;
    const barW = Math.max(4, Math.floor((this.width - 80) / barCount) - 5);
    const startX = (this.width - barCount * (barW + 5)) / 2;
    for (let i = 0; i < barCount; i++) {
      const h = 14 + Math.abs(Math.sin(this.tick * 2.1 + i * 0.42) * Math.cos(this.tick * 0.9 + i * 0.17)) * 78;
      const x = startX + i * (barW + 5);
      const y = this.height - h - 18;
      const barGrad = ctx.createLinearGradient(x, y, x, this.height);
      barGrad.addColorStop(0, `${pal.c3}66`);
      barGrad.addColorStop(0.5, `${pal.c2}44`);
      barGrad.addColorStop(1, `${pal.c1}11`);
      ctx.fillStyle = barGrad;
      ctx.fillRect(x, y, barW, h);
    }
  }
};
