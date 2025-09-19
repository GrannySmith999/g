import { useState, useEffect } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const switchLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
  }, []);

  return {
    language,
    t,
    switchLanguage
  };
}
