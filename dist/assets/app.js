/* SK EXAMS COUNTDOWN 2.0 — Production Bundle */
'use strict';
(function () {
// ===== i18n.js =====
// Complete Bilingual Dictionary (English & Hindi) — Zero random mixing
const TRANSLATIONS = {
  en: {
    brandName: 'SK EXAMS COUNTDOWN',
    tagline: 'Your Exam Journey, One Second Closer.',
    madeWithLove: 'Made with ❤️ by',
    navHome: 'Home',
    navCategories: 'Categories',
    navAllExams: 'All Exams',
    navMyCountdown: 'My Countdown',
    navFavourites: 'Favourites',
    navAbout: 'About',
    navSettings: 'Settings',
    searchPlaceholder: 'Search exams by name, abbreviation, or category...',
    searchTitle: 'Search Examinations',
    recentSearches: 'Recent Searches',
    clearSearch: 'Clear',
    noSearchResults: 'No matching examinations found',
    noSearchHint: 'Try searching NEET, JEE, UPSC, CBSE, RBSE, or RPSC.',
    heroBadge: 'Verified 2026–2027 Schedule • IST (Asia/Kolkata)',
    heroTitlePrefix: 'Track Every Indian Exam,',
    heroTitleHighlight: 'One Second Closer',
    heroSubtitle: 'Live countdowns backed by official NTA, UPSC, SSC, CBSE, RBSE, RPSC and board portals — with personal timers, bilingual support, and smart study-break music mode.',
    browseCategories: 'Browse Categories',
    createCustom: 'Create Custom Timer',
    lastUpdatedLabel: 'Database Verified:',
    spotlightTitle: 'Featured Upcoming Exams',
    spotlightDesc: 'Top national entrance and recruitment examinations prioritized for quick access.',
    categoriesTitle: 'Browse by Category',
    categoriesDesc: 'Explore verified examinations organized across 12 structured categories.',
    viewAll: 'View All',
    examsCountSuffix: 'exams',
    examCountSingular: 'exam',
    statusOfficial: 'Official',
    statusTentative: 'Tentative',
    statusDateAwaited: 'Date Awaited',
    statusPostponed: 'Postponed',
    statusRevised: 'Revised',
    statusCancelled: 'Cancelled',
    statusExpired: 'Completed',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    daysLeft: 'days left',
    todayLabel: 'Exam Day!',
    examDateLabel: 'Exam Date (IST)',
    dayOfWeekLabel: 'Day of Week',
    scheduleWindowLabel: 'Schedule Window',
    conductingBodyLabel: 'Conducting Authority',
    sessionLabel: 'Session / Stage',
    lastVerifiedLabel: 'Last Verified',
    officialLinksTitle: 'Official Examination Links',
    officialPortal: 'Official Portal',
    notificationLink: 'Notification / Notices',
    syllabusLink: 'Syllabus / Details',
    admitCardLink: 'Admit Card Portal',
    resultLink: 'Results Portal',
    remindMe: 'Remind Me',
    share: 'Share',
    copyLink: 'Copy Link',
    soundOn: 'Sound: On',
    soundOff: 'Sound: Off',
    fullscreen: 'Fullscreen',
    musicBreak: 'Music Break',
    addFavourite: 'Save',
    savedFavourite: 'Saved',
    back: 'Back',
    allStatuses: 'All Statuses',
    sortPriority: 'Priority & Popularity',
    sortSoonest: 'Soonest Date',
    sortName: 'Name (A–Z)',
    dateAwaitedHeadline: 'Official Exam Date Awaited',
    postponedHeadline: 'Examination Postponed — Revised Schedule Awaited',
    expiredHeadline: 'This Examination Date Has Passed',
    progressJourney: 'Preparation timeline progress',
    mascotLabel: 'Study Buddy',
    mascotNext: 'Next tip',
    breakPromptTitle: 'Getting tired of studying?',
    breakPromptSub: 'Need a little music break to recharge?',
    breakYes: 'Yes, Play Music',
    breakNo: 'No, Keep Studying',
    breakDeclinedNote: 'Awesome focus! Keep going — I will check back later.',
    musicModeTitle: 'Music Break Mode',
    musicPresetBtn: 'Switch Visuals',
    musicOpenTab: 'Open in New Tab',
    musicClose: 'Close Player',
    musicDisclaimer: 'Visuals run as an independent ambient animation (cross-origin browser security prevents reading iframe audio).',
    musicFallbackTitle: 'Open JioSaavn Web Player',
    musicFallbackDesc: 'If the embedded player is blocked by your browser or network policy, open it directly in a new tab while keeping your countdown running here.',
    musicReloadEmbed: 'Try Embedded Player',
    customTitle: 'My Personal Countdowns',
    customDesc: 'Create, edit, and track your own exam dates, mock tests, or study milestones.',
    customFormHeading: 'Create / Edit Custom Countdown',
    customNameLabel: 'Countdown Title',
    customNamePlaceholder: 'e.g. NEET Mock Test 5, Physics Revision',
    customDateLabel: 'Target Date',
    customTimeLabel: 'Target Time (IST)',
    customNoteLabel: 'Short Note (Optional)',
    customNotePlaceholder: 'e.g. Complete NCERT Biology first',
    saveCountdown: 'Save & Open Countdown',
    updateCountdown: 'Update Countdown',
    cancelEdit: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    noCustomYet: 'No custom countdowns yet',
    noCustomDesc: 'Add your personal test dates or study deadlines above. They stay saved on this device.',
    favouritesTitle: 'Saved Favourites',
    favouritesDesc: 'Quickly jump back to the examinations you bookmarked.',
    noFavouritesYet: 'No favourite exams saved yet',
    noFavouritesDesc: 'Tap the heart button on any exam card or countdown page to save it here.',
    aboutTitle: 'About SK EXAMS COUNTDOWN 2.0',
    aboutSubtitle: 'Built for Indian students who want accurate official schedules, distraction-free timers, and a refreshing study experience.',
    aboutMissionTitle: 'Verified Dates, Zero Guesswork',
    aboutMissionText: 'Every examination date in SK EXAMS COUNTDOWN 2.0 is audited against authoritative portals (NTA, UPSC, SSC, CBSE, CISCE, RBSE, RPSC, RSSB, IBPS, RRB). Tentative or postponed dates are clearly badged and never shown as confirmed.',
    usefulLinksTitle: 'Quick Official Portals',
    feedbackTitle: 'Contact & Feedback',
    feedbackText: 'Spot a newly announced date sheet or want an exam added? Reach out on Telegram.',
    settingsTitle: 'Settings & Personalization',
    settingsDesc: 'Customize appearance, language, background effects, mascots, and local data.',
    settingTheme: 'Appearance Theme',
    settingThemeDesc: 'Switch between dark-first glass mode and crisp light mode.',
    themeDark: 'Dark',
    themeLight: 'Light',
    settingLang: 'Display Language',
    settingLangDesc: 'Switch the entire interface cleanly between English and Hindi.',
    settingBg: 'Interactive Animated Background',
    settingBgDesc: 'Floating particles, auto-rotating presets, and click/touch light ripples.',
    settingBgPreset: 'Background Preset',
    settingMascot: 'Study Break Mascot',
    settingMascotDesc: 'Show animated cartoon study buddies with funny boards beside the timer.',
    settingMusicCooldown: 'Break Prompt Cooldown (minutes)',
    settingMusicCooldownDesc: 'Minimum wait before asking again after you click "No, Keep Studying".',
    settingReducedMotion: 'Reduced Motion',
    settingReducedMotionDesc: 'Minimize animations for accessibility or low-power devices.',
    settingSound: 'Last-10-Seconds Alert Tone',
    settingSoundDesc: 'Play a gentle tone during the final 10 seconds of a countdown.',
    settingFullscreen: 'Fullscreen Mode',
    settingFullscreenDesc: 'Expand the active view to fill your screen.',
    settingReset: 'Reset Settings',
    settingResetDesc: 'Restore all preferences to their default values.',
    settingClearData: 'Clear Saved Data',
    settingClearDataDesc: 'Delete saved favourites, custom timers, and recent searches on this device.',
    notFoundTitle: 'Page Not Found',
    notFoundDesc: 'The exam or page you requested could not be located.',
    goHome: 'Return to Home',
    toastCopied: 'Countdown link copied to clipboard!',
    toastSavedFav: 'Added to Favourites',
    toastRemovedFav: 'Removed from Favourites',
    toastCustomSaved: 'Custom countdown saved!',
    toastCustomDeleted: 'Custom countdown deleted',
    toastSettingsReset: 'Settings restored to defaults',
    toastDataCleared: 'Saved local data cleared',
    toastReminderSet: 'Reminder saved for 1 day & 1 hour before the exam.',
    toastReminderUnsupported: 'Browser notifications are not available here.',
    toastReminderDenied: 'Please enable notifications in browser settings.',
    toastReminderSoon: 'Exam is too close for a 1-hour reminder.',
    toastInvalidDate: 'Please select a valid future date and time.',
    installPwa: 'Install App'
  },
  hi: {
    brandName: 'SK EXAMS COUNTDOWN',
    tagline: 'आपकी परीक्षा की यात्रा, हर सेकंड और करीब।',
    madeWithLove: 'प्यार से निर्मित —',
    navHome: 'होम',
    navCategories: 'श्रेणियाँ',
    navAllExams: 'सभी परीक्षाएँ',
    navMyCountdown: 'मेरा काउंटडाउन',
    navFavourites: 'पसंदीदा',
    navAbout: 'परिचय',
    navSettings: 'सेटिंग्स',
    searchPlaceholder: 'परीक्षा का नाम, संक्षिप्त नाम या श्रेणी खोजें...',
    searchTitle: 'परीक्षा खोजें',
    recentSearches: 'हाल की खोजें',
    clearSearch: 'साफ़ करें',
    noSearchResults: 'कोई मेल खाती परीक्षा नहीं मिली',
    noSearchHint: 'नीट, जेईई, यूपीएससी, सीबीएसई, आरबीएसई या आरपीएससी खोजकर देखें।',
    heroBadge: 'सत्यापित 2026–2027 कार्यक्रम • भारतीय समय (IST)',
    heroTitlePrefix: 'हर भारतीय परीक्षा का समय,',
    heroTitleHighlight: 'एक सेकंड और करीब',
    heroSubtitle: 'एनटीए, यूपीएससी, एसएससी, सीबीएसई, आरबीएसई और आरपीएससी की आधिकारिक तिथियों के साथ लाइव काउंटडाउन, कस्टम टाइमर और स्मार्ट स्टडी-ब्रेक म्यूज़िक मोड।',
    browseCategories: 'श्रेणियाँ देखें',
    createCustom: 'कस्टम टाइमर बनाएँ',
    lastUpdatedLabel: 'डेटा सत्यापित:',
    spotlightTitle: 'प्रमुख आगामी परीक्षाएँ',
    spotlightDesc: 'त्वरित पहुँच के लिए शीर्ष राष्ट्रीय प्रवेश और भर्ती परीक्षाएँ।',
    categoriesTitle: 'श्रेणी के अनुसार खोजें',
    categoriesDesc: '12 सुव्यवस्थित श्रेणियों में सत्यापित परीक्षाओं का विवरण देखें।',
    viewAll: 'सभी देखें',
    examsCountSuffix: 'परीक्षाएँ',
    examCountSingular: 'परीक्षा',
    statusOfficial: 'आधिकारिक',
    statusTentative: 'संभावित',
    statusDateAwaited: 'तिथि प्रतीक्षित',
    statusPostponed: 'स्थगित',
    statusRevised: 'संशोधित',
    statusCancelled: 'रद्द',
    statusExpired: 'समाप्त',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    daysLeft: 'दिन शेष',
    todayLabel: 'आज परीक्षा है!',
    examDateLabel: 'परीक्षा तिथि (IST)',
    dayOfWeekLabel: 'दिन',
    scheduleWindowLabel: 'परीक्षा अवधि',
    conductingBodyLabel: 'आयोजक संस्था',
    sessionLabel: 'सत्र / चरण',
    lastVerifiedLabel: 'अंतिम सत्यापन',
    officialLinksTitle: 'आधिकारिक परीक्षा लिंक',
    officialPortal: 'आधिकारिक पोर्टल',
    notificationLink: 'अधिसूचना / नोटिस',
    syllabusLink: 'पाठ्यक्रम / विवरण',
    admitCardLink: 'एडमिट कार्ड पोर्टल',
    resultLink: 'परिणाम पोर्टल',
    remindMe: 'रिमाइंडर',
    share: 'शेयर करें',
    copyLink: 'लिंक कॉपी',
    soundOn: 'ध्वनि: चालू',
    soundOff: 'ध्वनि: बंद',
    fullscreen: 'फुलस्क्रीन',
    musicBreak: 'म्यूज़िक ब्रेक',
    addFavourite: 'सेव करें',
    savedFavourite: 'सेव है',
    back: 'वापस',
    allStatuses: 'सभी स्थितियाँ',
    sortPriority: 'प्राथमिकता के अनुसार',
    sortSoonest: 'सबसे नजदीकी तिथि',
    sortName: 'नाम के अनुसार',
    dateAwaitedHeadline: 'आधिकारिक परीक्षा तिथि की प्रतीक्षा है',
    postponedHeadline: 'परीक्षा स्थगित — संशोधित तिथि की प्रतीक्षा है',
    expiredHeadline: 'यह परीक्षा तिथि पूर्ण हो चुकी है',
    progressJourney: 'तैयारी की समय-सीमा प्रगति',
    mascotLabel: 'स्टडी साथी',
    mascotNext: 'अगला संदेश',
    breakPromptTitle: 'पढ़ाई से थक गए हैं?',
    breakPromptSub: 'क्या थोड़ा म्यूज़िक ब्रेक लेना चाहेंगे?',
    breakYes: 'हाँ, म्यूज़िक चलाएँ',
    breakNo: 'नहीं, पढ़ाई जारी रखें',
    breakDeclinedNote: 'शाबाश! पूरा ध्यान पढ़ाई पर रखें — हम थोड़ी देर बाद पूछेंगे।',
    musicModeTitle: 'म्यूज़िक ब्रेक मोड',
    musicPresetBtn: 'विज़ुअल बदलें',
    musicOpenTab: 'नए टैब में खोलें',
    musicClose: 'प्लेयर बंद करें',
    musicDisclaimer: 'विज़ुअल स्वतंत्र एंबिएंट एनीमेशन हैं (ब्राउज़र सुरक्षा नीति के कारण क्रॉस-ऑरिजिन ऑडियो पढ़ा नहीं जा सकता)।',
    musicFallbackTitle: 'जियोसावन वेब प्लेयर खोलें',
    musicFallbackDesc: 'यदि एम्बेडेड प्लेयर आपके ब्राउज़र या नेटवर्क द्वारा अवरुद्ध है, तो इसे नए टैब में खोलें और यहाँ काउंटडाउन चलता रखें।',
    musicReloadEmbed: 'एम्बेडेड प्लेयर आज़माएँ',
    customTitle: 'मेरे व्यक्तिगत काउंटडाउन',
    customDesc: 'अपनी परीक्षा तिथियाँ, मॉक टेस्ट या पढ़ाई के लक्ष्य जोड़ें और संपादित करें।',
    customFormHeading: 'कस्टम काउंटडाउन बनाएँ / बदलें',
    customNameLabel: 'काउंटडाउन का नाम',
    customNamePlaceholder: 'जैसे: नीट मॉक टेस्ट 5, भौतिकी रिवीज़न',
    customDateLabel: 'लक्ष्य तिथि',
    customTimeLabel: 'लक्ष्य समय (IST)',
    customNoteLabel: 'संक्षिप्त नोट (वैकल्पिक)',
    customNotePlaceholder: 'जैसे: पहले एनसीईआरटी जीवविज्ञान पूरा करें',
    saveCountdown: 'सेव करें और खोलें',
    updateCountdown: 'अपडेट करें',
    cancelEdit: 'रद्द करें',
    edit: 'बदलें',
    delete: 'हटाएँ',
    noCustomYet: 'अभी कोई कस्टम काउंटडाउन नहीं है',
    noCustomDesc: 'ऊपर अपनी निजी परीक्षा तिथि या लक्ष्य जोड़ें। यह इसी डिवाइस पर सुरक्षित रहेगा।',
    favouritesTitle: 'पसंदीदा परीक्षाएँ',
    favouritesDesc: 'अपनी बुकमार्क की गई परीक्षाओं पर तुरंत वापस जाएँ।',
    noFavouritesYet: 'अभी कोई पसंदीदा परीक्षा सेव नहीं है',
    noFavouritesDesc: 'किसी भी परीक्षा कार्ड पर दिल के आइकन को दबाकर उसे यहाँ सेव करें।',
    aboutTitle: 'SK EXAMS COUNTDOWN 2.0 के बारे में',
    aboutSubtitle: 'भारतीय छात्रों के लिए सटीक आधिकारिक तिथियों, स्वच्छ टाइमर और स्मार्ट अध्ययन अनुभव के साथ निर्मित।',
    aboutMissionTitle: 'सत्यापित तिथियाँ, कोई अनुमान नहीं',
    aboutMissionText: 'प्रत्येक परीक्षा तिथि की जांच आधिकारिक पोर्टल (एनटीए, यूपीएससी, एसएससी, सीबीएसई, आरबीएसई, आरपीएससी, आरएसएसबी, आईबीपीएस, आरआरबी) से की गई है। संभावित या स्थगित तिथियों को स्पष्ट रूप से चिह्नित किया गया है।',
    usefulLinksTitle: 'प्रमुख आधिकारिक पोर्टल',
    feedbackTitle: 'संपर्क और सुझाव',
    feedbackText: 'नई डेटशीट की सूचना या किसी परीक्षा को जोड़ने के लिए टेलीग्राम पर संपर्क करें।',
    settingsTitle: 'सेटिंग्स और वैयक्तिकरण',
    settingsDesc: 'थीम, भाषा, बैकग्राउंड इफेक्ट्स, मैस्कॉट और स्थानीय डेटा को नियंत्रित करें।',
    settingTheme: 'थीम चुनें',
    settingThemeDesc: 'डार्क ग्लास मोड और लाइट मोड के बीच स्विच करें।',
    themeDark: 'डार्क',
    themeLight: 'लाइट',
    settingLang: 'भाषा (Language)',
    settingLangDesc: 'संपूर्ण वेबसाइट को हिंदी और अंग्रेज़ी में बदलें।',
    settingBg: 'इंटरैक्टिव एनिमेटेड बैकग्राउंड',
    settingBgDesc: 'तैरते कण, ऑटो-बदलते प्रीसेट और टच/क्लिक लाइट रिपल इफेक्ट।',
    settingBgPreset: 'बैकग्राउंड प्रीसेट',
    settingMascot: 'स्टडी ब्रेक मैस्कॉट',
    settingMascotDesc: 'टाइमर के साथ मज़ेदार संदेश बोर्ड वाले कार्टून साथी दिखाएँ।',
    settingMusicCooldown: 'ब्रेक प्रॉम्प्ट अंतराल (मिनट)',
    settingMusicCooldownDesc: '"नहीं, पढ़ाई जारी रखें" दबाने के बाद अगली बार पूछने का समय।',
    settingReducedMotion: 'कम एनीमेशन (Reduced Motion)',
    settingReducedMotionDesc: 'सुगम्यता या कम बैटरी खपत के लिए एनीमेशन सीमित करें।',
    settingSound: 'अंतिम 10 सेकंड की ध्वनि',
    settingSoundDesc: 'काउंटडाउन के अंतिम 10 सेकंड में हल्की बीप ध्वनि बजाएँ।',
    settingFullscreen: 'फुलस्क्रीन मोड',
    settingFullscreenDesc: 'स्क्रीन को पूरी तरह भरने के लिए फुलस्क्रीन चालू या बंद करें।',
    settingReset: 'सेटिंग्स रीसेट करें',
    settingResetDesc: 'सभी सेटिंग्स को डिफ़ॉल्ट स्थिति में वापस लाएँ।',
    settingClearData: 'सेव डेटा साफ़ करें',
    settingClearDataDesc: 'इस डिवाइस से पसंदीदा, कस्टम टाइमर और हाल की खोजें हटाएँ।',
    notFoundTitle: 'पृष्ठ नहीं मिला',
    notFoundDesc: 'आप जिस परीक्षा या पृष्ठ को खोज रहे हैं वह उपलब्ध नहीं है।',
    goHome: 'होम पर वापस जाएँ',
    toastCopied: 'काउंटडाउन लिंक कॉपी हो गया!',
    toastSavedFav: 'पसंदीदा में जोड़ा गया',
    toastRemovedFav: 'पसंदीदा से हटाया गया',
    toastCustomSaved: 'कस्टम काउंटडाउन सेव हो गया!',
    toastCustomDeleted: 'कस्टम काउंटडाउन हटा दिया गया',
    toastSettingsReset: 'सेटिंग्स डिफ़ॉल्ट पर रीसेट हो गईं',
    toastDataCleared: 'स्थानीय डेटा साफ़ कर दिया गया',
    toastReminderSet: 'परीक्षा से 1 दिन और 1 घंटे पहले का रिमाइंडर सेट हो गया।',
    toastReminderUnsupported: 'इस ब्राउज़र में नोटिफिकेशन समर्थित नहीं है।',
    toastReminderDenied: 'कृपया ब्राउज़र सेटिंग्स में नोटिफिकेशन की अनुमति दें।',
    toastReminderSoon: '1 घंटे के रिमाइंडर के लिए परीक्षा बहुत करीब है।',
    toastInvalidDate: 'कृपया भविष्य की एक मान्य तिथि और समय चुनें।',
    installPwa: 'ऐप इंस्टॉल करें'
  }
};

function t(key) {
  const lang = Store.getSettings().lang || 'en';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
}


// ===== icons.js =====
// Lightweight Original Geometric SVG Icon Helper
const ICONS = {
  home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-6h5v6"/></svg>',
  grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  list: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
  clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>',
  heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5S4 15.2 4 9.5A4.5 4.5 0 0 1 12 6.6 4.5 4.5 0 0 1 20 9.5c0 5.7-8 11-8 11z"/></svg>',
  heartFilled: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 20.5S4 15.2 4 9.5A4.5 4.5 0 0 1 12 6.6 4.5 4.5 0 0 1 20 9.5c0 5.7-8 11-8 11z"/></svg>',
  info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="10" x2="12" y2="16"/><circle cx="12" cy="7.5" r="0.8" fill="currentColor"/></svg>',
  settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.2" y2="16.2"/></svg>',
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>',
  music: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>',
  bell: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
  share: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><line x1="8.2" y1="13.2" x2="15.8" y2="17.8"/><line x1="15.8" y1="6.2" x2="8.2" y2="10.8"/></svg>',
  expand: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  volume: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
  arrowLeft: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  external: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  plus: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 21 6"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
  edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5l4 4L8 20H4v-4L16.5 3.5z"/></svg>',
  sparkles: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>',
  award: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/></svg>',
  cpu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  pulse: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 12 6 12 9 4 14 20 17 12 22 12"/></svg>',
  cap: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 3 2 8.5 12 14 22 8.5 12 3"/><path d="M6 11v5.5c0 1.5 2.7 3 6 3s6-1.5 6-3V11"/></svg>',
  building: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M10 21v-4h4v4"/></svg>',
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/></svg>',
  book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/></svg>',
  landmark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 3 3 8 21 8 12 3"/><line x1="6" y1="11" x2="6" y2="17"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="18" y1="11" x2="18" y2="17"/><line x1="3" y1="20" x2="21" y2="20"/></svg>',
  mapPin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.6-6-10.5a6 6 0 1 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/></svg>',
  layers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 3 2 8.5 12 14 22 8.5 12 3"/><polyline points="2 13.5 12 19 22 13.5"/></svg>'
};

function icon(name) {
  return ICONS[name] || '';
}


// ===== store.js =====
// Safe Browser Storage & Centralized State Manager
const KEYS = {
  SETTINGS: 'sk2_settings',
  FAVOURITES: 'sk2_favourites',
  CUSTOMS: 'sk2_custom_countdowns',
  RECENT_SEARCH: 'sk2_recent_searches',
  BREAK_COOLDOWN_UNTIL: 'sk2_break_cooldown_until',
  REMINDERS: 'sk2_reminders'
};

const DEFAULT_SETTINGS = {
  theme: 'dark',
  lang: 'en',
  bgEnabled: true,
  bgPreset: 'auto', // auto | constellation | aurora | stardust | waves
  mascotEnabled: true,
  musicCooldownMinutes: 15,
  reducedMotion: false,
  soundEnabled: false
};

function safeRead(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const Store = {
  settings: null,
  favourites: [],
  customs: [],
  recentSearches: [],

  init() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saved = safeRead(KEYS.SETTINGS, null);
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      { reducedMotion: Boolean(prefersReduced) },
      saved || {}
    );
    this.favourites = safeRead(KEYS.FAVOURITES, []);
    if (!Array.isArray(this.favourites)) this.favourites = [];

    // Also migrate any custom countdowns from v1 if present
    const v2Customs = safeRead(KEYS.CUSTOMS, null);
    if (Array.isArray(v2Customs)) {
      this.customs = v2Customs;
    } else {
      const legacy = safeRead('sk_custom_countdowns', []);
      this.customs = Array.isArray(legacy) ? legacy.map((c) => ({
        id: c.id || `custom-${Date.now()}`,
        shortName: c.name || 'Custom Countdown',
        fullName: c.fullName || c.name || 'Custom Countdown',
        date: c.date,
        note: c.note || '',
        custom: true
      })) : [];
      if (this.customs.length) safeWrite(KEYS.CUSTOMS, this.customs);
    }

    this.recentSearches = safeRead(KEYS.RECENT_SEARCH, []);
    if (!Array.isArray(this.recentSearches)) this.recentSearches = [];

    this.applySettingsToDOM();
  },

  getSettings() {
    if (!this.settings) this.init();
    return this.settings;
  },

  updateSettings(patch) {
    this.settings = Object.assign({}, this.getSettings(), patch);
    safeWrite(KEYS.SETTINGS, this.settings);
    this.applySettingsToDOM();
    return this.settings;
  },

  resetSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS);
    safeWrite(KEYS.SETTINGS, this.settings);
    this.applySettingsToDOM();
    return this.settings;
  },

  applySettingsToDOM() {
    const s = this.getSettings();
    document.documentElement.setAttribute('data-theme', s.theme);
    document.documentElement.setAttribute('lang', s.lang === 'hi' ? 'hi' : 'en');
    document.documentElement.setAttribute('data-reduced-motion', s.reducedMotion ? 'true' : 'false');
    document.body.classList.toggle('bg-disabled', !s.bgEnabled);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', s.theme === 'dark' ? '#070914' : '#f4f6fb');
    }
  },

  isFavourite(id) {
    return this.favourites.includes(id);
  },

  toggleFavourite(id) {
    if (this.isFavourite(id)) {
      this.favourites = this.favourites.filter((x) => x !== id);
      safeWrite(KEYS.FAVOURITES, this.favourites);
      return false;
    }
    this.favourites = [id, ...this.favourites];
    safeWrite(KEYS.FAVOURITES, this.favourites);
    return true;
  },

  getCustoms() {
    return this.customs;
  },

  saveCustom(item) {
    const idx = this.customs.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      this.customs[idx] = item;
    } else {
      this.customs.unshift(item);
      this.customs = this.customs.slice(0, 30);
    }
    safeWrite(KEYS.CUSTOMS, this.customs);
  },

  deleteCustom(id) {
    this.customs = this.customs.filter((c) => c.id !== id);
    safeWrite(KEYS.CUSTOMS, this.customs);
  },

  addRecentSearch(query) {
    const q = (query || '').trim();
    if (!q) return;
    this.recentSearches = [q, ...this.recentSearches.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6);
    safeWrite(KEYS.RECENT_SEARCH, this.recentSearches);
  },

  clearRecentSearches() {
    this.recentSearches = [];
    safeWrite(KEYS.RECENT_SEARCH, []);
  },

  isBreakPromptCoolingDown() {
    const until = Number(safeRead(KEYS.BREAK_COOLDOWN_UNTIL, 0));
    return Date.now() < until;
  },

  setBreakPromptCooldown() {
    const mins = Math.max(1, Number(this.getSettings().musicCooldownMinutes) || 15);
    safeWrite(KEYS.BREAK_COOLDOWN_UNTIL, Date.now() + mins * 60 * 1000);
  },

  clearSavedData() {
    this.favourites = [];
    this.customs = [];
    this.recentSearches = [];
    safeWrite(KEYS.FAVOURITES, []);
    safeWrite(KEYS.CUSTOMS, []);
    safeWrite(KEYS.RECENT_SEARCH, []);
    safeWrite(KEYS.BREAK_COOLDOWN_UNTIL, 0);
    safeWrite(KEYS.REMINDERS, []);
  },

  getReminders() {
    const list = safeRead(KEYS.REMINDERS, []);
    return Array.isArray(list) ? list : [];
  },

  saveReminders(list) {
    safeWrite(KEYS.REMINDERS, list);
  }
};


// ===== exams.js =====
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


// ===== background.js =====
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


// ===== music-visuals.js =====
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


// ===== mascots.js =====
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


// ===== music-panel.js =====
// Study-Break Music Side Panel (Desktop Split-Screen / Mobile Full Drawer) with Embedding Fallback
const MUSIC_URL = 'https://jiosaavn-music-player.vercel.app';

const MusicPanel = {
  isOpen: false,
  mode: 'embed', // 'embed' | 'fallback'
  drawer: null,

  init() {
    this.drawer = document.getElementById('music-drawer');
  },

  open() {
    if (!this.drawer) this.init();
    if (!this.drawer) return;
    this.isOpen = true;
    document.body.classList.add('music-mode-active');
    this.drawer.classList.add('open');
    this.drawer.setAttribute('aria-hidden', 'false');
    MusicVisuals.start();
    this.render();
  },

  close() {
    if (!this.drawer) return;
    this.isOpen = false;
    document.body.classList.remove('music-mode-active');
    this.drawer.classList.remove('open');
    this.drawer.setAttribute('aria-hidden', 'true');
    MusicVisuals.stop();
    this.drawer.innerHTML = '';
  },

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  },

  render() {
    if (!this.drawer || !this.isOpen) return;
    const isEmbed = this.mode === 'embed';

    this.drawer.innerHTML = `
      <div class="music-drawer-header">
        <div class="music-drawer-title">
          <span class="music-eq-mini" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
          <span>${t('musicModeTitle')}</span>
        </div>
        <button type="button" class="icon-btn" id="music-close-btn" aria-label="${t('musicClose')}" title="${t('musicClose')}">✕</button>
      </div>
      <div class="music-drawer-toolbar">
        <button type="button" class="btn btn-secondary btn-sm" id="music-preset-btn">${icon('sparkles')} ${t('musicPresetBtn')}</button>
        <div style="display:flex;gap:0.4rem;">
          ${isEmbed
            ? `<button type="button" class="btn btn-secondary btn-sm" id="music-fallback-toggle">Fallback</button>`
            : `<button type="button" class="btn btn-secondary btn-sm" id="music-embed-toggle">${t('musicReloadEmbed')}</button>`}
          <a href="${MUSIC_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            ${icon('external')} ${t('musicOpenTab')}
          </a>
        </div>
      </div>
      <div class="music-frame-container">
        ${isEmbed ? `
          <iframe
            id="music-player-iframe"
            class="music-iframe"
            src="${MUSIC_URL}"
            title="JioSaavn Music Player"
            allow="autoplay; encrypted-media; clipboard-write"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        ` : `
          <div class="music-fallback-card">
            <div class="category-icon" style="width:60px;height:60px;">${icon('music')}</div>
            <h3>${t('musicFallbackTitle')}</h3>
            <p style="color:var(--text-secondary);font-size:0.88rem;max-width:320px;">${t('musicFallbackDesc')}</p>
            <a href="${MUSIC_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              ${icon('external')} ${t('musicOpenTab')}
            </a>
            <button type="button" class="btn btn-secondary btn-sm" id="music-retry-embed-btn">${t('musicReloadEmbed')}</button>
          </div>
        `}
      </div>
      <div class="music-visual-disclaimer">${t('musicDisclaimer')}</div>
    `;

    this.drawer.querySelector('#music-close-btn')?.addEventListener('click', () => this.close());
    this.drawer.querySelector('#music-preset-btn')?.addEventListener('click', () => {
      const name = MusicVisuals.nextPalette();
      showToast(`${t('musicModeTitle')}: ${name}`);
    });
    this.drawer.querySelector('#music-fallback-toggle')?.addEventListener('click', () => {
      this.mode = 'fallback';
      this.render();
    });
    this.drawer.querySelector('#music-embed-toggle')?.addEventListener('click', () => {
      this.mode = 'embed';
      this.render();
    });
    this.drawer.querySelector('#music-retry-embed-btn')?.addEventListener('click', () => {
      this.mode = 'embed';
      this.render();
    });

    const iframe = this.drawer.querySelector('#music-player-iframe');
    if (iframe) {
      iframe.addEventListener('error', () => {
        this.mode = 'fallback';
        this.render();
      });
    }
  }
};


// ===== countdown.js =====
// Real-time Countdown Timer, Reminders, Sound, Share & Fullscreen Controller
const CountdownController = {
  timerId: null,
  lastSec: -1,
  lastValues: { d: '', h: '', m: '', s: '' },

  start(exam) {
    this.stop();
    if (!exam || !exam.date) return;
    const effectiveStatus = ExamDB.getEffectiveStatus(exam);
    if (effectiveStatus === 'postponed' || effectiveStatus === 'cancelled' || effectiveStatus === 'date-awaited') {
      return;
    }

    const targetMs = Date.parse(exam.date);
    if (Number.isNaN(targetMs)) return;

    const startMs = Math.min(Date.now() - 86400000, targetMs - 365 * 86400000);

    const tick = () => {
      const now = Date.now();
      let diff = targetMs - now;

      const elD = document.getElementById('cd-days');
      const elH = document.getElementById('cd-hours');
      const elM = document.getElementById('cd-minutes');
      const elS = document.getElementById('cd-seconds');
      const elFill = document.getElementById('cd-progress-fill');
      const elPct = document.getElementById('cd-progress-pct');

      if (!elD || !elH || !elM || !elS) {
        this.stop();
        return;
      }

      if (diff <= 0) {
        this.setDigit(elD, '00', 'd');
        this.setDigit(elH, '00', 'h');
        this.setDigit(elM, '00', 'm');
        this.setDigit(elS, '00', 's');
        if (elFill) elFill.style.width = '100%';
        if (elPct) elPct.textContent = '100%';
        const banner = document.getElementById('cd-expired-banner');
        if (banner) banner.style.display = 'block';
        this.stop();
        return;
      }

      const days = Math.floor(diff / 86400000);
      diff %= 86400000;
      const hours = Math.floor(diff / 3600000);
      diff %= 3600000;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      this.setDigit(elD, String(days).padStart(2, '0'), 'd');
      this.setDigit(elH, String(hours).padStart(2, '0'), 'h');
      this.setDigit(elM, String(minutes).padStart(2, '0'), 'm');
      this.setDigit(elS, String(seconds).padStart(2, '0'), 's');

      const total = Math.max(1, targetMs - startMs);
      const pct = Math.min(100, Math.max(1, Math.round(((now - startMs) / total) * 100)));
      if (elFill) elFill.style.width = `${pct}%`;
      if (elPct) elPct.textContent = `${pct}%`;

      if (Store.getSettings().soundEnabled && days === 0 && hours === 0 && minutes === 0 && seconds <= 10 && seconds !== this.lastSec) {
        this.lastSec = seconds;
        this.playBeep();
      }
    };

    this.lastValues = { d: '', h: '', m: '', s: '' };
    tick();
    this.timerId = setInterval(tick, 1000);
  },

  setDigit(el, value, key) {
    if (this.lastValues[key] !== value) {
      el.textContent = value;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
      this.lastValues[key] = value;
    }
  },

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },

  playBeep() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 110);
    } catch {
      // Ignore audio autoplay restriction errors
    }
  },

  async setupReminder(exam) {
    if (!exam || !exam.date) return;
    if (!('Notification' in window)) {
      showToast(t('toastReminderUnsupported'));
      return;
    }
    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
    }
    if (perm !== 'granted') {
      showToast(t('toastReminderDenied'));
      return;
    }

    const target = Date.parse(exam.date);
    const now = Date.now();
    const reminders = Store.getReminders().filter((r) => r.examId !== exam.id);
    let scheduled = 0;

    [
      { offset: 86400000, label: '1 day left' },
      { offset: 3600000, label: '1 hour left' }
    ].forEach((slot) => {
      const when = target - slot.offset;
      if (when > now) {
        reminders.push({ examId: exam.id, name: ExamDB.getExamName(exam), when, label: slot.label });
        scheduled++;
      }
    });

    if (scheduled > 0) {
      Store.saveReminders(reminders);
      showToast(t('toastReminderSet'));
    } else {
      showToast(t('toastReminderSoon'));
    }
  },

  checkDueReminders() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = Date.now();
    const remaining = [];
    for (const r of Store.getReminders()) {
      if (r.when <= now && r.when > now - 3600000) {
        try {
          new Notification('SK EXAMS COUNTDOWN 2.0', {
            body: `${r.name} — ${r.label}`,
            icon: '/favicon.svg'
          });
        } catch {
          // Ignore notification runtime errors
        }
      } else if (r.when > now) {
        remaining.push(r);
      }
    }
    Store.saveReminders(remaining);
  },

  async shareExam(exam) {
    const url = exam
      ? `${window.location.origin}/exam/${encodeURIComponent(exam.id)}`
      : window.location.origin;
    const title = exam ? `${ExamDB.getExamName(exam)} — SK EXAMS COUNTDOWN 2.0` : 'SK EXAMS COUNTDOWN 2.0';
    const text = exam
      ? `${ExamDB.getExamName(exam)} (${exam.expectedWindow || ExamDB.formatISTDate(exam.date)}) — Track live countdown:`
      : 'Track NEET UG 2027, JEE Main & Advanced 2027, UPSC & Board Exam countdowns:';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(t('toastCopied'));
    } catch {
      showToast(url);
    }
  },

  toggleFullscreen() {
    if (document.body.classList.contains('fullscreen-mode')) {
      this.exitFullscreen();
    } else {
      document.body.classList.add('fullscreen-mode');
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    }
  },

  exitFullscreen(fromBrowser = false) {
    document.body.classList.remove('fullscreen-mode');
    if (!fromBrowser && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
};


// ===== views.js =====
// Reusable View Renderers for All Application Routes
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderExamCard(exam) {
  const badge = ExamDB.getStatusBadgeMeta(exam);
  const saved = Store.isFavourite(exam.id);
  const days = exam.date && !ExamDB.isExpired(exam) ? ExamDB.daysRemaining(exam.date) : null;
  const dateLabel = exam.date
    ? ExamDB.formatISTDate(exam.date)
    : (exam.expectedWindow || t('statusDateAwaited'));

  return `
    <article class="exam-card" data-open-exam="${escapeHtml(exam.id)}" tabindex="0" role="button">
      <div>
        <div class="exam-card-head">
          <div>
            <h3 class="exam-card-title">${escapeHtml(ExamDB.getExamName(exam))}</h3>
            <p class="exam-card-sub">${escapeHtml(exam.conductingBody || (exam.custom ? t('navMyCountdown') : ''))}</p>
          </div>
          <button type="button" class="fav-toggle ${saved ? 'saved' : ''}" data-fav-id="${escapeHtml(exam.id)}" aria-label="${saved ? t('savedFavourite') : t('addFavourite')}" title="${saved ? t('savedFavourite') : t('addFavourite')}">
            ${saved ? icon('heartFilled') : icon('heart')}
          </button>
        </div>
      </div>
      <div class="exam-card-foot">
        <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
        <span style="color:var(--text-secondary);font-weight:600;">
          ${days !== null ? (days === 0 ? t('todayLabel') : `${days} ${t('daysLeft')}`) : escapeHtml(dateLabel)}
        </span>
      </div>
    </article>
  `;
}

function bindExamCardEvents(root) {
  root.querySelectorAll('[data-fav-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-fav-id');
      const nowSaved = Store.toggleFavourite(id);
      btn.classList.toggle('saved', nowSaved);
      btn.innerHTML = nowSaved ? icon('heartFilled') : icon('heart');
      showToast(nowSaved ? t('toastSavedFav') : t('toastRemovedFav'));
      if (Router.currentPath === '/favourites') Router.render();
    });
  });

  root.querySelectorAll('[data-open-exam]').forEach((card) => {
    const open = () => Router.navigate(`/exam/${encodeURIComponent(card.getAttribute('data-open-exam'))}`);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
}

const Views = {
  home(container) {
    const spotlight = ExamDB.getSpotlight();
    const lastUpd = ExamDB.formatISTDate(ExamDB.lastUpdated);

    container.innerHTML = `
      <section class="hero-banner">
        <div class="hero-top-row">
          <span class="pill-badge">${icon('sparkles')} ${t('heroBadge')}</span>
          <span class="last-updated-chip">${icon('clock')} ${t('lastUpdatedLabel')} <strong>${escapeHtml(lastUpd)}</strong></span>
        </div>
        <h1 class="hero-title">${t('heroTitlePrefix')} <span>${t('heroTitleHighlight')}</span></h1>
        <p class="hero-subtitle">${t('heroSubtitle')}</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary" data-nav="/categories">${icon('grid')} ${t('browseCategories')}</button>
          <button type="button" class="btn btn-secondary" data-nav="/my-countdown">${icon('plus')} ${t('createCustom')}</button>
          <button type="button" class="btn btn-secondary" id="hero-search-btn">${icon('search')} ${t('searchTitle')}</button>
        </div>
      </section>

      <div class="section-header">
        <div>
          <h2 class="section-title">${t('spotlightTitle')}</h2>
          <p class="section-desc">${t('spotlightDesc')}</p>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" data-nav="/exams">${t('viewAll')} ${icon('arrowRight')}</button>
      </div>
      <div class="spotlight-grid">
        ${spotlight.map((exam) => {
          const badge = ExamDB.getStatusBadgeMeta(exam);
          const days = exam.date ? ExamDB.daysRemaining(exam.date) : null;
          return `
            <article class="spotlight-card" data-open-exam="${escapeHtml(exam.id)}" tabindex="0" role="button">
              <div class="exam-card-head">
                <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
                <span style="font-size:0.78rem;color:var(--text-secondary);">${escapeHtml(ExamDB.formatISTDate(exam.date))}</span>
              </div>
              <h3 class="exam-card-title">${escapeHtml(ExamDB.getExamName(exam))}</h3>
              <div class="spotlight-days">${days !== null ? `${days} ${t('daysLeft')}` : t('statusDateAwaited')}</div>
              <p class="exam-card-sub">${escapeHtml(exam.expectedWindow || '')}</p>
            </article>
          `;
        }).join('')}
      </div>

      <div class="section-header">
        <div>
          <h2 class="section-title">${t('categoriesTitle')}</h2>
          <p class="section-desc">${t('categoriesDesc')}</p>
        </div>
      </div>
      <div class="category-grid">
        ${EXAM_CATEGORIES.map((cat) => {
          const count = ExamDB.getByCategory(cat.id).length;
          return `
            <button type="button" class="category-card" data-nav="/category/${escapeHtml(cat.id)}">
              <div class="category-card-top">
                <span class="category-icon">${icon(cat.icon)}</span>
                <span class="category-count">${count} ${count === 1 ? t('examCountSingular') : t('examsCountSuffix')}</span>
              </div>
              <div class="category-title">${escapeHtml(ExamDB.getCategoryName(cat))}</div>
              <div class="category-desc">${escapeHtml(ExamDB.getCategoryDesc(cat))}</div>
            </button>
          `;
        }).join('')}
      </div>
    `;

    container.querySelector('#hero-search-btn')?.addEventListener('click', () => SearchModal.open());
    bindExamCardEvents(container);
  },

  categories(container) {
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.6rem;">${t('categoriesTitle')}</h1>
          <p class="section-desc">${t('categoriesDesc')}</p>
        </div>
        <span class="last-updated-chip">${t('lastUpdatedLabel')} ${escapeHtml(ExamDB.formatISTDate(ExamDB.lastUpdated))}</span>
      </div>
      <div class="category-grid">
        ${EXAM_CATEGORIES.map((cat) => {
          const count = ExamDB.getByCategory(cat.id).length;
          return `
            <button type="button" class="category-card" data-nav="/category/${escapeHtml(cat.id)}">
              <div class="category-card-top">
                <span class="category-icon">${icon(cat.icon)}</span>
                <span class="category-count">${count} ${count === 1 ? t('examCountSingular') : t('examsCountSuffix')}</span>
              </div>
              <div class="category-title">${escapeHtml(ExamDB.getCategoryName(cat))}</div>
              <div class="category-desc">${escapeHtml(ExamDB.getCategoryDesc(cat))}</div>
            </button>
          `;
        }).join('')}
      </div>
    `;
  },

  categoryDetail(container, catId) {
    const cat = ExamDB.getCategory(catId);
    if (!cat) {
      this.notFound(container);
      return;
    }

    let statusFilter = 'all';
    let sortMode = 'priority';

    const draw = () => {
      let list = ExamDB.getByCategory(catId, sortMode);
      if (statusFilter !== 'all') {
        list = list.filter((e) => ExamDB.getEffectiveStatus(e) === statusFilter);
      }

      container.innerHTML = `
        <div class="countdown-topbar">
          <button type="button" class="btn btn-secondary btn-sm" data-nav="/categories">${icon('arrowLeft')} ${t('navCategories')}</button>
          <span class="last-updated-chip">${list.length} ${list.length === 1 ? t('examCountSingular') : t('examsCountSuffix')}</span>
        </div>
        <div class="section-header" style="margin-top:0.25rem;">
          <div>
            <h1 class="section-title" style="font-size:1.55rem;">${escapeHtml(ExamDB.getCategoryName(cat))}</h1>
            <p class="section-desc">${escapeHtml(ExamDB.getCategoryDesc(cat))}</p>
          </div>
        </div>
        <div class="filter-bar">
          <div class="chip-row">
            ${['all', 'official', 'tentative', 'date-awaited', 'postponed'].map((st) => `
              <button type="button" class="filter-chip ${statusFilter === st ? 'active' : ''}" data-st="${st}">
                ${st === 'all' ? t('allStatuses') : t({
                  official: 'statusOfficial',
                  tentative: 'statusTentative',
                  'date-awaited': 'statusDateAwaited',
                  postponed: 'statusPostponed'
                }[st])}
              </button>
            `).join('')}
          </div>
          <select class="input-field" id="cat-sort-select" aria-label="Sort exams" style="margin-left:auto;">
            <option value="priority" ${sortMode === 'priority' ? 'selected' : ''}>${t('sortPriority')}</option>
            <option value="soonest" ${sortMode === 'soonest' ? 'selected' : ''}>${t('sortSoonest')}</option>
            <option value="name" ${sortMode === 'name' ? 'selected' : ''}>${t('sortName')}</option>
          </select>
        </div>
        ${list.length ? `<div class="exam-grid">${list.map(renderExamCard).join('')}</div>` : `
          <div class="empty-state">
            <h3>${t('noSearchResults')}</h3>
            <p>${t('noSearchHint')}</p>
          </div>
        `}
      `;

      container.querySelectorAll('[data-st]').forEach((btn) => {
        btn.addEventListener('click', () => {
          statusFilter = btn.getAttribute('data-st');
          draw();
        });
      });
      container.querySelector('#cat-sort-select')?.addEventListener('change', (e) => {
        sortMode = e.target.value;
        draw();
      });
      bindExamCardEvents(container);
    };

    draw();
  },

  allExams(container) {
    let query = '';
    let catFilter = 'all';
    let statusFilter = 'all';
    let sortMode = 'priority';

    const draw = () => {
      let list = query ? ExamDB.search(query) : ExamDB.sortExams(ExamDB.exams, sortMode);
      if (catFilter !== 'all') list = list.filter((e) => e.category === catFilter);
      if (statusFilter !== 'all') list = list.filter((e) => ExamDB.getEffectiveStatus(e) === statusFilter);
      list = ExamDB.sortExams(list, sortMode);

      container.innerHTML = `
        <div class="section-header" style="margin-top:0;">
          <div>
            <h1 class="section-title" style="font-size:1.55rem;">${t('navAllExams')}</h1>
            <p class="section-desc">${t('lastUpdatedLabel')} ${escapeHtml(ExamDB.formatISTDate(ExamDB.lastUpdated))}</p>
          </div>
        </div>
        <div class="filter-bar">
          <input type="search" id="all-exams-search" class="input-field" style="flex:1;min-width:220px;" value="${escapeHtml(query)}" placeholder="${t('searchPlaceholder')}" />
          <select id="all-cat-filter" class="input-field" aria-label="Filter by category">
            <option value="all">${t('navCategories')} (${EXAM_CATEGORIES.length})</option>
            ${EXAM_CATEGORIES.map((c) => `<option value="${c.id}" ${catFilter === c.id ? 'selected' : ''}>${escapeHtml(ExamDB.getCategoryName(c))}</option>`).join('')}
          </select>
          <select id="all-status-filter" class="input-field" aria-label="Filter by status">
            <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>${t('allStatuses')}</option>
            <option value="official" ${statusFilter === 'official' ? 'selected' : ''}>${t('statusOfficial')}</option>
            <option value="tentative" ${statusFilter === 'tentative' ? 'selected' : ''}>${t('statusTentative')}</option>
            <option value="date-awaited" ${statusFilter === 'date-awaited' ? 'selected' : ''}>${t('statusDateAwaited')}</option>
            <option value="postponed" ${statusFilter === 'postponed' ? 'selected' : ''}>${t('statusPostponed')}</option>
          </select>
          <select id="all-sort-select" class="input-field" aria-label="Sort exams">
            <option value="priority" ${sortMode === 'priority' ? 'selected' : ''}>${t('sortPriority')}</option>
            <option value="soonest" ${sortMode === 'soonest' ? 'selected' : ''}>${t('sortSoonest')}</option>
            <option value="name" ${sortMode === 'name' ? 'selected' : ''}>${t('sortName')}</option>
          </select>
        </div>
        ${list.length ? `<div class="exam-grid">${list.map(renderExamCard).join('')}</div>` : `
          <div class="empty-state">
            <h3>${t('noSearchResults')}</h3>
            <p>${t('noSearchHint')}</p>
          </div>
        `}
      `;

      const searchEl = container.querySelector('#all-exams-search');
      searchEl?.addEventListener('input', (e) => {
        query = e.target.value;
        draw();
        const nextInput = container.querySelector('#all-exams-search');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(query.length, query.length);
        }
      });
      container.querySelector('#all-cat-filter')?.addEventListener('change', (e) => { catFilter = e.target.value; draw(); });
      container.querySelector('#all-status-filter')?.addEventListener('change', (e) => { statusFilter = e.target.value; draw(); });
      container.querySelector('#all-sort-select')?.addEventListener('change', (e) => { sortMode = e.target.value; draw(); });
      bindExamCardEvents(container);
    };

    draw();
  },

  examDetail(container, examId) {
    const exam = ExamDB.getById(examId);
    if (!exam) {
      this.notFound(container);
      return;
    }

    const badge = ExamDB.getStatusBadgeMeta(exam);
    const effective = ExamDB.getEffectiveStatus(exam);
    const hasLiveTimer = Boolean(exam.date) && effective !== 'postponed' && effective !== 'cancelled' && effective !== 'date-awaited';
    const isFav = Store.isFavourite(exam.id);
    const showMascot = Store.getSettings().mascotEnabled;
    const cat = exam.category ? ExamDB.getCategory(exam.category) : null;
    const soundOn = Store.getSettings().soundEnabled;

    container.innerHTML = `
      <div class="countdown-topbar">
        <button type="button" class="btn btn-secondary btn-sm" id="cd-back-btn">${icon('arrowLeft')} ${t('back')}</button>
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
          <button type="button" class="btn btn-secondary btn-sm" id="cd-fav-btn">
            ${isFav ? icon('heartFilled') : icon('heart')} ${isFav ? t('savedFavourite') : t('addFavourite')}
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="cd-music-btn">${icon('music')} ${t('musicBreak')}</button>
        </div>
      </div>

      <div class="countdown-stage ${showMascot ? 'with-mascot' : ''}">
        <div>
          <section class="countdown-hero-card">
            <div class="countdown-badges">
              <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
              ${cat ? `<button type="button" class="filter-chip" data-nav="/category/${escapeHtml(cat.id)}">${escapeHtml(ExamDB.getCategoryName(cat))}</button>` : ''}
            </div>
            <h1 class="countdown-heading">${escapeHtml(ExamDB.getExamName(exam, true))}</h1>
            <p class="countdown-body-meta">${escapeHtml(ExamDB.getExamDescription(exam))}</p>

            ${hasLiveTimer ? `
              <div class="progress-track"><div class="progress-fill" id="cd-progress-fill"></div></div>
              <div class="progress-meta">
                <span>${t('progressJourney')}</span>
                <strong id="cd-progress-pct">0%</strong>
              </div>
              <div class="timer-grid" aria-live="off">
                <div class="digit-card"><span class="digit-value" id="cd-days">00</span><div class="digit-label">${t('days')}</div></div>
                <div class="digit-card"><span class="digit-value" id="cd-hours">00</span><div class="digit-label">${t('hours')}</div></div>
                <div class="digit-card"><span class="digit-value" id="cd-minutes">00</span><div class="digit-label">${t('minutes')}</div></div>
                <div class="digit-card"><span class="digit-value" id="cd-seconds">00</span><div class="digit-label">${t('seconds')}</div></div>
              </div>
              <div id="cd-expired-banner" class="status-callout" style="display:${effective === 'expired' ? 'block' : 'none'};">
                <div class="status-callout-title">${t('expiredHeadline')}</div>
                <div class="status-callout-text">${escapeHtml(ExamDB.getStatusNote(exam))}</div>
              </div>
            ` : `
              <div class="status-callout">
                <div class="status-callout-title">${effective === 'postponed' ? t('postponedHeadline') : t('dateAwaitedHeadline')}</div>
                <div class="status-callout-text">${escapeHtml(ExamDB.getStatusNote(exam) || exam.expectedWindow || '')}</div>
              </div>
            `}

            ${hasLiveTimer && ExamDB.getStatusNote(exam) ? `
              <div class="status-callout" style="margin-top:0.5rem;">
                <div class="status-callout-text">${escapeHtml(ExamDB.getStatusNote(exam))}</div>
              </div>
            ` : ''}

            <div class="action-toolbar">
              ${hasLiveTimer ? `<button type="button" class="btn btn-secondary btn-sm" id="cd-remind-btn">${icon('bell')} ${t('remindMe')}</button>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" id="cd-share-btn">${icon('share')} ${t('share')}</button>
              <button type="button" class="btn btn-secondary btn-sm" id="cd-copy-btn">${t('copyLink')}</button>
              ${hasLiveTimer ? `<button type="button" class="btn btn-secondary btn-sm" id="cd-sound-btn">${icon('volume')} ${soundOn ? t('soundOn') : t('soundOff')}</button>` : ''}
              <button type="button" class="btn btn-secondary btn-sm" id="cd-fs-btn">${icon('expand')} ${t('fullscreen')}</button>
            </div>

            <div class="info-grid">
              <div class="info-tile">
                <div class="info-tile-label">${t('examDateLabel')}</div>
                <div class="info-tile-value">${escapeHtml(exam.date ? ExamDB.formatISTDate(exam.date, true) : (exam.expectedWindow || t('statusDateAwaited')))}</div>
              </div>
              <div class="info-tile">
                <div class="info-tile-label">${t('dayOfWeekLabel')}</div>
                <div class="info-tile-value">${escapeHtml(exam.date ? ExamDB.formatISTWeekday(exam.date) : '—')}</div>
              </div>
              <div class="info-tile">
                <div class="info-tile-label">${t('conductingBodyLabel')}</div>
                <div class="info-tile-value">${escapeHtml(exam.conductingBody || (exam.custom ? t('navMyCountdown') : '—'))}</div>
              </div>
              <div class="info-tile">
                <div class="info-tile-label">${t('lastVerifiedLabel')}</div>
                <div class="info-tile-value">${escapeHtml(exam.lastVerified || ExamDB.formatISTDate(ExamDB.lastUpdated))}</div>
              </div>
            </div>
          </section>

          ${exam.officialSourceUrl ? `
            <section class="exam-links-card">
              <h2 class="section-title" style="font-size:1.05rem;">${t('officialLinksTitle')}</h2>
              <div class="official-links-grid">
                <a class="btn btn-primary btn-sm" href="${escapeHtml(exam.officialSourceUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('officialPortal')}</a>
                ${exam.notificationUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.notificationUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('notificationLink')}</a>` : ''}
                ${exam.syllabusUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.syllabusUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('syllabusLink')}</a>` : ''}
                ${exam.admitCardUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.admitCardUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('admitCardLink')}</a>` : ''}
                ${exam.resultUrl ? `<a class="btn btn-secondary btn-sm" href="${escapeHtml(exam.resultUrl)}" target="_blank" rel="noopener noreferrer">${icon('external')} ${t('resultLink')}</a>` : ''}
              </div>
            </section>
          ` : ''}
        </div>

        ${showMascot ? `<aside id="mascot-stage" class="mascot-stage-wrap"></aside>` : ''}
      </div>
    `;

    container.querySelector('#cd-back-btn')?.addEventListener('click', () => {
      if (window.history.length > 1) window.history.back();
      else Router.navigate('/');
    });
    container.querySelector('#cd-fav-btn')?.addEventListener('click', (e) => {
      const nowSaved = Store.toggleFavourite(exam.id);
      e.currentTarget.innerHTML = `${nowSaved ? icon('heartFilled') : icon('heart')} ${nowSaved ? t('savedFavourite') : t('addFavourite')}`;
      showToast(nowSaved ? t('toastSavedFav') : t('toastRemovedFav'));
    });
    container.querySelector('#cd-music-btn')?.addEventListener('click', () => MusicPanel.open());
    container.querySelector('#cd-remind-btn')?.addEventListener('click', () => CountdownController.setupReminder(exam));
    container.querySelector('#cd-share-btn')?.addEventListener('click', () => CountdownController.shareExam(exam));
    container.querySelector('#cd-copy-btn')?.addEventListener('click', async () => {
      const url = `${window.location.origin}/exam/${encodeURIComponent(exam.id)}`;
      try {
        await navigator.clipboard.writeText(url);
        showToast(t('toastCopied'));
      } catch {
        showToast(url);
      }
    });
    container.querySelector('#cd-sound-btn')?.addEventListener('click', (e) => {
      const next = !Store.getSettings().soundEnabled;
      Store.updateSettings({ soundEnabled: next });
      e.currentTarget.innerHTML = `${icon('volume')} ${next ? t('soundOn') : t('soundOff')}`;
    });
    container.querySelector('#cd-fs-btn')?.addEventListener('click', () => CountdownController.toggleFullscreen());

    if (hasLiveTimer) CountdownController.start(exam);
    if (showMascot) MascotSystem.mount(container.querySelector('#mascot-stage'));
  },

  myCountdown(container) {
    let editingId = null;

    const draw = () => {
      const customs = Store.getCustoms();
      const editingItem = editingId ? customs.find((c) => c.id === editingId) : null;
      const tomorrow = new Date(Date.now() + 86400000);
      const defaultDate = editingItem && editingItem.date ? editingItem.date.slice(0, 10) : tomorrow.toISOString().slice(0, 10);
      const defaultTime = editingItem && editingItem.date ? editingItem.date.slice(11, 16) : '09:00';

      container.innerHTML = `
        <div class="section-header" style="margin-top:0;">
          <div>
            <h1 class="section-title" style="font-size:1.55rem;">${t('customTitle')}</h1>
            <p class="section-desc">${t('customDesc')}</p>
          </div>
        </div>

        <section class="panel-card">
          <h2 class="section-title" style="font-size:1.08rem;margin-bottom:1rem;">${t('customFormHeading')}</h2>
          <form id="custom-countdown-form" class="form-grid">
            <div>
              <label class="form-label" for="custom-name-input">${t('customNameLabel')}</label>
              <input id="custom-name-input" class="input-field" style="width:100%;" type="text" maxlength="60" required value="${escapeHtml(editingItem ? editingItem.shortName : '')}" placeholder="${t('customNamePlaceholder')}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label class="form-label" for="custom-date-input">${t('customDateLabel')}</label>
                <input id="custom-date-input" class="input-field" style="width:100%;" type="date" required value="${escapeHtml(defaultDate)}" />
              </div>
              <div>
                <label class="form-label" for="custom-time-input">${t('customTimeLabel')}</label>
                <input id="custom-time-input" class="input-field" style="width:100%;" type="time" required value="${escapeHtml(defaultTime)}" />
              </div>
            </div>
            <div>
              <label class="form-label" for="custom-note-input">${t('customNoteLabel')}</label>
              <input id="custom-note-input" class="input-field" style="width:100%;" type="text" maxlength="120" value="${escapeHtml(editingItem ? (editingItem.note || '') : '')}" placeholder="${t('customNotePlaceholder')}" />
            </div>
            <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
              <button type="submit" class="btn btn-primary">${icon('plus')} ${editingItem ? t('updateCountdown') : t('saveCountdown')}</button>
              ${editingItem ? `<button type="button" class="btn btn-secondary" id="cancel-edit-btn">${t('cancelEdit')}</button>` : ''}
            </div>
          </form>
        </section>

        ${customs.length ? `
          <div class="exam-grid">
            ${customs.map((c) => `
              <article class="exam-card" data-open-exam="${escapeHtml(c.id)}" tabindex="0" role="button">
                <div>
                  <h3 class="exam-card-title">${escapeHtml(c.shortName)}</h3>
                  <p class="exam-card-sub">${escapeHtml(ExamDB.formatISTDate(c.date, true))}</p>
                  ${c.note ? `<p class="exam-card-sub" style="margin-top:0.35rem;">${escapeHtml(c.note)}</p>` : ''}
                </div>
                <div class="exam-card-foot">
                  <span class="status-badge status-official">${ExamDB.daysRemaining(c.date)} ${t('daysLeft')}</span>
                  <div style="display:flex;gap:0.4rem;">
                    <button type="button" class="icon-btn" data-edit-custom="${escapeHtml(c.id)}" title="${t('edit')}">${icon('edit')}</button>
                    <button type="button" class="icon-btn" data-del-custom="${escapeHtml(c.id)}" title="${t('delete')}">${icon('trash')}</button>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="category-icon" style="margin:0 auto;">${icon('clock')}</div>
            <h3>${t('noCustomYet')}</h3>
            <p>${t('noCustomDesc')}</p>
          </div>
        `}
      `;

      container.querySelector('#custom-countdown-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#custom-name-input').value.trim();
        const dateVal = container.querySelector('#custom-date-input').value;
        const timeVal = container.querySelector('#custom-time-input').value || '09:00';
        const note = container.querySelector('#custom-note-input').value.trim();
        const iso = `${dateVal}T${timeVal}:00+05:30`;
        if (!name || Number.isNaN(Date.parse(iso)) || Date.parse(iso) <= Date.now()) {
          showToast(t('toastInvalidDate'));
          return;
        }
        const item = {
          id: editingId || `custom-${Date.now()}`,
          shortName: name,
          fullName: name,
          date: iso,
          status: 'official',
          note,
          custom: true
        };
        Store.saveCustom(item);
        showToast(t('toastCustomSaved'));
        editingId = null;
        Router.navigate(`/exam/${encodeURIComponent(item.id)}`);
      });

      container.querySelector('#cancel-edit-btn')?.addEventListener('click', () => {
        editingId = null;
        draw();
      });

      container.querySelectorAll('[data-edit-custom]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          editingId = btn.getAttribute('data-edit-custom');
          draw();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });

      container.querySelectorAll('[data-del-custom]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          Store.deleteCustom(btn.getAttribute('data-del-custom'));
          showToast(t('toastCustomDeleted'));
          draw();
        });
      });

      bindExamCardEvents(container);
    };

    draw();
  },

  favourites(container) {
    const items = Store.favourites.map((id) => ExamDB.getById(id)).filter(Boolean);
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">${t('favouritesTitle')}</h1>
          <p class="section-desc">${t('favouritesDesc')}</p>
        </div>
      </div>
      ${items.length ? `<div class="exam-grid">${items.map(renderExamCard).join('')}</div>` : `
        <div class="empty-state">
          <div class="category-icon" style="margin:0 auto;">${icon('heart')}</div>
          <h3>${t('noFavouritesYet')}</h3>
          <p>${t('noFavouritesDesc')}</p>
          <button type="button" class="btn btn-primary" data-nav="/categories">${t('browseCategories')}</button>
        </div>
      `}
    `;
    bindExamCardEvents(container);
  },

  about(container) {
    const portals = [
      { name: 'National Testing Agency (NTA)', url: 'https://nta.ac.in/' },
      { name: 'JEE Main Official Portal', url: 'https://jeemain.nta.nic.in/' },
      { name: 'NEET UG Official Portal', url: 'https://neet.nta.nic.in/' },
      { name: 'UPSC Official Website', url: 'https://www.upsc.gov.in/' },
      { name: 'SSC Official Website', url: 'https://ssc.gov.in/' },
      { name: 'CBSE Official Website', url: 'https://www.cbse.gov.in/' },
      { name: 'RBSE Rajasthan Board', url: 'https://rajeduboard.rajasthan.gov.in/' },
      { name: 'RPSC Rajasthan', url: 'https://rpsc.rajasthan.gov.in/' },
      { name: 'RSSB Rajasthan', url: 'https://rssb.rajasthan.gov.in/' },
      { name: 'IBPS Banking Portal', url: 'https://www.ibps.in/' }
    ];

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">${t('aboutTitle')}</h1>
          <p class="section-desc">${t('aboutSubtitle')}</p>
        </div>
      </div>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.1rem;margin-bottom:0.5rem;">${t('aboutMissionTitle')}</h2>
        <p style="color:var(--text-secondary);font-size:0.93rem;">${t('aboutMissionText')}</p>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.1rem;margin-bottom:0.85rem;">${t('usefulLinksTitle')}</h2>
        <div class="official-links-grid">
          ${portals.map((p) => `<a class="btn btn-secondary btn-sm" href="${p.url}" target="_blank" rel="noopener noreferrer">${icon('external')} ${p.name}</a>`).join('')}
        </div>
      </section>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1.1rem;margin-bottom:0.45rem;">${t('feedbackTitle')}</h2>
        <p style="color:var(--text-secondary);font-size:0.92rem;margin-bottom:0.95rem;">${t('feedbackText')}</p>
        <a href="https://t.me/The_Sk08" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          ${icon('external')} Telegram: @The_Sk08
        </a>
      </section>
    `;
  },

  settings(container) {
    const s = Store.getSettings();
    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">${t('settingsTitle')}</h1>
          <p class="section-desc">${t('settingsDesc')}</p>
        </div>
      </div>

      <section class="panel-card">
        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingTheme')}</div>
            <div class="setting-desc">${t('settingThemeDesc')}</div>
          </div>
          <div style="display:flex;gap:0.4rem;">
            <button type="button" class="btn btn-sm ${s.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}" data-set-theme="dark">${t('themeDark')}</button>
            <button type="button" class="btn btn-sm ${s.theme === 'light' ? 'btn-primary' : 'btn-secondary'}" data-set-theme="light">${t('themeLight')}</button>
          </div>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingLang')}</div>
            <div class="setting-desc">${t('settingLangDesc')}</div>
          </div>
          <div style="display:flex;gap:0.4rem;">
            <button type="button" class="btn btn-sm ${s.lang === 'en' ? 'btn-primary' : 'btn-secondary'}" data-set-lang="en">English</button>
            <button type="button" class="btn btn-sm ${s.lang === 'hi' ? 'btn-primary' : 'btn-secondary'}" data-set-lang="hi">हिंदी</button>
          </div>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingBg')}</div>
            <div class="setting-desc">${t('settingBgDesc')}</div>
          </div>
          <label class="switch"><input type="checkbox" id="set-bg-toggle" ${s.bgEnabled ? 'checked' : ''} /><span class="switch-slider"></span></label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingBgPreset')}</div>
          </div>
          <select id="set-bg-preset" class="input-field">
            <option value="auto" ${s.bgPreset === 'auto' ? 'selected' : ''}>Auto Rotate</option>
            <option value="constellation" ${s.bgPreset === 'constellation' ? 'selected' : ''}>Constellation</option>
            <option value="aurora" ${s.bgPreset === 'aurora' ? 'selected' : ''}>Aurora</option>
            <option value="stardust" ${s.bgPreset === 'stardust' ? 'selected' : ''}>Stardust</option>
            <option value="waves" ${s.bgPreset === 'waves' ? 'selected' : ''}>Waves</option>
          </select>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingMascot')}</div>
            <div class="setting-desc">${t('settingMascotDesc')}</div>
          </div>
          <label class="switch"><input type="checkbox" id="set-mascot-toggle" ${s.mascotEnabled ? 'checked' : ''} /><span class="switch-slider"></span></label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingMusicCooldown')}</div>
            <div class="setting-desc">${t('settingMusicCooldownDesc')}</div>
          </div>
          <select id="set-cooldown" class="input-field">
            ${[5, 15, 30, 60].map((m) => `<option value="${m}" ${Number(s.musicCooldownMinutes) === m ? 'selected' : ''}>${m} min</option>`).join('')}
          </select>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingReducedMotion')}</div>
            <div class="setting-desc">${t('settingReducedMotionDesc')}</div>
          </div>
          <label class="switch"><input type="checkbox" id="set-motion-toggle" ${s.reducedMotion ? 'checked' : ''} /><span class="switch-slider"></span></label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingSound')}</div>
            <div class="setting-desc">${t('settingSoundDesc')}</div>
          </div>
          <label class="switch"><input type="checkbox" id="set-sound-toggle" ${s.soundEnabled ? 'checked' : ''} /><span class="switch-slider"></span></label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingFullscreen')}</div>
            <div class="setting-desc">${t('settingFullscreenDesc')}</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="set-fs-btn">${icon('expand')} ${t('fullscreen')}</button>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingReset')}</div>
            <div class="setting-desc">${t('settingResetDesc')}</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="set-reset-btn">${t('settingReset')}</button>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-title">${t('settingClearData')}</div>
            <div class="setting-desc">${t('settingClearDataDesc')}</div>
          </div>
          <button type="button" class="btn btn-danger btn-sm" id="set-clear-btn">${t('settingClearData')}</button>
        </div>
      </section>
    `;

    container.querySelectorAll('[data-set-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        Store.updateSettings({ theme: btn.getAttribute('data-set-theme') });
        renderShellChrome();
        Router.render();
      });
    });
    container.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        Store.updateSettings({ lang: btn.getAttribute('data-set-lang') });
        renderShellChrome();
        Router.render();
      });
    });
    container.querySelector('#set-bg-toggle')?.addEventListener('change', (e) => {
      Store.updateSettings({ bgEnabled: e.target.checked });
    });
    container.querySelector('#set-bg-preset')?.addEventListener('change', (e) => {
      Store.updateSettings({ bgPreset: e.target.value });
    });
    container.querySelector('#set-mascot-toggle')?.addEventListener('change', (e) => {
      Store.updateSettings({ mascotEnabled: e.target.checked });
    });
    container.querySelector('#set-cooldown')?.addEventListener('change', (e) => {
      Store.updateSettings({ musicCooldownMinutes: Number(e.target.value) });
    });
    container.querySelector('#set-motion-toggle')?.addEventListener('change', (e) => {
      Store.updateSettings({ reducedMotion: e.target.checked });
    });
    container.querySelector('#set-sound-toggle')?.addEventListener('change', (e) => {
      Store.updateSettings({ soundEnabled: e.target.checked });
    });
    container.querySelector('#set-fs-btn')?.addEventListener('click', () => CountdownController.toggleFullscreen());
    container.querySelector('#set-reset-btn')?.addEventListener('click', () => {
      Store.resetSettings();
      renderShellChrome();
      Router.render();
      showToast(t('toastSettingsReset'));
    });
    container.querySelector('#set-clear-btn')?.addEventListener('click', () => {
      Store.clearSavedData();
      showToast(t('toastDataCleared'));
    });
  },

  notFound(container) {
    container.innerHTML = `
      <div class="empty-state" style="margin-top:2rem;">
        <div style="font-family:var(--font-mono);font-size:3rem;font-weight:800;color:var(--accent-light);">404</div>
        <h3>${t('notFoundTitle')}</h3>
        <p>${t('notFoundDesc')}</p>
        <button type="button" class="btn btn-primary" data-nav="/">${t('goHome')}</button>
      </div>
    `;
  }
};


// ===== main.js =====
// Application Shell, Instant Search Modal, SPA Router & Bootstrap
let toastTimer = null;
let deferredInstallPrompt = null;

function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

const SearchModal = {
  isOpen: false,
  selectedIdx: 0,

  open() {
    const modal = document.getElementById('search-modal');
    if (!modal) return;
    this.isOpen = true;
    this.selectedIdx = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    this.render('');
    const input = document.getElementById('modal-search-input');
    if (input) input.focus();
  },

  close() {
    const modal = document.getElementById('search-modal');
    if (!modal) return;
    this.isOpen = false;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  },

  render(query) {
    const dialog = document.getElementById('search-dialog');
    if (!dialog) return;
    const results = ExamDB.search(query).slice(0, 12);
    const recents = Store.recentSearches;

    dialog.innerHTML = `
      <div class="search-input-row">
        ${icon('search')}
        <input id="modal-search-input" type="search" value="${escapeHtml(query)}" placeholder="${t('searchPlaceholder')}" autocomplete="off" />
        ${query ? `<button type="button" class="btn btn-secondary btn-sm" id="modal-clear-btn">${t('clearSearch')}</button>` : ''}
        <button type="button" class="icon-btn" id="modal-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="search-results">
        ${!query && recents.length ? `
          <div style="padding:0.25rem 0.5rem 0.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.45rem;">
              <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">${t('recentSearches')}</span>
              <button type="button" class="filter-chip" id="clear-recents-btn" style="padding:0.18rem 0.5rem;font-size:0.7rem;">${t('clearSearch')}</button>
            </div>
            <div class="chip-row">
              ${recents.map((r) => `<button type="button" class="filter-chip" data-recent-q="${escapeHtml(r)}">${escapeHtml(r)}</button>`).join('')}
            </div>
          </div>
        ` : ''}
        ${results.length ? results.map((exam, idx) => {
          const badge = ExamDB.getStatusBadgeMeta(exam);
          return `
            <button type="button" class="search-result-item ${idx === this.selectedIdx ? 'selected' : ''}" data-pick-exam="${escapeHtml(exam.id)}">
              <div>
                <div style="font-weight:700;font-size:0.93rem;">${escapeHtml(ExamDB.getExamName(exam))}</div>
                <div style="font-size:0.78rem;color:var(--text-secondary);">${escapeHtml(exam.conductingBody || '')}</div>
              </div>
              <span class="status-badge ${badge.cls}">${escapeHtml(badge.label)}</span>
            </button>
          `;
        }).join('') : `
          <div style="padding:2rem 1rem;text-align:center;">
            <div style="font-weight:700;margin-bottom:0.25rem;">${t('noSearchResults')}</div>
            <div style="font-size:0.84rem;color:var(--text-secondary);">${t('noSearchHint')}</div>
          </div>
        `}
      </div>
    `;

    const input = dialog.querySelector('#modal-search-input');
    input?.addEventListener('input', (e) => {
      this.selectedIdx = 0;
      const val = e.target.value;
      this.render(val);
      const next = document.getElementById('modal-search-input');
      if (next) {
        next.focus();
        next.setSelectionRange(val.length, val.length);
      }
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && results.length) {
        e.preventDefault();
        this.selectedIdx = (this.selectedIdx + 1) % results.length;
        this.render(input.value);
        document.getElementById('modal-search-input')?.focus();
      } else if (e.key === 'ArrowUp' && results.length) {
        e.preventDefault();
        this.selectedIdx = (this.selectedIdx - 1 + results.length) % results.length;
        this.render(input.value);
        document.getElementById('modal-search-input')?.focus();
      } else if (e.key === 'Enter' && results[this.selectedIdx]) {
        e.preventDefault();
        if (input.value.trim()) Store.addRecentSearch(input.value.trim());
        this.close();
        Router.navigate(`/exam/${encodeURIComponent(results[this.selectedIdx].id)}`);
      }
    });

    dialog.querySelector('#modal-clear-btn')?.addEventListener('click', () => {
      this.render('');
      document.getElementById('modal-search-input')?.focus();
    });
    dialog.querySelector('#modal-close-btn')?.addEventListener('click', () => this.close());
    dialog.querySelector('#clear-recents-btn')?.addEventListener('click', () => {
      Store.clearRecentSearches();
      this.render('');
    });
    dialog.querySelectorAll('[data-recent-q]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.render(btn.getAttribute('data-recent-q'));
        document.getElementById('modal-search-input')?.focus();
      });
    });
    dialog.querySelectorAll('[data-pick-exam]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (query.trim()) Store.addRecentSearch(query.trim());
        this.close();
        Router.navigate(`/exam/${encodeURIComponent(btn.getAttribute('data-pick-exam'))}`);
      });
    });
  }
};

const Router = {
  currentPath: '/',

  navigate(path, push = true) {
    const clean = path || '/';
    if (push && window.location.pathname !== clean) {
      window.history.pushState({}, '', clean);
    }
    this.currentPath = clean;
    this.render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  render() {
    CountdownController.stop();
    MascotSystem.unmount();
    const main = document.getElementById('main-content');
    if (!main) return;

    const path = window.location.pathname || '/';
    this.currentPath = path;

    if (path === '/' || path === '/index.html') {
      Views.home(main);
    } else if (path === '/categories') {
      Views.categories(main);
    } else if (path.startsWith('/category/')) {
      const catId = decodeURIComponent(path.slice('/category/'.length));
      Views.categoryDetail(main, catId);
    } else if (path === '/exams') {
      Views.allExams(main);
    } else if (path.startsWith('/exam/')) {
      const examId = decodeURIComponent(path.slice('/exam/'.length));
      Views.examDetail(main, examId);
    } else if (path === '/my-countdown') {
      Views.myCountdown(main);
    } else if (path === '/favourites') {
      Views.favourites(main);
    } else if (path === '/about') {
      Views.about(main);
    } else if (path === '/settings') {
      Views.settings(main);
    } else {
      Views.notFound(main);
    }

    main.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', () => Router.navigate(el.getAttribute('data-nav')));
    });

    updateActiveNavLinks(path);
  }
};

function updateActiveNavLinks(path) {
  document.querySelectorAll('[data-route-link]').forEach((btn) => {
    const target = btn.getAttribute('data-route-link');
    const isMatch = target === '/'
      ? (path === '/' || path === '/index.html')
      : path === target || (target === '/categories' && path.startsWith('/category/'));
    btn.classList.toggle('active', isMatch);
  });
}

function renderShellChrome() {
  const s = Store.getSettings();
  const header = document.getElementById('top-header');
  const footer = document.getElementById('site-footer');
  const mobileNav = document.getElementById('mobile-nav');

  if (header) {
    header.innerHTML = `
      <div class="header-inner">
        <button type="button" class="brand-btn" data-route-link="/">
          <span class="brand-mark">
            <svg viewBox="0 0 128 128" fill="none" width="22" height="22">
              <path d="M40 28H88M40 100H88" stroke="#818cf8" stroke-width="8" stroke-linecap="round"/>
              <path d="M46 28V43C46 52 56 59 64 64C72 59 82 52 82 43V28" stroke="currentColor" stroke-width="6"/>
              <path d="M46 100V85C46 76 56 69 64 64C72 69 82 76 82 85V100" stroke="currentColor" stroke-width="6"/>
            </svg>
          </span>
          <span class="brand-name">${t('brandName')}<span class="brand-version">2.0</span></span>
        </button>

        <nav class="desktop-nav" aria-label="Main Navigation">
          <button type="button" class="nav-link" data-route-link="/">${t('navHome')}</button>
          <button type="button" class="nav-link" data-route-link="/categories">${t('navCategories')}</button>
          <button type="button" class="nav-link" data-route-link="/exams">${t('navAllExams')}</button>
          <button type="button" class="nav-link" data-route-link="/my-countdown">${t('navMyCountdown')}</button>
          <button type="button" class="nav-link" data-route-link="/favourites">${t('navFavourites')}</button>
          <button type="button" class="nav-link" data-route-link="/about">${t('navAbout')}</button>
          <button type="button" class="nav-link" data-route-link="/settings">${t('navSettings')}</button>
        </nav>

        <div class="header-controls">
          <button type="button" class="icon-btn search-trigger-btn" id="hdr-search-btn" aria-label="${t('searchTitle')}" title="${t('searchTitle')}">
            ${icon('search')} <span class="search-kbd">Ctrl K</span>
          </button>
          <button type="button" class="icon-btn" id="hdr-music-btn" aria-label="${t('musicBreak')}" title="${t('musicBreak')}">
            ${icon('music')}
          </button>
          <button type="button" class="icon-btn" id="hdr-lang-btn" title="${t('settingLang')}">
            ${s.lang === 'hi' ? 'EN' : 'हिं'}
          </button>
          <button type="button" class="icon-btn" id="hdr-theme-btn" aria-label="${t('settingTheme')}" title="${t('settingTheme')}">
            ${s.theme === 'dark' ? icon('sun') : icon('moon')}
          </button>
        </div>
      </div>
    `;
  }

  if (mobileNav) {
    mobileNav.innerHTML = `
      <button type="button" class="mobile-nav-btn" data-route-link="/">${icon('home')}<span>${t('navHome')}</span></button>
      <button type="button" class="mobile-nav-btn" data-route-link="/categories">${icon('grid')}<span>${t('navCategories')}</span></button>
      <button type="button" class="mobile-nav-btn" data-route-link="/my-countdown">${icon('clock')}<span>${t('navMyCountdown')}</span></button>
      <button type="button" class="mobile-nav-btn" data-route-link="/favourites">${icon('heart')}<span>${t('navFavourites')}</span></button>
      <button type="button" class="mobile-nav-btn" data-route-link="/settings">${icon('settings')}<span>${t('navSettings')}</span></button>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-brand-block">
          <div class="footer-title">${t('brandName')} 2.0</div>
          <div class="footer-tagline">${t('tagline')}</div>
        </div>
        <div class="footer-meta">
          ${deferredInstallPrompt ? `<button type="button" class="btn btn-secondary btn-sm" id="pwa-install-btn">${t('installPwa')}</button>` : ''}
          <button type="button" class="btn btn-secondary btn-sm" data-route-link="/about">${t('navAbout')}</button>
          <a href="https://t.me/The_Sk08" target="_blank" rel="noopener noreferrer" class="creator-pill">
            <span>${t('madeWithLove')} @The_Sk08</span>
          </a>
        </div>
      </div>
    `;
  }

  document.querySelectorAll('[data-route-link]').forEach((btn) => {
    btn.addEventListener('click', () => Router.navigate(btn.getAttribute('data-route-link')));
  });

  document.getElementById('hdr-search-btn')?.addEventListener('click', () => SearchModal.open());
  document.getElementById('hdr-music-btn')?.addEventListener('click', () => MusicPanel.toggle());
  document.getElementById('hdr-lang-btn')?.addEventListener('click', () => {
    Store.updateSettings({ lang: Store.getSettings().lang === 'en' ? 'hi' : 'en' });
    renderShellChrome();
    if (MusicPanel.isOpen) MusicPanel.render();
    Router.render();
  });
  document.getElementById('hdr-theme-btn')?.addEventListener('click', () => {
    Store.updateSettings({ theme: Store.getSettings().theme === 'dark' ? 'light' : 'dark' });
    renderShellChrome();
  });
  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    renderShellChrome();
  });

  updateActiveNavLinks(window.location.pathname || '/');
}

async function bootstrap() {
  Store.init();
  BackgroundEngine.init();
  MusicVisuals.init();
  MusicPanel.init();
  renderShellChrome();

  await ExamDB.load();
  Router.render();
  CountdownController.checkDueReminders();

  // Hide splash loader smoothly
  const loader = document.getElementById('app-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 180);
  }

  // Global keyboard shortcuts (Ctrl/Cmd + K for search, Esc to close modals/fullscreen)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (SearchModal.isOpen) SearchModal.close();
      else SearchModal.open();
    } else if (e.key === 'Escape') {
      if (SearchModal.isOpen) SearchModal.close();
      else if (document.body.classList.contains('fullscreen-mode')) CountdownController.exitFullscreen();
    }
  });

  document.getElementById('search-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'search-modal') SearchModal.close();
  });

  document.getElementById('exit-fs-btn')?.addEventListener('click', () => CountdownController.exitFullscreen());
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && document.body.classList.contains('fullscreen-mode')) {
      CountdownController.exitFullscreen(true);
    }
  });

  window.addEventListener('popstate', () => Router.render());

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    renderShellChrome();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);

})();
