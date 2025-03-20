import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';

export class EmployeeTable extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      loading: { type: Boolean }
    };
  }
  
  constructor() {
    super();
    this.employees = [];
    this.loading = false;
  }
  
  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      .employee-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .employee-table th,
      .employee-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      
      .employee-table th {
        font-weight: normal;
        color: #ff6600;
      }
      
      .employee-table tr:hover {
        background-color: #f5f5f5;
      }
      
      .checkbox-cell {
        width: 40px;
      }
      
      .actions-cell {
        width: 100px;
        text-align: center;
      }
      
      .action-button {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 0.3rem;
        margin-left: 0.5rem;
      }
      
      .edit-button:hover {
        color: #1976d2;
      }
      
      .delete-button:hover {
        color: #d32f2f;
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
      
      @media (max-width: 768px) {
        .employee-table {
          display: block;
          overflow-x: auto;
        }
      }
    `;
  }
  
  _onEdit(employee) {
    this.dispatchEvent(new CustomEvent('edit-employee', {
      detail: { employee },
      bubbles: true,
      composed: true
    }));
  }
  
  _onDelete(employee) {
    this.dispatchEvent(new CustomEvent('delete-employee', {
      detail: { employee },
      bubbles: true,
      composed: true
    }));
  }
  
  render() {
    if (this.loading) {
      return html`<div class="loading-message">Loading...</div>`;
    }
    
    if (!this.employees || this.employees.length === 0) {
      return html`<div class="empty-message">${i18n.t('employeeList.empty')}</div>`;
    }
    
    return html`
      <table class="employee-table">
        <thead>
          <tr>
            <th class="checkbox-cell">
              <input type="checkbox" />
            </th>
            <th>${i18n.t('employeeForm.firstName')}</th>
            <th>${i18n.t('employeeForm.lastName')}</th>
            <th>${i18n.t('employeeForm.dateOfEmployment')}</th>
            <th>${i18n.t('employeeForm.dateOfBirth')}</th>
            <th>${i18n.t('employeeForm.phoneNumber')}</th>
            <th>${i18n.t('employeeForm.email')}</th>
            <th>${i18n.t('employeeForm.department')}</th>
            <th>${i18n.t('employeeForm.position')}</th>
            <th class="actions-cell">${i18n.t('actions.edit')}</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(employee => html`
            <tr>
              <td class="checkbox-cell">
                <input type="checkbox" />
              </td>
              <td>${employee.firstName}</td>
              <td>${employee.lastName}</td>
              <td>${employee.dateOfEmployment}</td>
              <td>${employee.dateOfBirth}</td>
              <td>${employee.phoneNumber}</td>
              <td>${employee.email}</td>
              <td>${i18n.t(`departments.${employee.department}`)}</td>
              <td>${i18n.t(`positions.${employee.position}`)}</td>
              <td class="actions-cell">
                <button 
                  class="action-button edit-button" 
                  @click=${() => this._onEdit(employee)}
                  title="${i18n.t('actions.edit')}">
                  ✏️
                </button>
                <button 
                  class="action-button delete-button" 
                  @click=${() => this._onDelete(employee)}
                  title="${i18n.t('actions.delete')}">
                  🗑️
                </button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}

customElements.define('employee-table', EmployeeTable); 