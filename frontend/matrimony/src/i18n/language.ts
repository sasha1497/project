export type AppLanguage = 'en' | 'ml' | 'ta' | 'te' | 'kn' | 'hi';

export const LANGUAGE_STORAGE_KEY = 'app_language';
export const LANGUAGE_EVENT_NAME = 'app-language-changed';

const FALLBACK_LANGUAGE: AppLanguage = 'en';

const STATE_LANGUAGE_MAP: Record<string, AppLanguage> = {
  Kerala: 'ml',
  'Tamil Nadu': 'ta',
  'Andhra Pradesh': 'te',
  Telangana: 'te',
  Karnataka: 'kn',
  'Jammu and Kashmir': 'hi',
  Punjab: 'hi',
  Manipur: 'hi',
  Gujarat: 'hi',
  Meghalaya: 'hi',
  'Arunachal Pradesh': 'hi',
  Assam: 'hi',
  Bihar: 'hi',
  Chhattisgarh: 'hi',
  Goa: 'hi',
  Haryana: 'hi',
  'Himachal Pradesh': 'hi',
  Jharkhand: 'hi',
  'Madhya Pradesh': 'hi',
  Maharashtra: 'hi',
  Mizoram: 'hi',
  Nagaland: 'hi',
  Odisha: 'hi',
  Rajasthan: 'hi',
  Sikkim: 'hi',
  Tripura: 'hi',
  'Uttar Pradesh': 'hi',
  Uttarakhand: 'hi',
  'West Bengal': 'hi',
  'Andaman and Nicobar Islands': 'hi',
  Chandigarh: 'hi',
  'Dadra and Nagar Haveli and Daman and Diu': 'hi',
  Delhi: 'hi',
  Ladakh: 'hi',
  Lakshadweep: 'ml',
  Puducherry: 'ta',
};

const PRIORITY_STATES = ['Kerala', 'Tamil Nadu','Andhra Pradesh', 'Telangana', 'Karnataka', 'Punjab', 'Manipur', 'Gujarat'];

export const STATE_LANGUAGE_OPTIONS = [
  ...PRIORITY_STATES,
  ...Object.keys(STATE_LANGUAGE_MAP)
    .filter((state) => !PRIORITY_STATES.includes(state))
    .sort((a, b) => a.localeCompare(b)),
];

export const getLanguageForState = (stateName: string): AppLanguage => {
  return STATE_LANGUAGE_MAP[stateName] || FALLBACK_LANGUAGE;
};

export const getStoredLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') {
    return FALLBACK_LANGUAGE;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage | null;
  return stored || FALLBACK_LANGUAGE;
};

export const setAppLanguage = (language: AppLanguage): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  window.dispatchEvent(
    new CustomEvent(LANGUAGE_EVENT_NAME, { detail: { language } }),
  );
};

export const persistLanguageFromState = (stateName: string): AppLanguage => {
  const language = getLanguageForState(stateName);
  setAppLanguage(language);
  return language;
};

type TranslationKey =
  | 'signup.welcome'
  | 'signup.selectState'
  | 'signup.next'
  | 'signup.forgotPassword'
  | 'multistep.selectState'
  | 'section.alreadyRegistered'
  | 'section.did'
  | 'section.registerNow'
  | 'section.dreamMarriage'
  | 'section.marriageQuote'
  | 'couples.title'
  | 'couples.morePhotos'
  | 'footer.services'
  | 'footer.profileCreation'
  | 'footer.matchmaking'
  | 'footer.personalizedMatches'
  | 'footer.premiumAssistance'
  | 'footer.pageLinks'
  | 'footer.about'
  | 'footer.rules'
  | 'footer.contact'
  | 'footer.conclusion'
  | 'footer.subscribe'
  | 'footer.getStarted'
  | 'navbar.signupWelcome'
  | 'navbar.welcomeBajol'
  | 'navbar.help'
  | 'banner.findYourMatch'
  | 'banner.card1.title'
  | 'banner.card1.text'
  | 'banner.card2.title'
  | 'banner.card2.text'
  | 'banner.card3.title'
  | 'banner.card3.text'
  | 'banner.downloadPrompt'
  | 'banner.appName'
  | 'banner.comingSoonTitle'
  | 'banner.comingSoonText'
  | 'banner.close'
  | 'banner.trustedMatrimonyLine'
  | 'banner.downloadCount'
  | 'banner.foundPartnerLine'
  | 'banner.trustedByLine'
  | 'banner.members'
  | 'banner.description'
  | 'banner.countryLine'
  | 'banner.trustedBy'
  | 'banner.bestMatches'
  | 'banner.verifiedProfiles'
  | 'banner.privacy'
  | 'plan.paymentReminder'
  | 'plan.reloadHint'
  | 'plan.reloadButton'
  | 'plan.gold.name'
  | 'plan.gold.description'
  | 'plan.feature.allGoldFeatures'
  | 'plan.feature.unlimitedViews'
  | 'plan.feature.sendInterests'
  | 'plan.feature.verifiedTrust'
  | 'plan.feature.priorityListing'
  | 'plan.feature.fullContact'
  | 'plan.feature.customerSupport'
  | 'plan.payNow'
  | 'plan.flashSaleText';
   

const TRANSLATIONS: Record<AppLanguage, Partial<Record<TranslationKey, string>>> = {
  en: {},
  ml: {
    'signup.welcome': 'സൈൻ ഇൻ 👋',
    'signup.selectState': 'സംസ്ഥാനം തിരഞ്ഞെടുക്കുക',
    'signup.next': 'അടുത്തത് →',
    'signup.forgotPassword': 'പാസ്‌വേഡ് മറന്നോ?',
    'multistep.selectState': 'സംസ്ഥാനം തിരഞ്ഞെടുക്കുക',
    'section.alreadyRegistered': 'നിങ്ങൾ ഇതിനകം BAJOL-ൽ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടോ?',
    'section.did': '🚀 ചെയ്തു',
    'section.registerNow': '✅ ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യൂ',
    'section.dreamMarriage': '💍 വിവാഹ സ്വപ്നം',
    'section.marriageQuote': 'സന്തോഷകരമായ വിവാഹത്തിലേക്കുള്ള മൂന്ന് വഴികൾ ഉണ്ട്: ഒന്നാമത് ദയ, രണ്ടാമത് ദയ, മൂന്നാമത് ദയ.',
    'couples.title': '❤️ എല്ലാ പ്രായത്തിനും അനുയോജ്യമായ ബന്ധങ്ങൾ | Bajol Matrimony ❤️',
    'couples.morePhotos': 'കൂടുതൽ ഫോട്ടോകൾ കാണാൻ ചിത്രത്തിൽ സ്പർശിക്കുക',
     'footer.services': 'മാട്രിമോണി സേവനങ്ങൾ',
    'footer.profileCreation': 'പ്രൊഫൈൽ സൃഷ്ടിക്കൽ',
    'footer.matchmaking': 'മാച്ച് മേക്കിംഗ് സേവനങ്ങൾ',
    'footer.personalizedMatches': 'വ്യക്തിഗത പൊരുത്തങ്ങൾ',
    'footer.premiumAssistance': 'പ്രീമിയം അംഗ സഹായം',
    'footer.pageLinks': 'പേജ് ലിങ്കുകൾ',
    'footer.about': 'ഞങ്ങളെ കുറിച്ച്',
    'footer.rules': 'നിയമങ്ങളും നിർദ്ദേശങ്ങളും',
    'footer.contact': 'ബന്ധപ്പെടുക',
    'footer.conclusion': 'സമാപനം',
    'footer.subscribe': 'സബ്സ്ക്രൈബ് ചെയ്യൂ',
    'footer.getStarted': 'തുടങ്ങൂ',
    'navbar.signupWelcome': 'സൈൻഅപ്പ് പേജിലേക്കു സ്വാഗതം',
    'navbar.welcomeBajol': 'BAJOL-ലേക്ക് സ്വാഗതം',
    'navbar.help': 'സഹായം',
    'banner.findYourMatch': '💖 നിങ്ങളുടെ പ്രത്യേക പങ്കാളിയെ കണ്ടെത്തൂ 💖',
     'banner.card1.title': '📝 സൈൻ അപ്പ്',
    'banner.card1.text': 'സൗജന്യമായി രജിസ്റ്റർ ചെയ്ത് നിങ്ങളുടെ മാട്രിമോണി പ്രൊഫൈൽ സൃഷ്ടിക്കൂ',

    'banner.card2.title': '💞 ബന്ധപ്പെടുക',
    'banner.card2.text': 'നിങ്ങളുടെ പറ്റിയ പങ്കാളിയെ കണ്ടെത്തി ഇഷ്ടമുള്ളവരുമായി ബന്ധപ്പെടുക',

    'banner.card3.title': '💬 സംസാരിക്കുക',
    'banner.card3.text': 'മെമ്പറായി സംഭാഷണം ആരംഭിച്ച് നിങ്ങളുടെ ജീവിതം മാറ്റൂ',
     'banner.appName': 'ബാജോൾ ആപ്പ്',
    'banner.comingSoonTitle': '🚀 ഉടൻ വരുന്നു',
    'banner.comingSoonText': 'ഞങ്ങളുടെ മൊബൈൽ ആപ്പ് ഉടൻ പുറത്തിറങ്ങുന്നു. കാത്തിരിക്കുക!',
    'banner.close': 'അടയ്ക്കുക',
    'banner.trustedMatrimonyLine': 'BajolMatrimony® - വിശ്വസനീയമായ മാട്രിമോണി, Bajol ആപ്പ്',
    'banner.downloadCount': '20,000+ ഡൗൺലോഡുകൾ',
    'banner.foundPartnerLine': 'BajolMatrimony വഴി ജീവിത പങ്കാളിയെ കണ്ടെത്തി!',
    'banner.trustedByLine': 'Bajol.com - വിശ്വസിക്കുന്നവർ',
    'banner.members': 'അംഗങ്ങൾ',
    'banner.description': 'Bajol.com ലോകത്തിലെ പ്രമുഖ മാട്രിമോണി സേവനങ്ങളിൽ ഒന്നാണ്. ആളുകൾക്ക് സന്തോഷം കണ്ടെത്താൻ സഹായിക്കുകയാണ് ഇതിന്റെ ലക്ഷ്യം. ഇന്ത്യൻ വധൂവരന്മാർ വിവാഹത്തിനായി കണ്ടുമുട്ടുന്ന രീതിയെ പുതുക്കി നിർവചിച്ച്, BajolMatrimony ആയിരക്കണക്കിന് ആളുകളുടെ ജീവിതത്തെ സ്പർശിച്ചിട്ടുണ്ട്.',
    'banner.countryLine': 'ഇന്ത്യ | USA | കാനഡ | UK | സിംഗപ്പൂർ | ഓസ്ട്രേലിയ | UAE | NRI മാട്രിമോണി',
    'banner.trustedBy': 'വിശ്വസിച്ചവർ',
    'banner.bestMatches': '💑 മികച്ച പൊരുത്തങ്ങൾ',
    'banner.verifiedProfiles': '✅ സ്ഥിരീകരിച്ച പ്രൊഫൈലുകൾ',
    'banner.privacy': '🔒 100% സ്വകാര്യത',
     'plan.paymentReminder': '🚀 പേയ്‌മെന്റ് കഴിഞ്ഞാൽ രജിസ്റ്റർ പേജിലേക്ക് പോയി നിങ്ങളുടെ ബയോ ഡാറ്റ പൂരിപ്പിക്കാം 🚀',
    'plan.reloadHint': '* പേയ്‌മെന്റ് കഴിഞ്ഞ ശേഷം Reload ബട്ടൺ അമർത്തുക *',
    'plan.reloadButton': '🔄 റീലോഡ്',
    'plan.gold.name': 'ഗോൾഡ്',
    'plan.gold.description': 'വേഗത്തിൽ പൊരുത്തങ്ങൾ കണ്ടെത്താൻ ആഗ്രഹിക്കുന്നവർക്ക്',
    'plan.feature.allGoldFeatures': 'എല്ലാ Gold ഫീച്ചറുകളും',
    'plan.feature.unlimitedViews': 'അപരിമിത പ്രൊഫൈൽ കാഴ്ചകൾ',
    'plan.feature.sendInterests': 'ദിവസേന നിരവധി ഇന്ററസ്റ്റുകൾ അയയ്ക്കാം',
    'plan.feature.verifiedTrust': 'സ്ഥിരീകരിച്ച ഉപയോക്താക്കളിൽ വിശ്വാസം',
    'plan.feature.priorityListing': 'തിരച്ചിലിൽ മുൻഗണന പട്ടിക',
    'plan.feature.fullContact': 'പൂർണ്ണ കോൺടാക്ട് വിവരങ്ങൾ ലഭിക്കും',
    'plan.feature.customerSupport': 'കസ്റ്റമർ സപ്പോർട്ട്',
    'plan.payNow': 'ഇപ്പോൾ പേയ്‌മെന്റ് ചെയ്യൂ',
    'plan.flashSaleText': '🎉 ഫ്ലാഷ് സെയിൽ: പ്രീമിയം പ്ലാനുകളിൽ 50% ഓഫർ — പരിമിത സമയ ഓഫർ! ⏳'

  },
  ta: {
    'signup.welcome': 'உள்நுழைக 👋',
    'signup.selectState': 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
    'signup.next': 'அடுத்து →',
    'signup.forgotPassword': 'கடவுச்சொல் மறந்துவிட்டதா?',
    'multistep.selectState': 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
    'section.alreadyRegistered': 'நீங்கள் BAJOL-ல் ஏற்கனவே பதிவு செய்தவரா?',
    'section.did': '🚀 செய்தேன்',
    'section.registerNow': '✅ இப்போது பதிவு செய்யவும்',
    'section.dreamMarriage': '💍 திருமணக் கனவு',
    'section.marriageQuote': 'சந்தோஷமான திருமணத்துக்கு மூன்று வழிகள் உள்ளன: ஒன்று அன்பு, இரண்டு அன்பு, மூன்று அன்பு.',
    'couples.title': '❤️ அனைத்து வயதினருக்கும் பொருத்தங்கள் | Bajol Matrimony ❤️',
    'couples.morePhotos': 'மேலும் படங்களைப் பார்க்க படத்தைத் தொடுங்கள்',
    'footer.services': 'திருமண சேவைகள்',
    'footer.profileCreation': 'சுயவிவர உருவாக்கம்',
    'footer.matchmaking': 'இணை தேடும் சேவைகள்',
    'footer.personalizedMatches': 'தனிப்பயன் பொருத்தங்கள்',
    'footer.premiumAssistance': 'பிரீமியம் உறுப்பினர் உதவி',
    'footer.pageLinks': 'பக்க இணைப்புகள்',
    'footer.about': 'எங்களை பற்றி',
    'footer.rules': 'விதிமுறைகள் மற்றும் வழிகாட்டுதல்',
    'footer.contact': 'தொடர்பு',
    'footer.conclusion': 'முடிவு',
    'footer.subscribe': 'சந்தா செய்யவும்',
    'footer.getStarted': 'தொடங்குங்கள்',
    'navbar.signupWelcome': 'பதிவு பக்கத்திற்கு வரவேற்கிறோம்',
    'navbar.welcomeBajol': 'BAJOL-க்கு வரவேற்கிறோம்',
    'navbar.help': 'உதவி',
    'banner.findYourMatch': '💖 உங்கள் சிறப்பு துணையை கண்டுபிடிக்கவும் 💖',
    'banner.card1.title': '📝 பதிவு செய்யவும்',
    'banner.card1.text': 'இலவசமாக பதிவு செய்து உங்கள் திருமண விவரத்தை உருவாக்குங்கள்',
    'banner.card2.title': '💞 இணைக',
    'banner.card2.text': 'உங்களுக்கு பொருத்தமான துணையை தேர்வு செய்து விருப்பமானவர்களுடன் இணைக',
    'banner.card3.title': '💬 உரையாடுங்கள்',
    'banner.card3.text': 'உறுப்பினராகி உரையாடலை தொடங்கி உங்கள் வாழ்க்கையை மாற்றுங்கள்',
    'banner.appName': 'பாஜோல் ஆப்',
    'banner.comingSoonTitle': '🚀 விரைவில் வருகிறது',
    'banner.comingSoonText': 'எங்கள் மொபைல் செயலி விரைவில் அறிமுகமாகிறது. காத்திருக்கவும்!',
    'banner.close': 'மூடு',
    'banner.trustedMatrimonyLine': 'BajolMatrimony® - நம்பகமான திருமண சேவை, Bajol ஆப்',
    'banner.downloadCount': '20,000+ பதிவிறக்கங்கள்',
    'banner.foundPartnerLine': 'BajolMatrimony மூலம் தங்கள் வாழ்க்கைத் துணையை கண்டுள்ளனர்!',
    'banner.trustedByLine': 'Bajol.com - நம்பிக்கை கொண்டவர்கள்',
    'banner.members': 'உறுப்பினர்கள்',
    'banner.description': 'Bajol.com உலகின் சிறந்த திருமண சேவைகளில் ஒன்றாகும். மக்களுக்கு வாழ்க்கைத் துணையை கண்டுபிடிக்க உதவுவது இதன் முக்கிய நோக்கம். ஆன்லைன் திருமண சேவையை முன்னோடியாக தொடங்கி, பல ஆண்டுகளாக இந்த துறையில் முன்னிலையில் உள்ளது. இந்திய மணமக்கள் சந்திக்கும் முறையை மாற்றி, BajolMatrimony ஆயிரக்கணக்கான மக்களின் வாழ்க்கையை தொடந்துள்ளது.',
    'banner.countryLine': 'இந்தியா | அமெரிக்கா | கனடா | இங்கிலாந்து | சிங்கப்பூர் | ஆஸ்திரேலியா | UAE | NRI திருமணங்கள்',
    'banner.trustedBy': 'நம்பிக்கை வைத்தவர்கள்',
    'banner.bestMatches': '💑 சிறந்த பொருத்தங்கள்',
    'banner.verifiedProfiles': '✅ சரிபார்க்கப்பட்ட சுயவிவரங்கள்',
    'banner.privacy': '🔒 100% தனியுரிமை',
     'plan.paymentReminder': '🚀 கட்டணம் செலுத்திய பிறகு பதிவு பக்கத்திற்கு சென்று உங்கள் விவரங்களை நிரப்பலாம் 🚀',
    'plan.reloadHint': '* கட்டணம் செலுத்திய பிறகு Reload பொத்தானை அழுத்தவும் *',
    'plan.reloadButton': '🔄 மீளேற்று',
    'plan.gold.name': 'கோல்டு',
    'plan.gold.description': 'விரைவாக பொருத்தமான இணையை தேடும் பயனர்களுக்காக',
    'plan.feature.allGoldFeatures': 'அனைத்து Gold அம்சங்கள்',
    'plan.feature.unlimitedViews': 'வரம்பற்ற சுயவிவர பார்வைகள்',
    'plan.feature.sendInterests': 'ஒரு நாளுக்கு பல விருப்பங்களை அனுப்பலாம்',
    'plan.feature.verifiedTrust': 'சரிபார்க்கப்பட்ட பயனர்களுடன் நம்பிக்கை',
    'plan.feature.priorityListing': 'தேடலில் முன்னுரிமை பட்டியல்',
    'plan.feature.fullContact': 'முழு தொடர்பு தகவல்களை அணுகலாம்',
    'plan.feature.customerSupport': 'வாடிக்கையாளர் ஆதரவு',
    'plan.payNow': 'இப்போது கட்டணம் செலுத்துங்கள்',
    'plan.flashSaleText': '🎉 ஃபிளாஷ் சலுகை: பிரீமியம் திட்டங்களில் 50% தள்ளுபடி — குறுகிய கால சலுகை! ⏳'
    

  },
  te: {
    'signup.welcome': 'సైన్ ఇన్ 👋',
    'signup.selectState': 'రాష్ట్రాన్ని ఎంచుకోండి',
    'signup.next': 'తర్వాత →',
    'signup.forgotPassword': 'పాస్‌వర్డ్ మర్చిపోయారా?',
    'multistep.selectState': 'రాష్ట్రాన్ని ఎంచుకోండి',
    'section.alreadyRegistered': 'మీరు ఇప్పటికే BAJOL లో రిజిస్టర్ అయ్యారా?',
    'section.did': '🚀 చేశాను',
    'section.registerNow': '✅ ఇప్పుడే నమోదు చేయండి',
    'section.dreamMarriage': '💍 వివాహ స్వప్నం',
    'section.marriageQuote': 'సంతోషకరమైన వివాహానికి మూడు మార్గాలు ఉన్నాయి: మొదటిది దయ, రెండవది దయ, మూడవది దయ.',
    'couples.title': '❤️ ప్రతి వయసుకూ జోడీలు | Bajol Matrimony ❤️',
    'couples.morePhotos': 'మరిన్ని ఫోటోల కోసం చిత్రాన్ని తాకండి',
     'footer.services': 'మ్యాట్రిమోని సేవలు',
    'footer.profileCreation': 'ప్రొఫైల్ సృష్టి',
    'footer.matchmaking': 'జోడీ కలిపే సేవలు',
    'footer.personalizedMatches': 'వ్యక్తిగత సరిపోలికలు',
    'footer.premiumAssistance': 'ప్రీమియం సభ్యుల సహాయం',
    'footer.pageLinks': 'పేజీ లింకులు',
    'footer.about': 'మా గురించి',
    'footer.rules': 'నియమాలు మరియు మార్గదర్శకాలు',
    'footer.contact': 'సంప్రదించండి',
    'footer.conclusion': 'ముగింపు',
    'footer.subscribe': 'సబ్‌స్క్రైబ్ చేయండి',
    'footer.getStarted': 'ప్రారంభించండి',
    'navbar.signupWelcome': 'సైన్ అప్ పేజీకి స్వాగతం',
    'navbar.welcomeBajol': 'BAJOL కి స్వాగతం',
    'navbar.help': 'సహాయం',
    'banner.findYourMatch': '💖 మీ ప్రత్యేకమైన వ్యక్తిని కనుగొనండి 💖',
     'banner.card1.title': '📝 సైన్ అప్',
    'banner.card1.text': 'ఉచితంగా నమోదు చేసి మీ మ్యాట్రిమోని ప్రొఫైల్ సృష్టించండి',

    'banner.card2.title': '💞 కనెక్ట్ అవ్వండి',
    'banner.card2.text': 'మీకు సరైన జోడిని కనుగొని మీకు నచ్చిన వారితో కనెక్ట్ అవ్వండి',

    'banner.card3.title': '💬 సంభాషించండి',
    'banner.card3.text': 'సభ్యుడిగా మారి సంభాషణ ప్రారంభించి మీ జీవితాన్ని మార్చుకోండి',
    'banner.appName': 'బాజోల్ యాప్',
    'banner.comingSoonTitle': '🚀 త్వరలో వస్తోంది',
    'banner.comingSoonText': 'మా మొబైల్ యాప్ త్వరలో ప్రారంభం కానుంది. వేచి ఉండండి!',
    'banner.close': 'మూసివేయండి',
    'banner.trustedMatrimonyLine': 'BajolMatrimony® - నమ్మకమైన మ్యాట్రిమోని, Bajol యాప్',
    'banner.downloadCount': '20,000+ డౌన్‌లోడ్లు',
    'banner.foundPartnerLine': 'BajolMatrimonyలో తమ జీవిత భాగస్వామిని కనుగొన్నారు!',
    'banner.trustedByLine': 'Bajol.com - నమ్మిన వారు',
    'banner.members': 'సభ్యులు',
    'banner.description': 'Bajol.com ప్రపంచంలో ప్రసిద్ధమైన మ్యాట్రిమోని సేవలలో ఒకటి. ప్రజలు తమ జీవిత భాగస్వామిని కనుగొనడంలో సహాయం చేయడం దీని లక్ష్యం. భారతీయ వధూవరులు కలుసుకునే విధానాన్ని మార్చి BajolMatrimony వేలాది మందికి సహాయం చేసింది.',
    'banner.countryLine': 'భారతదేశం | USA | కెనడా | UK | సింగపూర్ | ఆస్ట్రేలియా | UAE | NRI మ్యాట్రిమోని',
    'banner.trustedBy': 'నమ్మిన వారు',
    'banner.bestMatches': '💑 ఉత్తమ జోడీలు',
    'banner.verifiedProfiles': '✅ ధృవీకరించిన ప్రొఫైల్స్',
    'banner.privacy': '🔒 100% గోప్యత',
     'plan.paymentReminder': '🚀 చెల్లింపు చేసిన తర్వాత రిజిస్టర్ పేజీకి వెళ్లి మీ బయో డేటా నింపండి 🚀',
    'plan.reloadHint': '* చెల్లింపు చేసిన తర్వాత Reload బటన్ నొక్కండి *',
    'plan.reloadButton': '🔄 రీలోడ్',
    'plan.gold.name': 'గోల్డ్',
    'plan.gold.description': 'త్వరగా సరైన జోడిని వెతికే వినియోగదారుల కోసం',
    'plan.feature.allGoldFeatures': 'అన్ని Gold ఫీచర్లు',
    'plan.feature.unlimitedViews': 'అపరిమిత ప్రొఫైల్ వీక్షణలు',
    'plan.feature.sendInterests': 'రోజుకు అనేక ఆసక్తులను పంపండి',
    'plan.feature.verifiedTrust': 'ధృవీకరించిన వినియోగదారులతో నమ్మకం',
    'plan.feature.priorityListing': 'శోధనలో ప్రాధాన్యత జాబితా',
    'plan.feature.fullContact': 'పూర్తి సంప్రదింపు వివరాలు',
    'plan.feature.customerSupport': 'కస్టమర్ సపోర్ట్',
    'plan.payNow': 'ఇప్పుడు చెల్లించండి',
    'plan.flashSaleText': '🎉 ఫ్లాష్ సేల్: ప్రీమియం ప్లాన్లపై 50% తగ్గింపు — పరిమిత కాల ఆఫర్! ⏳'
  },
  kn: {
    'signup.welcome': 'ಸೈನ್ ಇನ್ 👋',
    'signup.selectState': 'ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'signup.next': 'ಮುಂದೆ →',
    'signup.forgotPassword': 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?',
    'multistep.selectState': 'ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'section.alreadyRegistered': 'ನೀವು BAJOL ನಲ್ಲಿ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿರುವಿರಾ?',
    'section.did': '🚀 ಮಾಡಿದೆ',
    'section.registerNow': '✅ ಈಗಲೇ ನೋಂದಾಯಿಸಿ',
    'section.dreamMarriage': '💍 ಮದುವೆ ಕನಸು',
    'section.marriageQuote': 'ಸಂತೋಷದ ಮದುವೆಗೆ ಮೂರು ಮಾರ್ಗಗಳಿವೆ: ಮೊದಲದು ದಯೆ, ಎರಡದು ದಯೆ, ಮೂರದು ದಯೆ.',
    'couples.title': '❤️ ಎಲ್ಲಾ ವಯಸ್ಸಿನವರಿಗೆ ಜೋಡಿಗಳು | Bajol Matrimony ❤️',
    'couples.morePhotos': 'ಇನ್ನಷ್ಟು ಚಿತ್ರಗಳಿಗೆ ಫೋಟೋ ಮೇಲೆ ಸ್ಪರ್ಶಿಸಿ',
    'footer.services': 'ಮ್ಯಾಟ್ರಿಮೋನಿ ಸೇವೆಗಳು',
    'footer.profileCreation': 'ಪ್ರೊಫೈಲ್ ರಚನೆ',
    'footer.matchmaking': 'ಜೋಡಿ ಹುಡುಕುವ ಸೇವೆಗಳು',
    'footer.personalizedMatches': 'ವೈಯಕ್ತಿಕ ಹೊಂದಾಣಿಕೆಗಳು',
    'footer.premiumAssistance': 'ಪ್ರೀಮಿಯಂ ಸದಸ್ಯ ಸಹಾಯ',
    'footer.pageLinks': 'ಪುಟ ಲಿಂಕ್‌ಗಳು',
    'footer.about': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'footer.rules': 'ನಿಯಮಗಳು ಮತ್ತು ಮಾರ್ಗಸೂಚಿಗಳು',
    'footer.contact': 'ಸಂಪರ್ಕಿಸಿ',
    'footer.conclusion': 'ಸಮಾಪ್ತಿ',
    'footer.subscribe': 'ಚಂದಾದಾರರಾಗಿ',
    'footer.getStarted': 'ಪ್ರಾರಂಭಿಸಿ',
    'navbar.signupWelcome': 'ಸೈನ್ ಅಪ್ ಪುಟಕ್ಕೆ ಸ್ವಾಗತ',
    'navbar.welcomeBajol': 'BAJOL ಗೆ ಸ್ವಾಗತ',
    'navbar.help': 'ಸಹಾಯ',
    'banner.findYourMatch': '💖 ನಿಮ್ಮ ವಿಶೇಷ ವ್ಯಕ್ತಿಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ 💖',
     'banner.card1.title': '📝 ಸೈನ್ ಅಪ್',
    'banner.card1.text': 'ಉಚಿತವಾಗಿ ನೋಂದಾಯಿಸಿ ನಿಮ್ಮ ಮ್ಯಾಟ್ರಿಮೋನಿ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ',

    'banner.card2.title': '💞 ಸಂಪರ್ಕಿಸಿ',
    'banner.card2.text': 'ನಿಮ್ಮ ಪರಿಪೂರ್ಣ ಜೋಡಿಯನ್ನು ಕಂಡುಹಿಡಿದು ನಿಮಗೆ ಇಷ್ಟವಾದವರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',

    'banner.card3.title': '💬 ಮಾತುಕತೆ ಮಾಡಿ',
    'banner.card3.text': 'ಸದಸ್ಯರಾಗಿ ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ ನಿಮ್ಮ ಜೀವನವನ್ನು ಬದಲಾಯಿಸಿ',
     'banner.appName': 'ಬಾಜೋಲ್ ಆಪ್',
    'banner.comingSoonTitle': '🚀 ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ',
    'banner.comingSoonText': 'ನಮ್ಮ ಮೊಬೈಲ್ ಆಪ್ ಶೀಘ್ರದಲ್ಲೇ ಬಿಡುಗಡೆಯಾಗಲಿದೆ. ಕಾಯಿರಿ!',
    'banner.close': 'ಮುಚ್ಚಿ',
    'banner.trustedMatrimonyLine': 'BajolMatrimony® - ನಂಬಿಗಸ್ತ ಮ್ಯಾಟ್ರಿಮೋನಿ, Bajol ಆಪ್',
    'banner.downloadCount': '20,000+ ಡೌನ್‌ಲೋಡ್‌ಗಳು',
    'banner.foundPartnerLine': 'BajolMatrimony ನಲ್ಲಿ ತಮ್ಮ ಜೀವನ ಸಂಗಾತಿಯನ್ನು ಕಂಡಿದ್ದಾರೆ!',
    'banner.trustedByLine': 'Bajol.com - ನಂಬಿರುವವರು',
    'banner.members': 'ಸದಸ್ಯರು',
    'banner.description': 'Bajol.com ವಿಶ್ವದ ಪ್ರಸಿದ್ಧ ಮ್ಯಾಟ್ರಿಮೋನಿ ಸೇವೆಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ. ಜನರು ತಮ್ಮ ಜೀವನ ಸಂಗಾತಿಯನ್ನು ಕಂಡುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುವುದು ಇದರ ಉದ್ದೇಶ. ಭಾರತೀಯ ವರ-ವಧುಗಳು ಭೇಟಿಯಾಗುವ ವಿಧಾನವನ್ನು ಬದಲಾಯಿಸಿ BajolMatrimony ಸಾವಿರಾರು ಜನರ ಜೀವನವನ್ನು ಸ್ಪರ್ಶಿಸಿದೆ.',
    'banner.countryLine': 'ಭಾರತ | USA | ಕೆನಡಾ | UK | ಸಿಂಗಪುರ | ಆಸ್ಟ್ರೇಲಿಯಾ | UAE | NRI ಮ್ಯಾಟ್ರಿಮೋನಿ',
    'banner.trustedBy': 'ನಂಬಿದವರು',
    'banner.bestMatches': '💑 ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆಗಳು',
    'banner.verifiedProfiles': '✅ ಪರಿಶೀಲಿತ ಪ್ರೊಫೈಲ್‌ಗಳು',
    'banner.privacy': '🔒 100% ಗೌಪ್ಯತೆ',
     'plan.paymentReminder': '🚀 ಪಾವತಿ ಮಾಡಿದ ನಂತರ ರಿಜಿಸ್ಟರ್ ಪುಟಕ್ಕೆ ಹೋಗಿ ನಿಮ್ಮ ಬಯೋ ಡೇಟಾ ಭರ್ತಿ ಮಾಡಬಹುದು 🚀',
    'plan.reloadHint': '* ಪಾವತಿ ನಂತರ Reload ಬಟನ್ ಒತ್ತಿರಿ *',
    'plan.reloadButton': '🔄 ರೀಲೋಡ್',
    'plan.gold.name': 'ಗೋಲ್ಡ್',
    'plan.gold.description': 'ವೇಗವಾಗಿ ಸರಿಯಾದ ಜೋಡಿಯನ್ನು ಹುಡುಕುವ ಬಳಕೆದಾರರಿಗೆ',
    'plan.feature.allGoldFeatures': 'ಎಲ್ಲಾ Gold ವೈಶಿಷ್ಟ್ಯಗಳು',
    'plan.feature.unlimitedViews': 'ಅನಿಯಮಿತ ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಣೆಗಳು',
    'plan.feature.sendInterests': 'ದಿನಕ್ಕೆ ಹಲವಾರು ಆಸಕ್ತಿಗಳನ್ನು ಕಳುಹಿಸಬಹುದು',
    'plan.feature.verifiedTrust': 'ಪರಿಶೀಲಿತ ಬಳಕೆದಾರರೊಂದಿಗೆ ನಂಬಿಕೆ',
    'plan.feature.priorityListing': 'ಹುಡುಕಾಟದಲ್ಲಿ ಆದ್ಯತಾ ಪಟ್ಟಿ',
    'plan.feature.fullContact': 'ಪೂರ್ಣ ಸಂಪರ್ಕ ಮಾಹಿತಿ',
    'plan.feature.customerSupport': 'ಗ್ರಾಹಕ ಬೆಂಬಲ',
    'plan.payNow': 'ಈಗ ಪಾವತಿ ಮಾಡಿ',
    'plan.flashSaleText': '🎉 ಫ್ಲ್ಯಾಶ್ ಸೇಲ್: ಪ್ರೀಮಿಯಂ ಪ್ಲಾನ್‌ಗಳಿಗೆ 50% ರಿಯಾಯಿತಿ — ಸೀಮಿತ ಸಮಯದ ಆಫರ್! ⏳'

  },
  hi: {
    'signup.welcome': 'साइन इन 👋',
    'signup.selectState': 'राज्य चुनें',
    'signup.next': 'आगे →',
    'signup.forgotPassword': 'पासवर्ड भूल गए?',
    'multistep.selectState': 'राज्य चुनें',
    'section.alreadyRegistered': 'क्या आप पहले से BAJOL में रजिस्टर्ड हैं?',
    'section.did': '🚀 किया',
    'section.registerNow': '✅ अभी रजिस्टर करें',
    'section.dreamMarriage': '💍 विवाह का सपना',
    'section.marriageQuote': 'खुशहाल विवाह के तीन तरीके हैं: पहला दयालु बनना, दूसरा दयालु बनना, तीसरा दयालु बनना।',
    'couples.title': '❤️ हर उम्र के लिए रिश्ते | Bajol Matrimony ❤️',
    'couples.morePhotos': 'और फोटो देखने के लिए फोटो को छुएं',
     'footer.services': 'मैट्रिमोनी सेवाएं',
    'footer.profileCreation': 'प्रोफाइल बनाना',
    'footer.matchmaking': 'मैचमेकिंग सेवाएं',
    'footer.personalizedMatches': 'व्यक्तिगत मैच',
    'footer.premiumAssistance': 'प्रीमियम सदस्य सहायता',
    'footer.pageLinks': 'पेज लिंक',
    'footer.about': 'हमारे बारे में',
    'footer.rules': 'नियम और दिशानिर्देश',
    'footer.contact': 'संपर्क करें',
    'footer.conclusion': 'निष्कर्ष',
    'footer.subscribe': 'सब्सक्राइब करें',
    'footer.getStarted': 'शुरू करें',
    'navbar.signupWelcome': 'साइनअप पेज में आपका स्वागत है',
    'navbar.welcomeBajol': 'BAJOL में आपका स्वागत है',
    'navbar.help': 'सहायता',
    'banner.findYourMatch': '💖 अपने खास साथी को खोजें 💖 ',
     'banner.card1.title': '📝 साइन अप करें',
    'banner.card1.text': 'मुफ्त में रजिस्टर करें और अपना मैट्रिमोनी प्रोफाइल बनाएं',

    'banner.card2.title': '💞 जुड़ें',
    'banner.card2.text': 'अपना सही जीवनसाथी खोजें और पसंदीदा मैच से जुड़ें',

    'banner.card3.title': '💬 बातचीत करें',
    'banner.card3.text': 'सदस्य बनें, बातचीत शुरू करें और अपनी जिंदगी बदलें',
     'banner.appName': 'बाजोल ऐप',
    'banner.comingSoonTitle': '🚀 जल्द आ रहा है',
    'banner.comingSoonText': 'हमारा मोबाइल ऐप जल्द लॉन्च होने वाला है। जुड़े रहें!',
    'banner.close': 'बंद करें',
    'banner.trustedMatrimonyLine': 'BajolMatrimony® - भरोसेमंद मैट्रिमोनी, Bajol ऐप',
    'banner.downloadCount': '20,000+ डाउनलोड',
    'banner.foundPartnerLine': 'BajolMatrimony पर अपना जीवनसाथी पाया है!',
    'banner.trustedByLine': 'Bajol.com - भरोसा करने वाले',
    'banner.members': 'सदस्य',
    'banner.description': 'Bajol.com दुनिया की प्रसिद्ध मैट्रिमोनियल सेवाओं में से एक है। इसका उद्देश्य लोगों को खुशी और जीवनसाथी खोजने में मदद करना है। भारतीय दूल्हा-दुल्हन के मिलने के तरीके को बदलते हुए BajolMatrimony ने हजारों लोगों के जीवन को छुआ है.',
    'banner.countryLine': 'भारत | USA | कनाडा | UK | सिंगापुर | ऑस्ट्रेलिया | UAE | NRI मैट्रिमोनी',
    'banner.trustedBy': 'भरोसा करने वाले',
    'banner.bestMatches': '💑 बेहतरीन मैच',
    'banner.verifiedProfiles': '✅ सत्यापित प्रोफाइल',
    'banner.privacy': '🔒 100% गोपनीयता',
     'plan.paymentReminder': '🚀 भुगतान करने के बाद रजिस्टर पेज पर जाकर अपना बायोडाटा भरें 🚀',
    'plan.reloadHint': '* भुगतान के बाद Reload बटन दबाएं *',
    'plan.reloadButton': '🔄 रीलोड',
    'plan.gold.name': 'गोल्ड',
    'plan.gold.description': 'जल्दी सही मैच पाने के इच्छुक उपयोगकर्ताओं के लिए',
    'plan.feature.allGoldFeatures': 'सभी Gold फीचर्स',
    'plan.feature.unlimitedViews': 'अनलिमिटेड प्रोफाइल व्यू',
    'plan.feature.sendInterests': 'प्रतिदिन कई इंटरेस्ट भेजें',
    'plan.feature.verifiedTrust': 'सत्यापित उपयोगकर्ताओं के साथ भरोसा',
    'plan.feature.priorityListing': 'सर्च में प्राथमिकता लिस्टिंग',
    'plan.feature.fullContact': 'पूरा संपर्क विवरण प्राप्त करें',
    'plan.feature.customerSupport': 'कस्टमर सपोर्ट',
    'plan.payNow': 'अभी भुगतान करें',
    'plan.flashSaleText': '🎉 फ्लैश सेल: प्रीमियम प्लान पर 50% छूट — सीमित समय का ऑफर! ⏳'

  },
};

const ENGLISH_FALLBACKS: any = {
  'signup.welcome': 'Sign In 👋',
  'signup.selectState': 'Select State',
  'signup.next': 'Next →',
  'signup.forgotPassword': 'Forgot Password?',
  'multistep.selectState': 'Select State',
  'section.alreadyRegistered': 'Are you already registered in BAJOL ?',
  'section.did': '🚀 Did',
  'section.registerNow': '✅ Do Register Now',
  'section.dreamMarriage': '💍 Dream of Marriage',
  'section.marriageQuote': 'There are three ways to a happy marriage: The first way is to be kind. The second way is to be kind. The third way is to be kind.',
  'couples.title': '❤️ Alliances for Every Age | Bajol Matrimony ❤️',
  'couples.morePhotos': 'See more photos touch on the photo more see',
  'footer.services': 'Matrimony Services',
  'footer.profileCreation': 'Profile Creation',
  'footer.matchmaking': 'Matchmaking Services',
  'footer.personalizedMatches': 'Personalized Matches',
  'footer.premiumAssistance': 'Premium Member Assistance',
  'footer.pageLinks': 'Page Links',
  'footer.about': 'About',
  'footer.rules': 'The rules and directions',
  'footer.contact': 'Contact',
  'footer.conclusion': 'Conclusion',
  'footer.subscribe': 'Subscribe',
  'footer.getStarted': 'Get started',
  'navbar.signupWelcome': 'Welcome to Signup Page',
  'navbar.welcomeBajol': 'Welcome to BAJOL',
  'navbar.help': 'Help',
  'banner.findYourMatch': '💖 Find your Special Someone 💖',
  'banner.card1.title': '📝 Sign Up',
  'banner.card1.text': 'Register for free & put up your Matrimony Profile',
  'banner.card2.title': '💞 Connect',
  'banner.card2.text': 'Select find your perfect match & Connect with Matches you like',
  'banner.card3.title': '💬 Interact',
  'banner.card3.text': 'Become a Member & Start a Conversation & Change your life style',
  'banner.downloadPrompt': 'To speed up your partner search, download',
  'banner.appName': 'Bajol App',
  'banner.comingSoonTitle': '🚀 Coming Soon',
  'banner.comingSoonText': 'Our mobile app is launching soon. Stay tuned!',
  'banner.close': 'Close',
  'banner.trustedMatrimonyLine': 'BajolMatrimony® - Trusted Matrimony, Bajol App',
  'banner.downloadCount': '20,000+ Downloads',
  'banner.foundPartnerLine': 'have found their life partner at BajolMatrimony!',
  'banner.trustedByLine': 'Bajol.com - Trusted by over',
  'banner.members': 'Members',
  'banner.description': "Bajol.com, one of world's best known brands and the world's largest matrimonial service was founded with a simple objective - to help people find happiness. The company pioneered online matrimonials in 1996 and continues to lead the exciting matrimony category after more than a decade. By redefining the way Indian brides and grooms meet for marriage, bajolmatrimony.com has created a world-renowned service that has touched over 20,000+ people.",
  'banner.countryLine': 'India | USA | Canada | UK | Singapore | Australia | UAE | NRI Matrimonials',
  'banner.trustedBy': 'Trusted by',
  'banner.bestMatches': '💑 Best Matches',
  'banner.verifiedProfiles': '✅ Verified Profiles',
  'banner.privacy': '🔒 100% Privacy',
  'plan.paymentReminder': '🚀 After payment you can go to register page Fill your Bio-data 🚀',
  'plan.reloadHint': '* After Payment You Touch On Reload Button *',
  'plan.reloadButton': '🔄 Reload',
  'plan.gold.name': 'GOLD',
  'plan.gold.description': 'For serious users looking for quick matches',
  'plan.feature.allGoldFeatures': 'All Gold features',
  'plan.feature.unlimitedViews': 'Unlimited profile views',
  'plan.feature.sendInterests': 'Send up to many interests per day',
  'plan.feature.verifiedTrust': 'Trust with verified users',
  'plan.feature.priorityListing': 'Priority listing in search',
  'plan.feature.fullContact': 'Access to full contact info',
  'plan.feature.customerSupport': 'Customer support',
  'plan.payNow': 'Payment Now',
  'plan.flashSaleText': '🎉 Flash Sale: Get 50% OFF on Premium Plans — Limited Time Offer! ⏳',
};

export const translate = (language: AppLanguage, key: TranslationKey): string => {
  return TRANSLATIONS[language][key] || ENGLISH_FALLBACKS[key];
};

export type { TranslationKey };
