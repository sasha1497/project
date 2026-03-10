import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AppLanguage,
  getStoredLanguage,
  LANGUAGE_EVENT_NAME,
  LANGUAGE_STORAGE_KEY,
  setAppLanguage,
  translate,
  TranslationKey,
} from './language';

type LanguageContextType = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(getStoredLanguage());

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY) {
        setLanguageState(getStoredLanguage());
      }
    };

    const handleLanguageEvent = () => {
      setLanguageState(getStoredLanguage());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(LANGUAGE_EVENT_NAME, handleLanguageEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(LANGUAGE_EVENT_NAME, handleLanguageEvent as EventListener);
    };
  }, []);

  const setLanguage = (nextLanguage: AppLanguage) => {
    setAppLanguage(nextLanguage);
    setLanguageState(nextLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translate(language, key),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useAppLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useAppLanguage must be used inside LanguageProvider');
  }

  return context;
};
