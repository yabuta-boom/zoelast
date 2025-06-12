import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        title={t('language.toggle')}
      >
        <Globe size={20} />
        <span className="font-medium">
          {language === 'en' ? 'EN/አማ' : 'አማ/EN'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;