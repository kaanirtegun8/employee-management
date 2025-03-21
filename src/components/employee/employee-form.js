import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';
import { router } from '../../services/router-service.js';
import '../common/confirmation-modal.js';
import { EmployeeFields, Department, Position, Language, Events } from '../../constants/enums.js';
import { isValidEmail, isValidPhone, validateRequired, getEmailValidationKey, getPhoneValidationKey } from '../../utils/validation.js';

export class EmployeeForm extends LitElement {
  static get properties() {
    return {
      employee: { type: Object, attribute: false },
      isEditMode: { type: Boolean },
      lang: { type: String },
      formData: { type: Object },
      errors: { type: Object },
      showConfirmModal: { type: Boolean },
      confirmMessage: { type: String }
    };
  }
  
  constructor() {
    super();
    this.employee = null;
    this.isEditMode = false;
    this.lang = document.documentElement.lang || Language.EN;
    this.formData = {
      [EmployeeFields.FIRST_NAME]: '',
      [EmployeeFields.LAST_NAME]: '',
      [EmployeeFields.DATE_OF_EMPLOYMENT]: '',
      [EmployeeFields.DATE_OF_BIRTH]: '',
      [EmployeeFields.PHONE_NUMBER]: '',
      [EmployeeFields.EMAIL]: '',
      [EmployeeFields.DEPARTMENT]: '',
      [EmployeeFields.POSITION]: ''
    };
    this.errors = {};
    this.showConfirmModal = false;
    this.confirmMessage = '';
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  updated(changedProperties) {
    if (changedProperties.has('employee') && this.employee && Object.keys(this.employee).length > 0) {
      this.isEditMode = true;
      this.formData = { ...this.employee };
    }
  }
  
  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      .form-container {
        max-width: 800px;
        margin: 0 auto;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #333;
      }
      
      .form-input,
      .form-select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      
      .form-input:focus,
      .form-select:focus {
        border-color: #ff6600;
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.2);
      }
      
      .form-error {
        color: #d32f2f;
        font-size: 0.8rem;
        margin-top: 0.25rem;
      }
      
      .form-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;
      }
      
      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .btn-primary {
        background-color: #ff6600;
        color: white;
      }
      
      .btn-primary:hover {
        background-color: #e55c00;
      }
      
      .btn-secondary {
        background-color: #f2f2f2;
        color: #333;
      }
      
      .btn-secondary:hover {
        background-color: #e0e0e0;
      }
      
      @media (max-width: 768px) {
        .form-buttons {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .btn {
          width: 100%;
        }
      }
    `;
  }
  
  _handleInputChange(e) {
    const { name, value } = e.target;
    this.formData = {
      ...this.formData,
      [name]: value
    };
    
    if (this.errors[name]) {
      const newErrors = { ...this.errors };
      delete newErrors[name];
      this.errors = newErrors;
    }
  }
  
  _validateForm() {
    const errors = validateRequired(this.formData, Object.values(EmployeeFields));
    
    const translatedErrors = {};
    Object.entries(errors).forEach(([field, messageKey]) => {
      translatedErrors[field] = i18n.t(messageKey);
    });
    
    if (!isValidEmail(this.formData[EmployeeFields.EMAIL])) {
      translatedErrors[EmployeeFields.EMAIL] = i18n.t(getEmailValidationKey());
    }
    
    if (!isValidPhone(this.formData[EmployeeFields.PHONE_NUMBER])) {
      translatedErrors[EmployeeFields.PHONE_NUMBER] = i18n.t(getPhoneValidationKey());
    }
    
    this.errors = translatedErrors;
    return Object.keys(translatedErrors).length === 0;
  }
  
  _handleSubmit(e) {
    e.preventDefault();

    if (!this._validateForm()) {
      return;
    }
    
    if (this.isEditMode) {
      this.confirmMessage = i18n.t('messages.confirmUpdate');
      this.showConfirmModal = true;
    } else {
      this._createEmployee();
    }
  }
  
  _handleConfirmUpdate() {
    this._updateEmployee();
    this.showConfirmModal = false;
  }
  
  _handleCancelUpdate() {
    this.showConfirmModal = false;
  }
  
  _updateEmployee() {
    this.dispatchEvent(new CustomEvent('employee-updated', {
      detail: { employee: { ...this.formData } },
      bubbles: true,
      composed: true
    }));
    
    router.navigate('/');
  }
  
  _createEmployee() {
    this.dispatchEvent(new CustomEvent('employee-created', {
      detail: { employee: { ...this.formData } },
      bubbles: true,
      composed: true
    }));
    
    router.navigate('/');
  }
  
  _handleCancel() {
    router.navigate('/');
  }
  
  render() {
    return html`
      <div class="form-container">
        <form @submit=${this._handleSubmit}>
          <div class="form-group">
            <label class="form-label" for="${EmployeeFields.FIRST_NAME}">${i18n.t('employeeForm.firstName')}</label>
            <input 
              type="text" 
              id="${EmployeeFields.FIRST_NAME}" 
              name="${EmployeeFields.FIRST_NAME}" 
              class="form-input" 
              .value=${this.formData[EmployeeFields.FIRST_NAME] || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors[EmployeeFields.FIRST_NAME] ? html`<div class="form-error">${this.errors[EmployeeFields.FIRST_NAME]}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="${EmployeeFields.LAST_NAME}">${i18n.t('employeeForm.lastName')}</label>
            <input 
              type="text" 
              id="${EmployeeFields.LAST_NAME}" 
              name="${EmployeeFields.LAST_NAME}" 
              class="form-input" 
              .value=${this.formData[EmployeeFields.LAST_NAME] || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors[EmployeeFields.LAST_NAME] ? html`<div class="form-error">${this.errors[EmployeeFields.LAST_NAME]}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="${EmployeeFields.DATE_OF_EMPLOYMENT}">${i18n.t('employeeForm.dateOfEmployment')}</label>
            <input 
              type="date" 
              id="${EmployeeFields.DATE_OF_EMPLOYMENT}" 
              name="${EmployeeFields.DATE_OF_EMPLOYMENT}" 
              class="form-input" 
              .value=${this.formData[EmployeeFields.DATE_OF_EMPLOYMENT] || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors[EmployeeFields.DATE_OF_EMPLOYMENT] ? html`<div class="form-error">${this.errors[EmployeeFields.DATE_OF_EMPLOYMENT]}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="${EmployeeFields.DATE_OF_BIRTH}">${i18n.t('employeeForm.dateOfBirth')}</label>
            <input 
              type="date" 
              id="${EmployeeFields.DATE_OF_BIRTH}" 
              name="${EmployeeFields.DATE_OF_BIRTH}" 
              class="form-input" 
              .value=${this.formData[EmployeeFields.DATE_OF_BIRTH] || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors[EmployeeFields.DATE_OF_BIRTH] ? html`<div class="form-error">${this.errors[EmployeeFields.DATE_OF_BIRTH]}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="${EmployeeFields.PHONE_NUMBER}">${i18n.t('employeeForm.phoneNumber')}</label>
            <input 
              type="tel" 
              id="${EmployeeFields.PHONE_NUMBER}" 
              name="${EmployeeFields.PHONE_NUMBER}" 
              class="form-input" 
              placeholder="+90 XXX XXX XX XX"
              .value=${this.formData[EmployeeFields.PHONE_NUMBER] || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors[EmployeeFields.PHONE_NUMBER] ? html`<div class="form-error">${this.errors[EmployeeFields.PHONE_NUMBER]}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="${EmployeeFields.EMAIL}">${i18n.t('employeeForm.email')}</label>
            <input 
              type="email" 
              id="${EmployeeFields.EMAIL}" 
              name="${EmployeeFields.EMAIL}" 
              class="form-input" 
              .value=${this.formData[EmployeeFields.EMAIL] || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors[EmployeeFields.EMAIL] ? html`<div class="form-error">${this.errors[EmployeeFields.EMAIL]}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="${EmployeeFields.DEPARTMENT}">${i18n.t('employeeForm.department')}</label>
            <select 
              id="${EmployeeFields.DEPARTMENT}" 
              name="${EmployeeFields.DEPARTMENT}" 
              class="form-select" 
              .value=${this.formData[EmployeeFields.DEPARTMENT] || ''} 
              @change=${this._handleInputChange}
            >
              <option value="" disabled selected>${i18n.t('employeeForm.selectDepartment')}</option>
              <option value="${Department.ANALYTICS}">${i18n.t('departments.analytics')}</option>
              <option value="${Department.TECH}">${i18n.t('departments.tech')}</option>
            </select>
            ${this.errors[EmployeeFields.DEPARTMENT] ? html`<div class="form-error">${this.errors[EmployeeFields.DEPARTMENT]}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="${EmployeeFields.POSITION}">${i18n.t('employeeForm.position')}</label>
            <select 
              id="${EmployeeFields.POSITION}" 
              name="${EmployeeFields.POSITION}" 
              class="form-select" 
              .value=${this.formData[EmployeeFields.POSITION] || ''} 
              @change=${this._handleInputChange}
            >
              <option value="" disabled selected>${i18n.t('employeeForm.selectPosition')}</option>
              <option value="${Position.JUNIOR}">${i18n.t('positions.junior')}</option>
              <option value="${Position.MEDIOR}">${i18n.t('positions.medior')}</option>
              <option value="${Position.SENIOR}">${i18n.t('positions.senior')}</option>
            </select>
            ${this.errors[EmployeeFields.POSITION] ? html`<div class="form-error">${this.errors[EmployeeFields.POSITION]}</div>` : ''}
          </div>
          
          <div class="form-buttons">
            <button type="button" class="btn btn-secondary" @click=${this._handleCancel}>
              ${i18n.t('employeeForm.cancel')}
            </button>
            <button type="submit" class="btn btn-primary">
              ${this.isEditMode ? i18n.t('employeeForm.update') : i18n.t('employeeForm.save')}
            </button>
          </div>
        </form>
      </div>

      <confirmation-modal
        .isOpen=${this.showConfirmModal}
        .message=${this.confirmMessage}
        .onConfirm=${() => this._handleConfirmUpdate()}
        .onCancel=${() => this._handleCancelUpdate()}
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-form', EmployeeForm); 