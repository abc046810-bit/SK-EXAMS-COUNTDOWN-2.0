// Interactive Animated Background Engine with Auto-Rotating Presets & Click/Touch Ripples
const BackgroundEngine = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  rafId: null,
  particles: [],
  ripples: [],
  bursts: [],
  presets: ['constellation', 'aurora', 'stardust', 'waves'],
  activePresetIndex: 0,
  presetTimer: null,
  mouse: { x: -999, y: -999 },
  tick: 0,

  init() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.seedParticles();

    window.addEventListener('resize', () => {
      this.resize();
      this.seedParticles();
    }, { passive: true });

    window.addEventListener('pointermove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('pointerdown', (e) => {
      const s = Store.getSettings();
      if (!s.bgEnabled || s.reducedMotion) return;
      // Never interfere with interactive controls, just spawn a subtle ambient ripple behind
      this.spawnInteraction(e.clientX, e.clientY);
    }, { passive: true });

    // Auto-rotate background preset every 28 seconds when set to 'auto'
    this.presetTimer = setInterval(() => {
      if (Store.getSettings().bgPreset === 'auto') {
        this.activePresetIndex = (this.activePresetIndex + 1) % this.presets.length;
      }
    }, 28000);

    this.loop();
  },

  getCurrentPreset() {
    const pref = Store.getSettings().bgPreset || 'auto';
    if (pref !== 'auto' && this.presets.includes(pref)) return pref;
    return this.presets[this.activePresetIndex];
  },

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  seedParticles() {
    const isMobile = this.width < 768;
    const count = isMobile ? 28 : Math.min(64, Math.floor((this.width * this.height) / 22000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.36,
        vy: (Math.random() - 0.5) * 0.36,
        alpha: Math.random() * 0.45 + 0.15,
        hueShift: Math.random() * 40
      });
    }
  },

  spawnInteraction(x, y) {
    const isDark = Store.getSettings().theme !== 'light';
    const colors = isDark
      ? ['129, 140, 248', '34, 211, 238', '167, 139, 250']
      : ['79, 70, 229', '8, 145, 178', '124, 58, 237'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    this.ripples.push({
      x,
      y,
      r: 8,
      maxR: 95 + Math.random() * 55,
      alpha: 0.42,
      color
    });

    const burstCount = this.width < 768 ? 7 : 12;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.35;
      const speed = 1.1 + Math.random() * 2.2;
      this.bursts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.5 + Math.random() * 1.8,
        alpha: 0.72,
        color
      });
    }

    // Keep arrays bounded for mobile performance
    if (this.ripples.length > 10) this.ripples.shift();
    if (this.bursts.length > 80) this.bursts.splice(0, this.bursts.length - 80);
  },

  loop() {
    this.rafId = requestAnimationFrame(() => this.loop());
    const s = Store.getSettings();
    if (!this.ctx || !s.bgEnabled || s.reducedMotion || document.body.classList.contains('music-mode-active')) {
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }

    this.tick += 0.012;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const isDark = s.theme !== 'light';
    const primaryRgb = isDark ? '129, 140, 248' : '79, 70, 229';
    const secondaryRgb = isDark ? '34, 211, 238' : '8, 145, 178';
    const preset = this.getCurrentPreset();

    if (preset === 'aurora' || preset === 'waves') {
      ctx.save();
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        const yBase = this.height * (0.32 + i * 0.35);
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= this.width; x += 60) {
          const y = yBase + Math.sin(x * 0.004 + this.tick * (1.1 + i * 0.4)) * 34;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = i === 0 ? `rgba(${primaryRgb}, 0.14)` : `rgba(${secondaryRgb}, 0.12)`;
        ctx.lineWidth = preset === 'aurora' ? 42 : 2;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Floating particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      const rgb = i % 3 === 0 ? secondaryRgb : primaryRgb;
      const radius = preset === 'stardust' ? p.r * (1.1 + Math.sin(this.tick * 2 + i) * 0.35) : p.r;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.4, radius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
      ctx.fill();
    }

    // Subtle constellation links
    if (preset === 'constellation') {
      const maxDist = this.width < 768 ? 90 : 125;
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(this.particles[i].x, this.particles[i].y);
            ctx.lineTo(this.particles[j].x, this.particles[j].y);
            ctx.strokeStyle = `rgba(${primaryRgb}, ${(1 - dist / maxDist) * 0.09})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
    }

    // Interactive click/touch ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rp = this.ripples[i];
      rp.r += 2.6;
      rp.alpha *= 0.94;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rp.color}, ${rp.alpha})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      if (rp.alpha < 0.02 || rp.r > rp.maxR) this.ripples.splice(i, 1);
    }

    // Interactive particle bursts
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.96;
      b.vy *= 0.96;
      b.alpha *= 0.93;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${b.color}, ${b.alpha})`;
      ctx.fill();
      if (b.alpha < 0.03) this.bursts.splice(i, 1);
    }
  }
};
