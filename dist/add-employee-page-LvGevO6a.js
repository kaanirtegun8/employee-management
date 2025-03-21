import { r, L as Language, E as Events, i, x } from './app-C0-Sf9PK.js';
import { a as addEmployee, s as store, i as i18n } from './store-Dgn525jH.js';
import './employee-form-Dx8TifjP.js';

class AddEmployeePage extends r {
  static get properties() {
    return {
      lang: { type: String }
    };
  }
  
  constructor() {
    super();
    this.lang = document.documentElement.lang || Language.EN;
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
    this._boundHandleEmployeeCreated = this._handleEmployeeCreated.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('employee-created', this._boundHandleEmployeeCreated);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('employee-created', this._boundHandleEmployeeCreated);
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  _handleEmployeeCreated(e) {
    e.stopPropagation();
    const newEmployee = e.detail.employee;
    
    try {
      const action = addEmployee(newEmployee);
      
      store.dispatch(action);
    } catch (error) {
      console.error('Error creating employee. See console for details.', error);
    }
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
    `;
  }
  
  render() {
    return x`
      <app-top-bar></app-top-bar>
      
      <div class="container">
        <div class="page-content">
          <h2 class="page-title">${i18n.t('employeeForm.createTitle')}</h2>
          <employee-form @employee-created=${this._handleEmployeeCreated}></employee-form>
        </div>
      </div>
    `;
  }
}

customElements.define('add-employee-page', AddEmployeePage);

export { AddEmployeePage };
//# sourceMappingURL=add-employee-page-LvGevO6a.js.map
