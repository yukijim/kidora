import { createContext, useContext, useEffect, useState } from 'react';
import { STRINGS } from '../i18n/translations.js';

const STORAGE_KEY = 'kidora_lang_v1';
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'ms';
    } catch {
      return 'ms';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* abaikan */
    }
    document.documentElement.lang = lang === 'en' ? 'en' : 'ms';
  }, [lang]);

  const t = (key) => (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.ms[key] || key;

  // Bahasa untuk sebutan (speech synthesis)
  const voice = lang === 'en' ? 'en-US' : 'ms-MY';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, voice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
