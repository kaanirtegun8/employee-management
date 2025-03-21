import { Language, Events } from '../constants/enums.js';

function initializeLanguage() {
  const savedLang = localStorage.getItem('app-lang');
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
    localStorage.setItem('app-lang', e.detail.lang);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLanguage);
} else {
  initializeLanguage();
} 