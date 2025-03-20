import { LitElement, html, css } from 'lit';

export class AppTopBar extends LitElement {
  static get properties() {
    return {
      currentLang: { type: String }
    };
  }
  
  constructor() {
    super();
    this.currentLang = document.documentElement.lang || 'en';
  }
  
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem 1.5rem;
        max-width: 1800px;
        width: 95%;
        margin: 0 auto;
      }
      
      .logo {
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 1.2rem;
        color: #ff6600;
        text-decoration: none;
      }
      
      .logo-icon {
        width: 32px;
        height: 32px;
      }
      
      .actions {
        display: flex;
        align-items: center;
      }
      
      .employees-link {
        display: flex;
        align-items: center;
        margin-right: 1.5rem;
        color: #ff6600;
        text-decoration: none;
      }
      
      .employees-link:hover {
        color: #ff6600;
      }
      
      .user-icon {
        margin-right: 0.5rem;
        font-size: 1.2rem;
        color: #ff6600;
      }
      
      .add-button {
        display: flex;
        align-items: center;
        background-color: #ff6600;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.9rem;
      }
      
      .add-button:hover {
        background-color: #e55c00;
      }
      
      .add-icon {
        margin-right: 0.5rem;
        font-size: 1rem;
      }
      
      .language-switcher {
        display: flex;
        align-items: center;
        margin-left: 1.5rem;
      }
      
      .lang-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.3rem;
        margin-left: 0.5rem;
        opacity: 0.6;
        transition: opacity 0.2s;
      }
      
      .lang-button.active {
        opacity: 1;
        box-shadow: 0 0 0 2px #ff6600;
        border-radius: 2px;
      }
      
      .lang-button:hover {
        opacity: 1;
      }
      
      .flag {
        width: 24px;
        height: 16px;
        object-fit: cover;
        border-radius: 2px;
      }
      
      @media (max-width: 768px) {
        .logo-text {
          display: none;
        }
        
        .employees-link span {
          display: none;
        }
        
        .add-button span {
          display: none;
        }
      }
    `;
  }
  
  _changeLang(lang) {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      document.documentElement.lang = lang;
      this.dispatchEvent(new CustomEvent('lang-changed', {
        detail: { lang },
        bubbles: true,
        composed: true
      }));
    }
  }
  
  render() {
    return html`
      <div class="top-bar">
        <a href="/" class="logo">
          <img src="/src/assests/images/logo.webp" class="logo-icon" alt="ING Logo">
          <span>ING</span>
        </a>
        
        <div class="actions">
          <a href="/" class="employees-link">
            <span class="user-icon">👤</span>
            <span>Employees</span>
          </a>
          
          <a href="/create" class="add-button">
            <span class="add-icon">+</span>
            <span>Add New</span>
          </a>
          
          <div class="language-switcher">
            <button 
              class="lang-button ${this.currentLang === 'en' ? 'active' : ''}" 
              @click=${() => this._changeLang('en')}
              title="English"
            >
              <span>🇬🇧</span>
            </button>
            
            <button 
              class="lang-button ${this.currentLang === 'tr' ? 'active' : ''}" 
              @click=${() => this._changeLang('tr')}
              title="Türkçe"
            >
              <span>🇹🇷</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-top-bar', AppTopBar); 