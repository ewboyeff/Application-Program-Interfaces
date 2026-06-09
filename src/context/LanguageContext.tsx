import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

export type Language = 'uz' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ciu_lang');
    const valid: Language[] = ['uz', 'en'];
    return (saved && valid.includes(saved as Language)) ? saved as Language : 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ciu_lang', lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
