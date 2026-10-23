import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../translations/index.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('drishtiai_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('drishtiai_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    if (!key) return '';
    const currentDict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    if (currentDict && currentDict[key] !== undefined) {
      return currentDict[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
