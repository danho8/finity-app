import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'kr',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    compatibilityJSON: 'v3',
    // debug: true,
    fallbackLng: false,
    initImmediate: false,
    // keySeparator: false,
    nsSeparator: false,
    resources: {
      en: { translation: require('./translations/en.json') },
      vi: { translation: require('./translations/vi.json') },
      kr: { translation: require('./translations/kr.json') },
    },
  });
export default i18n;
