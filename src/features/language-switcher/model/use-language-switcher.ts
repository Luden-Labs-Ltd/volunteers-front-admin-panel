import { Language, useI18n } from '@/shared/lib/i18n';

interface LanguageOption {
  value: Language;
  label: string;
}

interface UseLanguageSwitcherResult {
  language: Language;
  options: LanguageOption[];
  handleChange: (language: Language) => void;
}

export function useLanguageSwitcher(): UseLanguageSwitcherResult {
  const { language, setLanguage, t } = useI18n();

  const options: LanguageOption[] = [
    { value: 'he', label: t('language.he') },
    { value: 'ru', label: t('language.ru') },
    { value: 'en', label: t('language.en') },
  ];

  const handleChange = (value: Language) => {
    setLanguage(value);
  };

  return {
    language,
    options,
    handleChange,
  };
}

