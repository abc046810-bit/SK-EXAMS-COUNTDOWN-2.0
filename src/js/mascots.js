// Original Cartoon Study-Buddy Mascots (100% Original Geometric SVG Art) + Bilingual Funny Message Boards
const MASCOT_MESSAGES = {
  en: [
    'Bored of studying? Take a tiny break!',
    'Your brain deserves a quick recharge!',
    'One good song, then straight back to NCERT!',
    'Don’t panic. You’ve got this, champion!',
    'Study mode: ON. Stress mode: OFF.',
    'Drink some water and stretch your shoulders!',
    'Even toppers take 5-minute music breaks.',
    'Plot twist: That tough chapter will click today!',
    'Close the 14 open tabs and focus on one topic.',
    'Your future self is already thanking you!',
    'Coffee or chai first, then conquer the syllabus.',
    'Tiny daily progress beats last-night panic.'
  ],
  hi: [
    'पढ़ाई से बोर हो गए? थोड़ा ब्रेक ले लो!',
    'दिमाग को भी थोड़ा आराम चाहिए!',
    'एक बढ़िया गाना सुन लो, फिर पढ़ाई शुरू!',
    'टेंशन छोड़ो, तैयारी जारी रखो!',
    'थोड़ा मुस्कुराओ, फिर पढ़ने बैठो!',
    'पानी पियो और दो मिनट स्ट्रेच कर लो!',
    'टॉपर भी 5 मिनट का म्यूज़िक ब्रेक लेते हैं!',
    'आज जो कठिन लग रहा है, कल वही सबसे आसान होगा!',
    'एक-एक अध्याय पूरा करो, मंज़िल करीब है!',
    'चाय की चुस्की लो और रिवीज़न शुरू करो!',
    'रोज़ की थोड़ी मेहनत ही बड़ा परिणाम लाती है!',
    'खुद पर भरोसा रखो — इस बार सिलेक्शन पक्का है!'
  ]
};

const MASCOT_CHARACTERS = [
  {
    id: 'chotu-owl',
    nameEn: 'Chotu Owl',
    nameHi: 'छोटू उल्लू',
    render(expr) {
      const eyeSvg = expr === 'wink'
        ? '<circle cx="62" cy="72" r="7" fill="#0f172a"/><path d="M90 72 Q98 66 106 72" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none"/>'
        : expr === 'happy'
        ? '<path d="M54 73 Q62 64 70 73" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M90 73 Q98 64 106 73" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none"/>'
        : '<circle cx="62" cy="72" r="7" fill="#0f172a"/><circle cx="98" cy="72" r="7" fill="#0f172a"/><circle cx="64" cy="70" r="2.2" fill="#fff"/><circle cx="100" cy="70" r="2.2" fill="#fff"/>';
      return `
        <svg viewBox="0 0 160 160" width="152" height="152" role="img" aria-label="Chotu Owl mascot">
          <ellipse cx="80" cy="146" rx="44" ry="8" fill="rgba(99,102,241,0.22)"/>
          <path d="M44 52 L56 26 L72 44 Z" fill="#6366f1"/>
          <path d="M116 52 L104 26 L88 44 Z" fill="#6366f1"/>
          <ellipse cx="80" cy="88" rx="46" ry="50" fill="#6366f1"/>
          <ellipse cx="80" cy="102" rx="30" ry="30" fill="#e0e7ff"/>
          <circle cx="62" cy="72" r="17" fill="#ffffff"/>
          <circle cx="98" cy="72" r="17" fill="#ffffff"/>
          ${eyeSvg}
          <polygon points="80,79 73,90 87,90" fill="#f59e0b"/>
          <ellipse cx="34" cy="96" rx="11" ry="22" transform="rotate(14 34 96)" fill="#4f46e5"/>
          <ellipse cx="126" cy="96" rx="11" ry="22" transform="rotate(-14 126 96)" fill="#4f46e5"/>
          <rect x="64" y="132" width="12" height="8" rx="4" fill="#f59e0b"/>
          <rect x="84" y="132" width="12" height="8" rx="4" fill="#f59e0b"/>
        </svg>`;
    }
  },
  {
    id: 'golu-panda',
    nameEn: 'Golu Panda',
    nameHi: 'गोलू पांडा',
    render(expr) {
      const mouth = expr === 'happy'
        ? '<path d="M70 92 Q80 104 90 92" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
        : '<path d="M73 94 Q80 100 87 94" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
      return `
        <svg viewBox="0 0 160 160" width="152" height="152" role="img" aria-label="Golu Panda mascot">
          <ellipse cx="80" cy="146" rx="44" ry="8" fill="rgba(34,211,238,0.2)"/>
          <circle cx="46" cy="44" r="16" fill="#1e293b"/>
          <circle cx="114" cy="44" r="16" fill="#1e293b"/>
          <ellipse cx="80" cy="112" rx="38" ry="30" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
          <ellipse cx="80" cy="76" rx="44" ry="38" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
          <ellipse cx="62" cy="74" rx="12" ry="15" transform="rotate(-12 62 74)" fill="#1e293b"/>
          <ellipse cx="98" cy="74" rx="12" ry="15" transform="rotate(12 98 74)" fill="#1e293b"/>
          <circle cx="63" cy="72" r="4" fill="#ffffff"/>
          <circle cx="97" cy="72" r="4" fill="#ffffff"/>
          <ellipse cx="52" cy="86" rx="6" ry="3.5" fill="#fda4af" opacity="0.7"/>
          <ellipse cx="108" cy="86" rx="6" ry="3.5" fill="#fda4af" opacity="0.7"/>
          <ellipse cx="80" cy="84" rx="6" ry="4.5" fill="#0f172a"/>
          ${mouth}
          <ellipse cx="44" cy="114" rx="12" ry="18" transform="rotate(24 44 114)" fill="#1e293b"/>
          <ellipse cx="116" cy="114" rx="12" ry="18" transform="rotate(-24 116 114)" fill="#1e293b"/>
        </svg>`;
    }
  },
  {
    id: 'sparky-fox',
    nameEn: 'Sparky Fox',
    nameHi: 'स्पार्की लोमड़ी',
    render(expr) {
      const eyes = expr === 'wink'
        ? '<circle cx="63" cy="78" r="5.5" fill="#0f172a"/><path d="M91 78 Q97 72 103 78" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
        : '<circle cx="63" cy="78" r="5.5" fill="#0f172a"/><circle cx="97" cy="78" r="5.5" fill="#0f172a"/><circle cx="65" cy="76" r="2" fill="#fff"/><circle cx="99" cy="76" r="2" fill="#fff"/>';
      return `
        <svg viewBox="0 0 160 160" width="152" height="152" role="img" aria-label="Sparky Fox mascot">
          <ellipse cx="80" cy="146" rx="44" ry="8" fill="rgba(249,115,22,0.22)"/>
          <polygon points="40,68 46,24 72,50" fill="#f97316"/>
          <polygon points="120,68 114,24 88,50" fill="#f97316"/>
          <polygon points="48,58 51,34 65,49" fill="#fed7aa"/>
          <polygon points="112,58 109,34 95,49" fill="#fed7aa"/>
          <ellipse cx="80" cy="114" rx="34" ry="26" fill="#ea580c"/>
          <ellipse cx="80" cy="118" rx="18" ry="18" fill="#fff7ed"/>
          <ellipse cx="80" cy="78" rx="44" ry="35" fill="#f97316"/>
          <path d="M40 84 Q60 98 80 108 Q100 98 120 84 Q102 74 80 86 Q58 74 40 84 Z" fill="#fff7ed"/>
          ${eyes}
          <polygon points="80,90 74,84 86,84" fill="#0f172a"/>
          <path d="M72 95 Q80 102 88 95" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`;
    }
  },
  {
    id: 'chai-buddy',
    nameEn: 'Chai Buddy',
    nameHi: 'चाय बडी',
    render(expr) {
      const smile = expr === 'happy'
        ? '<path d="M66 96 Q80 110 94 96" stroke="#0f172a" stroke-width="3.8" fill="none" stroke-linecap="round"/>'
        : '<path d="M70 98 Q80 104 90 98" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
      return `
        <svg viewBox="0 0 160 160" width="152" height="152" role="img" aria-label="Chai Buddy mascot">
          <ellipse cx="80" cy="146" rx="42" ry="8" fill="rgba(251,191,36,0.22)"/>
          <path d="M64 38 Q58 26 66 18" stroke="#94a3b8" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M80 34 Q74 22 82 14" stroke="#94a3b8" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M96 38 Q90 26 98 18" stroke="#94a3b8" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M116 74 C138 74 138 112 114 112" stroke="#f59e0b" stroke-width="10" fill="none" stroke-linecap="round"/>
          <rect x="40" y="54" width="76" height="82" rx="18" fill="#fbbf24"/>
          <ellipse cx="78" cy="56" rx="38" ry="10" fill="#92400e"/>
          <circle cx="64" cy="84" r="5.5" fill="#0f172a"/>
          <circle cx="92" cy="84" r="5.5" fill="#0f172a"/>
          <circle cx="66" cy="82" r="2" fill="#fff"/>
          <circle cx="94" cy="82" r="2" fill="#fff"/>
          ${smile}
        </svg>`;
    }
  }
];

const MascotSystem = {
  charIdx: Math.floor(Math.random() * MASCOT_CHARACTERS.length),
  msgIdx: Math.floor(Math.random() * MASCOT_MESSAGES.en.length),
  expressions: ['normal', 'happy', 'wink'],
  exprIdx: 0,
  rotateTimer: null,
  declinedInView: false,

  mount(container) {
    this.unmount();
    if (!container || !Store.getSettings().mascotEnabled) return;
    this.declinedInView = false;
    this.render(container);
    this.rotateTimer = setInterval(() => {
      this.msgIdx = (this.msgIdx + 1) % MASCOT_MESSAGES.en.length;
      this.exprIdx = (this.exprIdx + 1) % this.expressions.length;
      if (this.msgIdx % 2 === 0) {
        this.charIdx = (this.charIdx + 1) % MASCOT_CHARACTERS.length;
      }
      this.render(container);
    }, 14000);
  },

  unmount() {
    if (this.rotateTimer) {
      clearInterval(this.rotateTimer);
      this.rotateTimer = null;
    }
  },

  render(container) {
    if (!container || !Store.getSettings().mascotEnabled) return;
    const lang = Store.getSettings().lang === 'hi' ? 'hi' : 'en';
    const char = MASCOT_CHARACTERS[this.charIdx];
    const expr = this.expressions[this.exprIdx];
    const msg = MASCOT_MESSAGES[lang][this.msgIdx % MASCOT_MESSAGES[lang].length];
    const charName = lang === 'hi' ? char.nameHi : char.nameEn;
    const showPrompt = !this.declinedInView && !Store.isBreakPromptCoolingDown();

    container.innerHTML = `
      <div class="mascot-header-row">
        <span>${t('mascotLabel')}</span>
        <button type="button" class="btn btn-secondary btn-sm" id="mascot-next-btn">${t('mascotNext')}</button>
      </div>
      <div class="mascot-board" id="mascot-board-msg">${escapeHtml(msg)}</div>
      <div class="mascot-character-box" id="mascot-char-btn" title="${escapeHtml(charName)}">
        ${char.render(expr)}
      </div>
      <span class="mascot-name-pill">${escapeHtml(charName)}</span>
      ${showPrompt ? `
        <div class="study-break-prompt" id="study-break-prompt">
          <div class="study-break-title">${t('breakPromptTitle')}</div>
          <div class="study-break-sub">${t('breakPromptSub')}</div>
          <div class="study-break-btns">
            <button type="button" class="btn btn-primary btn-sm" id="break-yes-btn">${icon('music')} ${t('breakYes')}</button>
            <button type="button" class="btn btn-secondary btn-sm" id="break-no-btn">${t('breakNo')}</button>
          </div>
        </div>
      ` : this.declinedInView ? `
        <div class="study-break-note">${t('breakDeclinedNote')}</div>
      ` : `
        <button type="button" class="btn btn-secondary btn-sm" id="break-yes-btn" style="width:100%">
          ${icon('music')} ${t('musicBreak')}
        </button>
      `}
    `;

    container.querySelector('#mascot-next-btn')?.addEventListener('click', () => {
      this.charIdx = (this.charIdx + 1) % MASCOT_CHARACTERS.length;
      this.msgIdx = (this.msgIdx + 1) % MASCOT_MESSAGES.en.length;
      this.exprIdx = (this.exprIdx + 1) % this.expressions.length;
      this.render(container);
    });

    container.querySelector('#mascot-char-btn')?.addEventListener('click', () => {
      this.exprIdx = (this.exprIdx + 1) % this.expressions.length;
      this.render(container);
    });

    container.querySelector('#break-yes-btn')?.addEventListener('click', () => {
      MusicPanel.open();
    });

    container.querySelector('#break-no-btn')?.addEventListener('click', () => {
      this.declinedInView = true;
      Store.setBreakPromptCooldown();
      this.render(container);
    });
  }
};
