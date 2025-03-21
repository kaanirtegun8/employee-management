import { r, L as Language, E as Events, a as router, i, x } from './app-C0-Sf9PK.js';
import { s as store, u as updateEmployee, i as i18n } from './store-Dgn525jH.js';
import './employee-form-Dx8TifjP.js';

class EditEmployeePage extends r {
  static get properties() {
    return {
      employeeId: { type: String },
      employeeData: { type: Object },
      lang: { type: String },
      loading: { type: Boolean }
    };
  }
  
  constructor() {
    super();
    this.employeeId = '';
    this.employeeData = null;
    this.lang = document.documentElement.lang || Language.EN;
    this.loading = true;
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  onBeforeEnter(location) {
    this.employeeId = location.params.id;
    this._loadEmployeeData();
  }
  
  _loadEmployeeData() {
    this.loading = true;
    
    const id = parseInt(this.employeeId, 10);
    
    const employee = store.getState().employees.find(emp => emp.id === id);
    
    if (employee) {
      this.employeeData = { ...employee };
      this.loading = false;
    } else {
      console.error(`Employee with ID ${id} not found`);
      setTimeout(() => {
        router.navigate('/');
      }, 500);
    }
  }
  
  _handleEmployeeUpdated(e) {
    const updatedEmployee = e.detail.employee;
    
    const id = parseInt(this.employeeId, 10);
    store.dispatch(updateEmployee(id, updatedEmployee));
  }
  
  static get styles() {
    return i`
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
        padding: 20px;
        margin-bottom: 1rem;
      }
      
      .page-title {
        font-size: 1.5rem;
        color: #ff6600;
        font-weight: bold;
        margin: 0 0 1.25rem 0;
      }
      
      .employee-id {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1.25rem;
      }
    `;
  }
  
  render() {
    if (this.loading) {
      return x`
        <app-top-bar></app-top-bar>
        <div class="container">
          <div class="page-content">
            <p>${i18n.t('loading')}</p>
          </div>
        </div>
      `;
    }
    
    return x`
      <app-top-bar></app-top-bar>
      
      <div class="container">
        <div class="page-content">
          <h2 class="page-title">${i18n.t('employeeForm.editTitle')}</h2>
          <p class="employee-id">ID: ${this.employeeId}</p>
          <employee-form 
            .employee=${this.employeeData || {}}
            @employee-updated=${this._handleEmployeeUpdated}
          ></employee-form>
        </div>
      </div>
    `;
  }
}

customElements.define('edit-employee-page', EditEmployeePage);

export { EditEmployeePage };
//# sourceMappingURL=edit-employee-page-BlYBRw2s.js.map
