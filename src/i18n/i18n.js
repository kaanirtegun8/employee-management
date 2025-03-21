import { en } from './translations/en.js';
import { tr } from './translations/tr.js';
import { Events } from '../constants/enums.js';

class I18nService {
  constructor() {
    this.translations = {
      en,
      tr
    };
    
    this.updateLanguageFromDocument();
    
    window.addEventListener(Events.LANG_CHANGED, e => {
      this.setLanguage(e.detail.lang);
    });
    
    if (document.readyState !== 'complete') {
      document.addEventListener('DOMContentLoaded', () => {
        this.updateLanguageFromDocument();
      });
    }
  }
  
  updateLanguageFromDocument() {
    const documentLang = document.documentElement.lang || 'en';
    const lang = documentLang.startsWith('tr') ? 'tr' : 'en';
    
    if (this.currentLang !== lang) {
      this.currentLang = lang;
    }
  }
  
  t(key) {
    const keys = key.split('.');
    let result = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return result;
  }
  
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      
      document.documentElement.lang = lang;
      
      window.dispatchEvent(new CustomEvent(Events.LANGUAGE_CHANGED, {
        detail: { lang }
      }));
    } else {
      console.warn(`Language not supported: ${lang}`);
    }
  }
  
  get currentLanguage() {
    return this.currentLang;
  }
}

export const i18n = new I18nService(); 