export interface IChatbotLanguage {
  code: string
  /** Shown on the language button and in the language menu. */
  label: string
  /** English name of the language, sent as the telemetry subtype. */
  name: string
  native?: string
  isDefault?: boolean
}

export const CHATBOT_LANGUAGES: IChatbotLanguage[] = [
  { code: 'eng', label: 'English', name: 'English', isDefault: true },
  { code: 'hin', label: 'हिन्दी', name: 'Hindi', native: 'Hindi' },
  { code: 'gnd', label: 'Gondi', name: 'Gondi', native: 'गोंडी' },
  { code: 'sat', label: 'Santali', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'mun', label: 'Mundari', name: 'Mundari', native: 'मुंडारी' },
  { code: 'bhili', label: 'Bhili', name: 'Bhili', native: 'भीली' },
  { code: 'bettakuruba', label: 'Bettakuruba', name: 'Bettakuruba', native: 'ಬೆಟ್ಟ ಕುರುಬ' },
  { code: 'garo', label: 'Garo', name: 'Garo', native: 'A·chik' },
  { code: 'kokborok', label: 'Kokborok', name: 'Kokborok', native: 'Tripuri' },
  { code: 'koya', label: 'Koya', name: 'Koya', native: 'కోయ' },
  { code: 'kui', label: 'Kui', name: 'Kui', native: 'କୁଇ' },
]

export const CHATBOT_PLACEHOLDERS: { [code: string]: string } = {
  eng: 'Ask about schemes, scholarships, eligibility...',
  hin: 'योजनाओं, छात्रवृत्ति, पात्रता के बारे में पूछें...',
  gnd: 'योजना, छात्रवृत्ति बद्दल विचारा (Gondi)...',
  sat: 'ᱥᱠᱤᱢ, ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤ ᱢᱮ (Santali)...',
  mun: 'योजना, छात्रवृत्ति विषय रे कुलि पे (Mundari)...',
  bhili: 'योजना, छात्रवृत्ति बाबत पूछो (Bhili)...',
  bettakuruba: 'Ask in Bettakuruba...',
  garo: 'Skim-rang, scholarship-ni gimin singbo (Garo)...',
  kokborok: 'Hukum, scholarship ni bisingtwi swngdi (Kokborok)...',
  koya: 'పథకాలు, స్కాలర్‌షిప్‌ల గురించి అడగండి (Koya)...',
  kui: 'ଯୋଜନା, ବୃତ୍ତି ବିଷୟରେ ପଚାରନ୍ତୁ (Kui)...',
}

/** Browser speech-recognition locale for each chatbot language. */
export const CHATBOT_VOICE_LOCALES: { [code: string]: string } = {
  eng: 'en-IN',
  hin: 'hi-IN',
  gnd: 'hi-IN',
  sat: 'sat-IN',
  mun: 'hi-IN',
  bhili: 'hi-IN',
  bettakuruba: 'kn-IN',
  garo: 'en-IN',
  kokborok: 'bn-IN',
  koya: 'te-IN',
  kui: 'or-IN',
}

export const CHATBOT_SUGGESTIONS = [
  'What is PM-JANMAN?',
  'Apply for Scholarship',
  'FRA Claims Process',
]

/** Telemetry ids. INTERACT subtypes are `name` for the launcher and the language name for the menu. */
export const CHATBOT_TELEMETRY = {
  name: 'Jago',
  /** Launcher click (INTERACT) and the impression raised when the panel opens. */
  openId: 'chatbot-open',
  /** Language button click that opens the menu; subtype is the current language. */
  languageExistingId: 'language-change-existing',
  /** Language picked from the menu; subtype is the chosen language. */
  languageTargetId: 'language-change-target',
  /** `context.cdata` of the language button click. */
  languageChangeCdata: { id: 'language-change', type: '' },
}

/**
 * Chat backend used when the global-web form config has no `features.jagochatbot` block, or
 * leaves a field empty. Any value set there overrides the matching default.
 */
export const CHATBOT_API_DEFAULTS = {
  apiUrl: 'https://tribot.tribal.gov.in/api/v1',
  apiKey: 'mota-pub-tribot-api-key',
}

export const CHATBOT_ERROR_MESSAGE =
  'Sorry, I\'m unable to connect to the Ministry of Tribal Affairs AI server at the moment. Please try again later.'

/**
 * Images for the widget. Like other consumption components' icons, they are served from the
 * portal assets (sunbird-cb-portal-assets `client-assets/assets/icons/jagochatbot/`). The chat
 * background is set in jago-chatbot.component.scss.
 */
export const CHATBOT_ASSETS = {
  launcher: '/assets/icons/jagochatbot/launcher.jpg',
  avatar: '/assets/icons/jagochatbot/avatar.png',
}
