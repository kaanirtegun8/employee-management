import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';
import { router } from '../../services/router-service.js';

export class EmployeeList extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      loading: { type: Boolean },
      lang: { type: String }
    };
  }
  
  constructor() {
    super();
    this.employees = [];
    this.loading = false;
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
      }
      
      .employee-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      
      .employee-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 1rem;
        transition: transform 0.2s, box-shadow 0.2s;
        position: relative;
      }
      
      .employee-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
      }
      
      .employee-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #ff6600;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin-right: 1rem;
      }
      
      .employee-name {
        font-weight: bold;
        font-size: 1.1rem;
        color: #333;
      }
      
      .employee-position {
        color: #666;
        font-size: 0.9rem;
      }
      
      .card-body {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      
      .card-field {
        display: flex;
        flex-direction: column;
      }
      
      .field-label {
        font-size: 0.8rem;
        color: #999;
      }
      
      .field-value {
        font-size: 0.9rem;
        color: #333;
      }
      
      .card-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
        border-top: 1px solid #eee;
        padding-top: 0.5rem;
      }
      
      .action-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 0.3rem;
        margin-left: 0.5rem;
        font-size: 1.2rem;
      }
      
      .edit-button:hover {
        color: #1976d2;
      }
      
      .delete-button:hover {
        color: #d32f2f;
      }
      
      .checkbox-wrapper {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
      }
      
      .empty-message {
        padding: 2rem;
        text-align: center;
        color: #666;
      }
      
      .loading-message {
        padding: 2rem;
        text-align: center;
        color: #666;
      }
    `;
  }
  
  _onEditEmployee(employee) {
    this.dispatchEvent(new CustomEvent('edit-employee', {
      detail: { employee },
      bubbles: true,
      composed: true
    }));
    
    router.navigate(`/edit-employee/${employee.id}`);
  }
  
  _onDeleteEmployee(employee) {
    this.dispatchEvent(new CustomEvent('delete-employee', {
      detail: { employee },
      bubbles: true,
      composed: true
    }));
  }
  
  render() {
    if (this.loading) {
      return html`<div class="loading-message">${i18n.t('loading')}</div>`;
    }
    
    if (!this.employees || this.employees.length === 0) {
      return html`<div class="empty-message">${i18n.t('employeeList.empty')}</div>`;
    }
    
    return html`
      <div class="employee-list">
        ${this.employees.map(employee => html`
          <div class="employee-card">
            <div class="checkbox-wrapper">
              <input type="checkbox" />
            </div>
            
            <div class="card-header">
              <div class="employee-avatar">
                ${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}
              </div>
              <div>
                <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
                <div class="employee-position">${i18n.t(`positions.${employee.position}`)} - ${i18n.t(`departments.${employee.department}`)}</div>
              </div>
            </div>
            
            <div class="card-body">
              <div class="card-field">
                <span class="field-label">${i18n.t('employeeForm.email')}</span>
                <span class="field-value">${employee.email}</span>
              </div>
              
              <div class="card-field">
                <span class="field-label">${i18n.t('employeeForm.phoneNumber')}</span>
                <span class="field-value">${employee.phoneNumber}</span>
              </div>
              
              <div class="card-field">
                <span class="field-label">${i18n.t('employeeForm.dateOfEmployment')}</span>
                <span class="field-value">${employee.dateOfEmployment}</span>
              </div>
              
              <div class="card-field">
                <span class="field-label">${i18n.t('employeeForm.dateOfBirth')}</span>
                <span class="field-value">${employee.dateOfBirth}</span>
              </div>
            </div>
            
            <div class="card-actions">
              <button 
                class="action-button edit-button" 
                @click=${() => this._onEditEmployee(employee)}
                title="${i18n.t('actions.edit')}">
                ✏️
              </button>
              <button 
                class="action-button delete-button" 
                @click=${() => this._onDeleteEmployee(employee)}
                title="${i18n.t('actions.delete')}">
                🗑️
              </button>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList); 