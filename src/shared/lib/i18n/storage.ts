const LANGUAGE_STORAGE_KEY = 'admin-panel.language';

export type Language = 'he' | 'ru' | 'en';

export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (value === 'he' || value === 'ru' || value === 'en') {
      return value;
    }

    return null;
  } catch {
    return null;
  }
}

export function storeLanguage(language: Language): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // ignore storage errors (e.g. private mode)
  }
}

