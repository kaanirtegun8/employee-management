import { Language, Events, StorageKeys } from '../constants/enums.js';

function initializeLanguage() {
  const savedLang = localStorage.getItem(StorageKeys.LANGUAGE);
  if (savedLang && (savedLang === Language.EN || savedLang === Language.TR)) {
    document.documentElement.lang = savedLang;
  } else {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('tr')) {
      document.documentElement.lang = Language.TR;
    } else {
      document.documentElement.lang = Language.EN;
    }
  }
  
  window.addEventListener(Events.LANGUAGE_CHANGED, (e) => {
    localStorage.setItem(StorageKeys.LANGUAGE, e.detail.lang);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLanguage);
} else {
  initializeLanguage();
} 