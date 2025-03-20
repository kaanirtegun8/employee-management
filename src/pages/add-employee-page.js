import { LitElement, html, css } from 'lit';
import '../components/layout/app-top-bar.js';
import { i18n } from '../i18n/i18n.js';

export class AddEmployeePage extends LitElement {
  static get properties() {
    return {
      lang: { type: String }
    };
  }
  
  constructor() {
    super();
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
        height: 100vh;
        background-color: #f5f5f5;
      }
      
      .container {
        max-width: 1800px;
        margin: 0 auto;
        padding: 1rem;
        width: 95%;
      }
      
      .page-content {
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        padding: 1rem;
        margin-bottom: 1rem;
      }
      
      .page-title {
        font-size: 1.5rem;
        color: #ff6600;
        font-weight: bold;
        margin: 0 0 1rem 0;
      }
    `;
  }
  
  render() {
    return html`
      <app-top-bar></app-top-bar>
      
      <div class="container">
        <div class="page-content">
          <h2 class="page-title">${i18n.t('employeeForm.createTitle')}</h2>
          <!-- Employee form will be added here -->
        </div>
      </div>
    `;
  }
}

customElements.define('add-employee-page', AddEmployeePage); 