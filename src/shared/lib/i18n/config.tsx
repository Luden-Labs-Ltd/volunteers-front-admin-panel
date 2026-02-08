import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { getStoredLanguage, Language, storeLanguage } from './storage';
import en from './locales/en.json';
import he from './locales/he.json';
import ru from './locales/ru.json';

type TranslationObject = Record<string, unknown>;

type Translations = Record<Language, TranslationObject>;

const translations: Translations = {
  en,
  he,
  ru,
};

interface I18nContextValue {
  language: Language;
  t: (key: string, params?: Record<string, string>) => string;
  setLanguage: (language: Language) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function getInitialLanguage(): Language {
  const stored = getStoredLanguage();

  if (stored) {
    return stored;
  }

  // Основной язык по требованию — иврит
  return 'he';
}

function resolveKey(object: TranslationObject, key: string): string {
  const segments = key.split('.');

  let current: unknown = object;

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null) {
      return key;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current = (current as any)[segment];
  }

  if (typeof current === 'string') {
    return current;
  }

  return key;
}

function translate(
  language: Language,
  key: string,
  params?: Record<string, string>,
): string {
  const bundle = translations[language] ?? translations.he;
  let result = resolveKey(bundle, key);
  // Fallback to Hebrew if key missing in current locale (per FR-006)
  if (result === key && language !== 'he') {
    result = resolveKey(translations.he, key);
  }

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(
        new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'),
        paramValue,
      );
    });
  }

  return result;
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    storeLanguage(language);

    if (typeof document !== 'undefined') {
      const dir = language === 'he' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const setLanguage = (value: Language) => {
    setLanguageState(value);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      t: (key: string, params?: Record<string, string>) =>
        translate(language, key, params),
      setLanguage,
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
}

