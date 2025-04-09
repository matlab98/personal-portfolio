import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// i18n.js
import translationEN from './locales/en-us/translation.json';
import translationES from './locales/es-co/translation.json';

const resources = {
  'en': { translation: translationEN },
  'es': { translation: translationES },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });


export default i18n;

