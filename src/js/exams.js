// Exam Category Definitions, Verified Data Loader, Sorting Engine & IST Helpers
const EXAM_CATEGORIES = [
  {
    id: 'medical',
    icon: 'pulse',
    nameEn: 'Medical Entrance Exams',
    nameHi: 'मेडिकल प्रवेश परीक्षाएँ',
    descEn: 'NEET UG 2027, NEET PG, and AIIMS Nursing entrance schedules.',
    descHi: 'नीट यूजी 2027, नीट पीजी और एम्स नर्सिंग प्रवेश परीक्षाएँ।'
  },
  {
    id: 'engineering',
    icon: 'cpu',
    nameEn: 'Engineering Entrance Exams',
    nameHi: 'इंजीनियरिंग प्रवेश परीक्षाएँ',
    descEn: 'JEE Main 2027 Sessions 1 & 2, JEE Advanced 2027, VITEEE, and BITSAT.',
    descHi: 'जेईई मेन 2027 सत्र 1 व 2, जेईई एडवांस्ड 2027, वीआईटीईईई व बिटसैट।'
  },
  {
    id: 'national-competitive',
    icon: 'award',
    nameEn: 'National Competitive Exams',
    nameHi: 'राष्ट्रीय प्रतियोगी परीक्षाएँ',
    descEn: 'GATE 2027, CAT 2026, and national eligibility tests like CTET.',
    descHi: 'गेट 2027, कैट 2026 और सीटीईटी जैसी प्रमुख राष्ट्रीय परीक्षाएँ।'
  },
  {
    id: 'central-govt',
    icon: 'landmark',
    nameEn: 'Central Government Exams',
    nameHi: 'केंद्र सरकार की परीक्षाएँ',
    descEn: 'UPSC Civil Services (Prelims & Mains) and SSC CGL, CHSL, GD.',
    descHi: 'यूपीएससी सिविल सेवा (प्री/मेंस) एवं एसएससी सीजीएल, सीएचएसएल, जीडी।'
  },
  {
    id: 'rajasthan-govt',
    icon: 'mapPin',
    nameEn: 'Rajasthan Government Exams',
    nameHi: 'राजस्थान सरकारी परीक्षाएँ',
    descEn: 'RPSC RAS, RSSB CET (12th & Graduation), JEN, and REET updates.',
    descHi: 'आरपीएससी आरएएस, आरएसएसबी सीईटी (12वीं व स्नातक), जेईएन एवं रीट।'
  },
  {
    id: 'cbse-icse',
    icon: 'book',
    nameEn: 'CBSE & ICSE Board Exams',
    nameHi: 'सीबीएसई एवं आईसीएसई बोर्ड',
    descEn: 'Official 2027 CBSE Class 10 & 12 and CISCE ICSE & ISC date sheets.',
    descHi: 'आधिकारिक 2027 सीबीएसई 10वीं-12वीं और आईसीएसई-आईएससी बोर्ड तिथियाँ।'
  },
  {
    id: 'state-boards',
    icon: 'layers',
    nameEn: 'State Board Examinations',
    nameHi: 'राज्य बोर्ड परीक्षाएँ',
    descEn: 'RBSE Rajasthan, UP Board, Maharashtra HSC, Bihar Board, and WBCHSE.',
    descHi: 'राजस्थान बोर्ड (आरबीएसई), यूपी बोर्ड, महाराष्ट्र, बिहार व पश्चिम बंगाल बोर्ड।'
  },
  {
    id: 'defence',
    icon: 'shield',
    nameEn: 'Defence Entrance Exams',
    nameHi: 'रक्षा प्रवेश परीक्षाएँ',
    descEn: 'UPSC NDA I & II, CDS I & II, AFCAT 01/2027, and CAPF Assistant Commandants.',
    descHi: 'यूपीएससी एनडीए, सीडीएस, एएफकैट और सीएपीएफ सहायक कमांडेंट परीक्षाएँ।'
  },
  {
    id: 'university',
    icon: 'cap',
    nameEn: 'University Entrance Exams',
    nameHi: 'विश्वविद्यालय प्रवेश परीक्षाएँ',
    descEn: 'CUET UG 2027, CLAT 2027, and NLU Delhi AILET 2027.',
    descHi: 'सीयूईटी यूजी 2027, क्लैट 2027 और एनएलयू दिल्ली एआईएलईटी 2027।'
  },
  {
    id: 'banking-railway',
    icon: 'building',
    nameEn: 'Banking & Railway Exams',
    nameHi: 'बैंकिंग एवं रेलवे परीक्षाएँ',
    descEn: 'RRB Group D, RRB NTPC, IBPS PO/CSA, and SBI PO recruitments.',
    descHi: 'रेलवे ग्रुप डी, आरआरबी एनटीपीसी, आईबीपीएस पीओ/क्लर्क और एसबीआई पीओ।'
  },
  {
    id: 'other-state-govt',
    icon: 'mapPin',
    nameEn: 'Other State Government Exams',
    nameHi: 'अन्य राज्य सरकारी परीक्षाएँ',
    descEn: 'UPPSC PCS, BPSC 72nd CCE, and MPPSC State Services.',
    descHi: 'यूपीपीएससी पीसीएस, बीपीएससी 72वीं और एमपीपीएससी राज्य सेवा परीक्षाएँ।'
  },
  {
    id: 'other-important',
    icon: 'sparkles',
    nameEn: 'Other Important Examinations',
    nameHi: 'अन्य महत्वपूर्ण परीक्षाएँ',
    descEn: 'NTA UGC NET and ICAI Chartered Accountancy (CA) examinations.',
    descHi: 'एनटीए यूजीसी नेट और आईसीएआई चार्टर्ड अकाउंटेंसी (सीए) परीक्षाएँ।'
  }
];

const ExamDB = {
  exams: [],
  lastUpdated: null,
  loaded: false,

  async load() {
    try {
      const res = await fetch('/data/exams.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      this.exams = Array.isArray(payload.exams) ? payload.exams : [];
      this.lastUpdated = payload.lastUpdated || null;
      this.loaded = true;
    } catch (err) {
      console.error('Failed to load exams.json:', err);
      this.exams = [];
      this.loaded = true;
    }
    return this.exams;
  },

  getCategory(catId) {
    return EXAM_CATEGORIES.find((c) => c.id === catId) || null;
  },

  getCategoryName(cat) {
    if (!cat) return '';
    return Store.getSettings().lang === 'hi' ? cat.nameHi : cat.nameEn;
  },

  getCategoryDesc(cat) {
    if (!cat) return '';
    return Store.getSettings().lang === 'hi' ? cat.descHi : cat.descEn;
  },

  getExamName(exam, full = false) {
    const isHi = Store.getSettings().lang === 'hi';
    if (exam.custom) return exam.shortName || exam.fullName;
    if (full) return (isHi && exam.fullNameHi) ? exam.fullNameHi : exam.fullName;
    return (isHi && exam.nameHi) ? exam.nameHi : exam.shortName;
  },

  getExamDescription(exam) {
    const isHi = Store.getSettings().lang === 'hi';
    if (exam.custom) return exam.note || '';
    return (isHi && exam.descriptionHi) ? exam.descriptionHi : (exam.description || '');
  },

  getStatusNote(exam) {
    const isHi = Store.getSettings().lang === 'hi';
    return (isHi && exam.statusNoteHi) ? exam.statusNoteHi : (exam.statusNote || '');
  },

  isExpired(exam) {
    if (!exam.date) return false;
    const endRef = exam.endDate || exam.date;
    return Date.parse(endRef) < Date.now();
  },

  getEffectiveStatus(exam) {
    if (exam.status === 'postponed' || exam.status === 'cancelled' || exam.status === 'date-awaited') {
      return exam.status;
    }
    if (this.isExpired(exam)) return 'expired';
    return exam.status || 'official';
  },

  getStatusBadgeMeta(exam) {
    const st = this.getEffectiveStatus(exam);
    const map = {
      official: { label: t('statusOfficial'), cls: 'status-official' },
      tentative: { label: t('statusTentative'), cls: 'status-tentative' },
      'date-awaited': { label: t('statusDateAwaited'), cls: 'status-date-awaited' },
      postponed: { label: t('statusPostponed'), cls: 'status-postponed' },
      revised: { label: t('statusRevised'), cls: 'status-official' },
      cancelled: { label: t('statusCancelled'), cls: 'status-cancelled' },
      expired: { label: t('statusExpired'), cls: 'status-expired' }
    };
    return map[st] || map.official;
  },

  sortExams(list, mode = 'priority') {
    const arr = [...list];
    return arr.sort((a, b) => {
      if (mode === 'name') {
        return this.getExamName(a).localeCompare(this.getExamName(b));
      }
      if (mode === 'soonest') {
        const ta = a.date ? Date.parse(a.date) : Number.MAX_SAFE_INTEGER;
        const tb = b.date ? Date.parse(b.date) : Number.MAX_SAFE_INTEGER;
        const expA = this.isExpired(a) ? 1 : 0;
        const expB = this.isExpired(b) ? 1 : 0;
        if (expA !== expB) return expA - expB;
        if (ta !== tb) return ta - tb;
        return (a.manualPriority || 99) - (b.manualPriority || 99);
      }
      // Default: configurable priority + popularity + upcoming date
      const expA = this.isExpired(a) ? 1 : 0;
      const expB = this.isExpired(b) ? 1 : 0;
      if (expA !== expB) return expA - expB;

      const prioA = a.manualPriority ?? 50;
      const prioB = b.manualPriority ?? 50;
      if (prioA !== prioB) return prioA - prioB;

      const popA = a.popularityScore ?? 0;
      const popB = b.popularityScore ?? 0;
      if (popA !== popB) return popB - popA;

      const ta = a.date ? Date.parse(a.date) : Number.MAX_SAFE_INTEGER;
      const tb = b.date ? Date.parse(b.date) : Number.MAX_SAFE_INTEGER;
      return ta - tb;
    });
  },

  getByCategory(catId, sortMode = 'priority') {
    return this.sortExams(this.exams.filter((e) => e.category === catId), sortMode);
  },

  getById(id) {
    const fromDb = this.exams.find((e) => e.id === id);
    if (fromDb) return fromDb;
    return Store.getCustoms().find((c) => c.id === id) || null;
  },

  getSpotlight() {
    const spotlightIds = [
      'neet-ug-2027',
      'jee-main-2027-s1',
      'jee-advanced-2027',
      'upsc-cse-prelims-2027'
    ];
    return spotlightIds.map((id) => this.getById(id)).filter(Boolean);
  },

  search(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return this.sortExams(this.exams, 'priority').slice(0, 8);
    return this.sortExams(
      this.exams.filter((exam) => {
        const cat = this.getCategory(exam.category);
        const haystack = [
          exam.shortName,
          exam.nameHi,
          exam.fullName,
          exam.fullNameHi,
          exam.conductingBody,
          cat ? cat.nameEn : '',
          cat ? cat.nameHi : '',
          ...(exam.keywords || [])
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      }),
      'priority'
    );
  },

  formatISTDate(isoStr, includeTime = false) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return '—';
    const locale = Store.getSettings().lang === 'hi' ? 'hi-IN' : 'en-IN';
    const opts = {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    if (includeTime) {
      opts.hour = '2-digit';
      opts.minute = '2-digit';
    }
    return new Intl.DateTimeFormat(locale, opts).format(d);
  },

  formatISTWeekday(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return '—';
    const locale = Store.getSettings().lang === 'hi' ? 'hi-IN' : 'en-IN';
    return new Intl.DateTimeFormat(locale, {
      timeZone: 'Asia/Kolkata',
      weekday: 'long'
    }).format(d);
  },

  daysRemaining(isoStr) {
    if (!isoStr) return null;
    const diff = Date.parse(isoStr) - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / 86400000);
  }
};
