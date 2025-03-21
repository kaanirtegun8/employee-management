import { E as Events, L as Language, r, i, x, S as StorageKeys } from './app-C0-Sf9PK.js';

const en = {
  app: {
    title: 'Employee Management System',
    welcome: 'Welcome to the Employee Management System'
  },
  navigation: {
    employees: 'Employees',
    createEmployee: 'Add New'
  },
  employeeList: {
    title: 'Employee List',
    empty: 'No employees found',
    search: 'Search employees',
    table: 'Table View',
    list: 'List View'
  },
  employeeForm: {
    createTitle: 'Create New Employee',
    editTitle: 'Edit Employee',
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfEmployment: 'Date of Employment',
    dateOfBirth: 'Date of Birth',
    phoneNumber: 'Phone Number',
    email: 'Email Address',
    department: 'Department',
    position: 'Position',
    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    selectDepartment: 'Select Department',
    selectPosition: 'Select Position'
  },
  departments: {
    analytics: 'Analytics',
    tech: 'Tech'
  },
  positions: {
    junior: 'Junior',
    medior: 'Medior', 
    senior: 'Senior'
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    invalidPhone: 'Invalid phone number'
  },
  actions: {
    edit: 'Actions',
    delete: 'Delete',
    confirm: 'Proceed',
    cancel: 'Cancel'
  },
  messages: {
    confirmTitle: 'Are you sure?',
    confirmDelete: 'Are you sure you want to delete this employee?',
    confirmUpdate: 'Are you sure you want to update this employee?',
    employeeCreated: 'Employee created successfully',
    employeeUpdated: 'Employee updated successfully',
    employeeDeleted: 'Employee deleted successfully',
    employeeNotFound: 'Employee not found'
  },
  loading: 'Loading...'
};

const tr = {
  app: {
    title: 'Çalışan Yönetim Sistemi',
    welcome: 'Çalışan Yönetim Sistemine Hoş Geldiniz'
  },
  navigation: {
    employees: 'Çalışanlar',
    createEmployee: 'Yeni Ekle'
  },
  employeeList: {
    title: 'Çalışan Listesi',
    empty: 'Çalışan bulunamadı',
    search: 'Çalışan ara',
    table: 'Tablo Görünümü',
    list: 'Liste Görünümü'
  },
  employeeForm: {
    createTitle: 'Yeni Çalışan Ekle',
    editTitle: 'Çalışan Düzenle',
    firstName: 'Ad',
    lastName: 'Soyad',
    dateOfEmployment: 'İşe Giriş Tarihi',
    dateOfBirth: 'Doğum Tarihi',
    phoneNumber: 'Telefon Numarası',
    email: 'E-posta Adresi',
    department: 'Departman',
    position: 'Pozisyon',
    save: 'Kaydet',
    update: 'Güncelle',
    cancel: 'İptal',
    selectDepartment: 'Departman Seçin',
    selectPosition: 'Pozisyon Seçin'
  },
  departments: {
    analytics: 'Analitik',
    tech: 'Teknoloji'
  },
  positions: {
    junior: 'Junior',
    medior: 'Medior', 
    senior: 'Senior'
  },
  validation: {
    required: 'Bu alan zorunludur',
    invalidEmail: 'Geçersiz e-posta adresi',
    invalidPhone: 'Geçersiz telefon numarası'
  },
  actions: {
    edit: 'İşlemler',
    delete: 'Sil',
    confirm: 'Devam Et',
    cancel: 'İptal'
  },
  messages: {
    confirmTitle: 'Emin misiniz?',
    confirmDelete: 'Bu çalışanı silmek istediğinizden emin misiniz?',
    confirmUpdate: 'Bu çalışanı güncellemek istediğinizden emin misiniz?',
    employeeCreated: 'Çalışan başarıyla oluşturuldu',
    employeeUpdated: 'Çalışan başarıyla güncellendi',
    employeeDeleted: 'Çalışan başarıyla silindi',
    employeeNotFound: 'Çalışan bulunamadı'
  },
  loading: 'Yükleniyor...'
};

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
    const documentLang = document.documentElement.lang || Language.EN;
    const lang = documentLang.startsWith(Language.TR) ? Language.TR : Language.EN;
    
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

const i18n = new I18nService();

class AppTopBar extends r {
  static get properties() {
    return {
      currentLang: { type: String }
    };
  }
  
  constructor() {
    super();
    this.currentLang = document.documentElement.lang || Language.EN;
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.currentLang = document.documentElement.lang || Language.EN;
  }
  
  _onLanguageChanged(e) {
    this.currentLang = e.detail.lang;
  }
  
  static get styles() {
    return i`
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
      
      @media (max-width: 767px) {
        .top-bar {
          padding: 0.8rem 1rem;
        }
        
        .actions {
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: flex-end;
        }
        
        .employees-link, .add-button, .language-switcher {
          margin: 0;
        }
        
        .employees-link {
          order: 2;
        }
        
        .add-button {
          order: 3;
        }
        
        .language-switcher {
          order: 1;
          margin-right: 0.5rem;
        }
        
        
        .employees-link span {
          display: inline;
        }
        
        .add-button span {
          display: inline;
        }
      }
      
      @media (max-width: 480px) {
        .employees-link span:not(.user-icon), 
        .add-button span:not(.add-icon) {
          display: none;
        }
        
      }
    `;
  }
  
  _changeLang(lang) {
    if (this.currentLang !== lang) {
      this.currentLang = lang;
      
      document.documentElement.lang = lang;
      
      i18n.setLanguage(lang);
      
      this.dispatchEvent(new CustomEvent('lang-changed', {
        detail: { lang },
        bubbles: true,
        composed: true
      }));
    }
  }
  
  render() {
    return x`
      <div class="top-bar">
        <a href="/" class="logo">
          <img src="/assets/images/logo.webp" class="logo-icon" alt="ING Logo">
          <span class="logo-text">ING</span>
        </a>
        
        <div class="actions">
          <a href="/" class="employees-link">
            <span class="user-icon">👤</span>
            <span>${i18n.t('navigation.employees')}</span>
          </a>
          
          <a href="/add-new" class="add-button">
            <span class="add-icon">+</span>
            <span>${i18n.t('navigation.createEmployee')}</span>
          </a>
          
          <div class="language-switcher">
            <button 
              class="lang-button ${this.currentLang === Language.EN ? 'active' : ''}" 
              @click=${() => this._changeLang(Language.EN)}
              title="English"
            >
              <span>🇬🇧</span>
            </button>
            
            <button 
              class="lang-button ${this.currentLang === Language.TR ? 'active' : ''}" 
              @click=${() => this._changeLang(Language.TR)}
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

class ConfirmationModal extends r {
  static get properties() {
    return {
      isOpen: { type: Boolean, reflect: true },
      message: { type: String },
      onConfirm: { attribute: false },
      onCancel: { attribute: false },
      lang: { type: String }
    };
  }

  constructor() {
    super();
    this.isOpen = false;
    this.message = '';
    this.lang = document.documentElement.lang || Language.EN;
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }

  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }

  static get styles() {
    return i`
      :host {
        display: none;
      }

      :host([isopen]) {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
      }

      .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
      }

      .dialog {
        background: white;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        min-width: 400px;
        max-width: 90%;
        text-align: left;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #eee;
      }

      .title {
        font-size: 1.1rem;
        color: #ff6600;
        font-weight: 500;
        margin: 0;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #666;
        cursor: pointer;
        padding: 0;
        width: auto;
      }

      .close-button:hover {
        color: #333;
      }

      .content {
        padding: 20px;
      }

      .message {
        margin: 0 0 20px 0;
        font-size: 1rem;
        color: #333;
      }

      .buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }

      button {
        padding: 12px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
        width: 100%;
        font-weight: 500;
      }

      .cancel-button {
        background-color: white;
        color: #666;
        border: 1px solid #ddd;
        order: 2;
      }

      .cancel-button:hover {
        background-color: #f5f5f5;
        border-color: #ccc;
      }

      .confirm-button {
        background-color: #ff6600;
        color: white;
        order: 1;
      }

      .confirm-button:hover {
        background-color: #e55c00;
      }
    `;
  }

  render() {
    if (!this.isOpen) return null;

    return x`
      <div class="wrapper" @click=${this.onCancel}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <div class="header">
            <h3 class="title">${i18n.t('messages.confirmTitle')}</h3>
            <button class="close-button" @click=${this.onCancel}>×</button>
          </div>
          <div class="content">
            <div class="message">${this.message}</div>
            <div class="buttons">
              <button class="confirm-button" @click=${this.onConfirm}>
                ${i18n.t('actions.confirm')}
              </button>
              <button class="cancel-button" @click=${this.onCancel}>
                ${i18n.t('actions.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-modal', ConfirmationModal);

const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';

const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: employee
});

const updateEmployee = (id, employee) => ({
  type: UPDATE_EMPLOYEE,
  payload: { id, employee }
});

const deleteEmployee = (id) => ({
  type: DELETE_EMPLOYEE,
  payload: id
});

const employeeReducer = (state = [], action) => {
  
  let newState;

  switch (action.type) {
    case ADD_EMPLOYEE:
      newState = [...state, action.payload];
      return newState;
      
    case UPDATE_EMPLOYEE:
      return state.map(employee => 
        employee.id === action.payload.id 
          ? { ...employee, ...action.payload.employee }
          : employee
      );
      
    case DELETE_EMPLOYEE:
      return state.filter(employee => employee.id !== action.payload);
      
    default:
      return state;
  }
};

class Store {
  constructor() {
    this.state = {
      employees: this._loadEmployeesFromStorage() || []
    };
    this.listeners = new Set();
    
    this._updateNextId();
  }
  
  _loadEmployeesFromStorage() {
    try {
      const storedEmployees = localStorage.getItem(StorageKeys.EMPLOYEES);
      const parsedEmployees = storedEmployees ? JSON.parse(storedEmployees) : [];
      return parsedEmployees;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }
  
  _saveEmployeesToStorage() {
    try {
      const employeesJson = JSON.stringify(this.state.employees);
      localStorage.setItem(StorageKeys.EMPLOYEES, employeesJson);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  _updateNextId() {
    this.nextId = this.state.employees.length > 0 
      ? Math.max(...this.state.employees.map(emp => emp.id)) + 1 
      : 1;
  }
  
  getState() {
    return {
      employees: [...this.state.employees]
    };
  }

  dispatch(action) {
    if (!action || !action.type) {
      console.error('Invalid action dispatched:', action);
      return;
    }
    
    if (action.type === ADD_EMPLOYEE) {
      if (!action.payload.id) {
        action.payload = {
          ...action.payload,
          id: this.nextId++
        };
      }
    }
    
    const newEmployees = employeeReducer(this.state.employees, action);
    
    this.state = {
      employees: newEmployees
    };
    
    
    this._saveEmployeesToStorage();
    this._updateNextId();
    
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }
}

const store = new Store();

export { addEmployee as a, deleteEmployee as d, i18n as i, store as s, updateEmployee as u };
//# sourceMappingURL=store-Dgn525jH.js.map
