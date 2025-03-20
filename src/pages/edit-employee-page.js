import { LitElement, html, css } from 'lit';
import '../components/layout/app-top-bar.js';
import { i18n } from '../i18n/i18n.js';

export class EditEmployeePage extends LitElement {
  static get properties() {
    return {
      employeeId: { type: String },
      lang: { type: String },
      loading: { type: Boolean }
    };
  }
  
  constructor() {
    super();
    this.employeeId = '';
    this.lang = document.documentElement.lang || 'en';
    this.loading = true;
    
    window.addEventListener('language-changed', this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  onBeforeEnter(location) {
    console.log('Route params:', location.params);
    this.employeeId = location.params.id;
    this.loading = false;
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
      
      .employee-id {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
    `;
  }
  
  render() {
    if (this.loading) {
      return html`
        <app-top-bar></app-top-bar>
        <div class="container">
          <div class="page-content">
            <p>${i18n.t('loading')}</p>
          </div>
        </div>
      `;
    }
    
    return html`
      <app-top-bar></app-top-bar>
      
      <div class="container">
        <div class="page-content">
          <h2 class="page-title">${i18n.t('employeeForm.editTitle')}</h2>
          <p class="employee-id">ID: ${this.employeeId}</p>
          <!-- Employee edit form will be added here -->
        </div>
      </div>
    `;
  }
}

customElements.define('edit-employee-page', EditEmployeePage); 