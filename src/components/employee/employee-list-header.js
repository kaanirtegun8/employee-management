import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';
import { Events, ViewMode, Language } from '../../constants/enums.js';

export class EmployeeListHeader extends LitElement {
  static get properties() {
    return {
      viewMode: { type: String },
      lang: { type: String },
      isMobile: { type: Boolean }
    };
  }
  
  constructor() {
    super();
    this.viewMode = ViewMode.TABLE;
    this.lang = document.documentElement.lang || Language.EN;
    this.isMobile = false;
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  static get styles() {
    return css`
      :host {
        display: block;
        margin-bottom: 1rem;
      }
      
      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .title {
        font-size: 24px;
        color: #ff6600;
        font-weight: bold;
        margin: 0;
      }
      
      .view-controls {
        display: flex;
        gap: 0.5rem;
      }
      
      .view-button {
        background: none;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 0.5rem;
        cursor: pointer;
        color: #666;
      }
      
      .view-button.active {
        background-color: #f0f0f0;
        color: #ff6600;
        border-color: #ff6600;
      }
      
      .search-container {
        margin-top: 1rem;
      }
      
      .search-input {
        width: -webkit-fill-available;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;
      }
      
      @media (max-width: 767px) {
        .list-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .title {
          font-size: 1.2rem;
        }
        
        .view-controls {
          display: none;
        }
      }
    `;
  }
  
  _handleViewChange(mode) {
    this.viewMode = mode;
    this.dispatchEvent(new CustomEvent('view-mode-changed', {
      detail: { mode },
      bubbles: true,
      composed: true
    }));
  }
  
  _handleSearch(e) {
    const query = e.target.value;
    this.dispatchEvent(new CustomEvent('search', {
      detail: { query },
      bubbles: true,
      composed: true
    }));
  }
  
  render() {
    return html`
      <div class="list-header">
        <h2 class="title">${i18n.t('employeeList.title')}</h2>
        
        <div class="view-controls">
          <button 
            class="view-button ${this.viewMode === ViewMode.TABLE ? 'active' : ''}" 
            @click=${() => this._handleViewChange(ViewMode.TABLE)}
            title="${i18n.t('employeeList.table')}">
            ☰
          </button>
          <button 
            class="view-button ${this.viewMode === ViewMode.LIST ? 'active' : ''}" 
            @click=${() => this._handleViewChange(ViewMode.LIST)}
            title="${i18n.t('employeeList.list')}">
            ⊞
          </button>
        </div>
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          class="search-input" 
          placeholder="${i18n.t('employeeList.search')}" 
          @input=${this._handleSearch}
        />
      </div>
    `;
  }
}

customElements.define('employee-list-header', EmployeeListHeader); 