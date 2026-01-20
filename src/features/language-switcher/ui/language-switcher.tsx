import { FC } from 'react';

import { useLanguageSwitcher } from '../model/use-language-switcher';

export const LanguageSwitcher: FC = () => {
  const { language, options, handleChange } = useLanguageSwitcher();

  return (
    <div className="inline-flex items-center gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleChange(option.value)}
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            language === option.value
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          aria-pressed={language === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

