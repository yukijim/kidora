import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('kidora_lang');
      return saved === 'en' || saved === 'bm' ? saved : 'bm';
    } catch {
      return 'bm';
    }
  });

  const setLanguage = useCallback((lang) => {
    if (lang === 'bm' || lang === 'en') {
      setLanguageState(lang);
      try {
        localStorage.setItem('kidora_lang', lang);
      } catch (e) {
        console.warn('Could not save language preference', e);
      }
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'bm' ? 'en' : 'bm');
  }, [language, setLanguage]);

  const t = useCallback((key, params = {}) => {
    const currentDict = translations[language] || translations.bm;
    const fallbackDict = translations.bm;

    let text = currentDict[key] || fallbackDict[key] || key;

    // Parameter interpolation, e.g. {name}
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }

    return text;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t,
  }), [language, setLanguage, toggleLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
