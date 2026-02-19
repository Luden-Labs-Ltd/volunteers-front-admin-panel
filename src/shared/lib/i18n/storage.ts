const LANGUAGE_STORAGE_KEY = 'admin-panel.language';

/** Поддерживаемые языки интерфейса админ‑панели (ru, en, he). Список должен совпадать с ключами в shared/lib/i18n/locales/. */
export const SUPPORTED_LANGUAGES = ['ru', 'en', 'he'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (SUPPORTED_LANGUAGES.includes(value as Language)) {
      return value as Language;
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

