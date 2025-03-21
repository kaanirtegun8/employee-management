import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';
import { router } from '../../services/router-service.js';
import '../common/confirmation-modal.js';

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
    this.lang = document.documentElement.lang || 'en';
    this.formData = this._getDefaultFormData();
    this.errors = {};
    this.showConfirmModal = false;
    this.confirmMessage = '';
    
    window.addEventListener('language-changed', this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  _getDefaultFormData() {
    return {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: '',
      position: ''
    };
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
      this.errors = {
        ...this.errors,
        [name]: null
      };
    }
  }
  
  _validateForm() {
    const newErrors = {};
    
    const requiredFields = ['firstName', 'lastName', 'dateOfEmployment', 'dateOfBirth', 'phoneNumber', 'email', 'department', 'position'];
    
    requiredFields.forEach(field => {
      if (!this.formData[field]) {
        newErrors[field] = i18n.t('validation.required');
      }
    });
    
    if (this.formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      newErrors.email = i18n.t('validation.invalidEmail');
    }
    
    if (this.formData.phoneNumber && !/^\+[0-9\s]{10,20}$/.test(this.formData.phoneNumber)) {
      newErrors.phoneNumber = i18n.t('validation.invalidPhone');
    }
    
    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
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
      detail: { employee: this.formData },
      bubbles: true,
      composed: true
    }));
    
    router.navigate('/');
  }
  
  _createEmployee() {
    this.dispatchEvent(new CustomEvent('employee-created', {
      detail: { employee: this.formData },
      bubbles: true,
      composed: true
    }));
    
    setTimeout(() => {
      router.navigate('/?refresh=' + new Date().getTime());
    }, 100);
  }
  
  _handleCancel() {
    router.navigate('/');
  }
  
  render() {
    return html`
      <div class="form-container">
        <form @submit=${this._handleSubmit}>
          <div class="form-group">
            <label class="form-label" for="firstName">${i18n.t('employeeForm.firstName')}</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              class="form-input" 
              .value=${this.formData.firstName || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors.firstName ? html`<div class="form-error">${this.errors.firstName}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="lastName">${i18n.t('employeeForm.lastName')}</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              class="form-input" 
              .value=${this.formData.lastName || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors.lastName ? html`<div class="form-error">${this.errors.lastName}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="dateOfEmployment">${i18n.t('employeeForm.dateOfEmployment')}</label>
            <input 
              type="date" 
              id="dateOfEmployment" 
              name="dateOfEmployment" 
              class="form-input" 
              .value=${this.formData.dateOfEmployment || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors.dateOfEmployment ? html`<div class="form-error">${this.errors.dateOfEmployment}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="dateOfBirth">${i18n.t('employeeForm.dateOfBirth')}</label>
            <input 
              type="date" 
              id="dateOfBirth" 
              name="dateOfBirth" 
              class="form-input" 
              .value=${this.formData.dateOfBirth || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors.dateOfBirth ? html`<div class="form-error">${this.errors.dateOfBirth}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="phoneNumber">${i18n.t('employeeForm.phoneNumber')}</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              name="phoneNumber" 
              class="form-input" 
              placeholder="+90 XXX XXX XX XX"
              .value=${this.formData.phoneNumber || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors.phoneNumber ? html`<div class="form-error">${this.errors.phoneNumber}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="email">${i18n.t('employeeForm.email')}</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="form-input" 
              .value=${this.formData.email || ''} 
              @input=${this._handleInputChange}
            />
            ${this.errors.email ? html`<div class="form-error">${this.errors.email}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="department">${i18n.t('employeeForm.department')}</label>
            <select 
              id="department" 
              name="department" 
              class="form-select" 
              .value=${this.formData.department || ''} 
              @change=${this._handleInputChange}
            >
              <option value="" disabled selected>${i18n.t('employeeForm.selectDepartment')}</option>
              <option value="analytics">${i18n.t('departments.analytics')}</option>
              <option value="tech">${i18n.t('departments.tech')}</option>
            </select>
            ${this.errors.department ? html`<div class="form-error">${this.errors.department}</div>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="position">${i18n.t('employeeForm.position')}</label>
            <select 
              id="position" 
              name="position" 
              class="form-select" 
              .value=${this.formData.position || ''} 
              @change=${this._handleInputChange}
            >
              <option value="" disabled selected>${i18n.t('employeeForm.selectPosition')}</option>
              <option value="junior">${i18n.t('positions.junior')}</option>
              <option value="medior">${i18n.t('positions.medior')}</option>
              <option value="senior">${i18n.t('positions.senior')}</option>
            </select>
            ${this.errors.position ? html`<div class="form-error">${this.errors.position}</div>` : ''}
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