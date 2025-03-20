import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';

export class EmployeeListHeader extends LitElement {
  static get properties() {
    return {
      viewMode: { type: String },
      lang: { type: String }
    };
  }
  
  constructor() {
    super();
    this.viewMode = 'table';
    this.lang = document.documentElement.lang || 'en';
    
    window.addEventListener('language-changed', this._onLanguageChanged.bind(this));
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
        padding: 1rem 0;
      }
      
      .title {
        font-size: 1.5rem;
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
            class="view-button ${this.viewMode === 'table' ? 'active' : ''}" 
            @click=${() => this._handleViewChange('table')}
            title="${i18n.t('employeeList.table')}">
            ☰
          </button>
          <button 
            class="view-button ${this.viewMode === 'list' ? 'active' : ''}" 
            @click=${() => this._handleViewChange('list')}
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