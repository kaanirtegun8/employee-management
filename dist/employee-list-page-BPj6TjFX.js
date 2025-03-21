import { r, V as ViewMode, L as Language, E as Events, i, x, a as router } from './app-C0-Sf9PK.js';
import { i as i18n, s as store, d as deleteEmployee } from './store-Dgn525jH.js';

class EmployeeListHeader extends r {
  static get properties() {
    return {
      viewMode: { type: String },
      lang: { type: String },
      isMobile: { type: Boolean }
    };
  }
  
  constructor() {
    super();
    this.viewMode = ViewMode.TABLE;
    this.lang = document.documentElement.lang || Language.EN;
    this.isMobile = false;
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  static get styles() {
    return i`
      :host {
        display: block;
        margin-bottom: 1rem;
      }
      
      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .title {
        font-size: 24px;
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
      
      @media (max-width: 767px) {
        .list-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .title {
          font-size: 1.2rem;
        }
        
        .view-controls {
          display: none;
        }
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
    return x`
      <div class="list-header">
        <h2 class="title">${i18n.t('employeeList.title')}</h2>
        
        <div class="view-controls">
          <button 
            class="view-button ${this.viewMode === ViewMode.TABLE ? 'active' : ''}" 
            @click=${() => this._handleViewChange(ViewMode.TABLE)}
            title="${i18n.t('employeeList.table')}">
            ☰
          </button>
          <button 
            class="view-button ${this.viewMode === ViewMode.LIST ? 'active' : ''}" 
            @click=${() => this._handleViewChange(ViewMode.LIST)}
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

class EmployeeTable extends r {
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
    this.lang = document.documentElement.lang || Language.EN;
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  static get styles() {
    return i`
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
      return x`<div class="loading-message">${i18n.t('loading') || 'Loading...'}</div>`;
    }
    
    if (!this.employees || this.employees.length === 0) {
      return x`<div class="empty-message">${i18n.t('employeeList.empty')}</div>`;
    }
    
    return x`
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
          ${this.employees.map(employee => x`
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
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);

class EmployeeList extends r {
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
    this.lang = document.documentElement.lang || Language.EN;
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }
  
  static get styles() {
    return i`
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
      return x`<div class="loading-message">${i18n.t('loading')}</div>`;
    }
    
    if (!this.employees || this.employees.length === 0) {
      return x`<div class="empty-message">${i18n.t('employeeList.empty')}</div>`;
    }
    
    return x`
      <div class="employee-list">
        ${this.employees.map(employee => x`
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

class Pagination extends r {
  static get properties() {
    return {
      currentPage: { type: Number },
      totalPages: { type: Number },
      visiblePageCount: { type: Number }
    };
  }
  
  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.visiblePageCount = 5;
  }
  
  static get styles() {
    return i`
      :host {
        display: block;
        margin: 1rem 0;
      }
      
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .page-item {
        margin: 0 0.2rem;
      }
      
      .page-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        text-decoration: none;
        color: #666;
        background-color: transparent;
        border: 1px solid #ddd;
        cursor: pointer;
      }
      
      .page-link.active {
        background-color: #ff6600;
        border-color: #ff6600;
        color: white;
      }
      
      .page-link:hover:not(.active) {
        background-color: #f5f5f5;
      }
      
      .page-link.disabled {
        color: #ccc;
        cursor: not-allowed;
        pointer-events: none;
      }
      
      @media (max-width: 576px) {
        .pagination {
          flex-wrap: wrap;
        }
      }
    `;
  }
  
  _onPageChange(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    
    this.currentPage = page;
    this.dispatchEvent(new CustomEvent('page-changed', {
      detail: { page },
      bubbles: true,
      composed: true
    }));
  }
  
  _getVisiblePages() {
    const visibleRange = this.visiblePageCount - 1;
    const halfRange = Math.floor(visibleRange / 2);
    
    const startPage = Math.max(1, this.currentPage - halfRange);
    const endPage = Math.min(this.totalPages, startPage + visibleRange);
    
    const adjustedStart = Math.max(1, endPage - visibleRange);
    
    return [...Array(endPage - adjustedStart + 1)].map((_, index) => adjustedStart + index);
  }
  
  render() {
    const visiblePages = this._getVisiblePages();
    
    return x`
      <nav aria-label="Pagination">
        <ul class="pagination">
          <li class="page-item">
            <button 
              class="page-link ${this.currentPage === 1 ? 'disabled' : ''}" 
              @click=${() => this._onPageChange(this.currentPage - 1)}
              aria-label="Previous">
              &laquo;
            </button>
          </li>
          
          ${visiblePages.map(page => x`
            <li class="page-item">
              <button 
                class="page-link ${page === this.currentPage ? 'active' : ''}" 
                @click=${() => this._onPageChange(page)}>
                ${page}
              </button>
            </li>
          `)}
          
          <li class="page-item">
            <button 
              class="page-link ${this.currentPage === this.totalPages ? 'disabled' : ''}" 
              @click=${() => this._onPageChange(this.currentPage + 1)}
              aria-label="Next">
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('app-pagination', Pagination);

class EmployeeListPage extends r {
  static get properties() {
    return {
      employees: { type: Array },
      filteredEmployees: { type: Array },
      loading: { type: Boolean },
      viewMode: { type: String },
      currentPage: { type: Number },
      pageSize: { type: Number },
      searchQuery: { type: String },
      isMobile: { type: Boolean },
      showConfirmModal: { type: Boolean },
      confirmMessage: { type: String },
      employeeToDelete: { type: Object }
    };
  }
  
  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.loading = true;
    this.viewMode = ViewMode.TABLE;
    this.currentPage = 1;
    this.pageSize = 10;
    this.searchQuery = '';
    this.isMobile = window.innerWidth < 768;
    this.showConfirmModal = false;
    this.confirmMessage = '';
    this.employeeToDelete = null;
    
    this._resizeHandler = this._handleResize.bind(this);
    window.addEventListener('resize', this._resizeHandler);
    
    this._unsubscribe = store.subscribe(state => {
      this.employees = state.employees;
      this._applyFilters();
      this.loading = false;
    });
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._resizeHandler);
    
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
  
  _handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    
    if (wasMobile !== this.isMobile) {
      if (this.isMobile) {
        this.viewMode = ViewMode.LIST;
      } else if (this.viewMode === ViewMode.LIST) {
        this.viewMode = ViewMode.TABLE;
      }
      this.requestUpdate();
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
      
      .pagination-container {
        background-color: transparent;
        padding: 0.5rem;
        text-align: center;
      }
      
      .empty-state {
        text-align: center;
        padding: 2rem;
        color: #666;
      }
      
      .empty-state-icon {
        font-size: 3rem;
        color: #ccc;
        margin-bottom: 1rem;
      }
      
      .empty-state-message {
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }
      
      .empty-state-action {
        margin-top: 1rem;
      }
      
      .btn-add {
        background-color: #ff6600;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
      }
      
      .btn-add:hover {
        background-color: #e55c00;
      }
      
      .test-button {
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        margin: 1rem;
      }
      
      .test-button:hover {
        background-color: #45a049;
      }
    `;
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.currentPage = 1;
    this._loadEmployees();
  }
  
  _loadEmployees() {
    this.loading = true;
    
    this.employees = store.getState().employees;
    this._applyFilters();
    
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }
  
  _applyFilters() {
    let result = [...this.employees];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(emp => 
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.phoneNumber.includes(query)
      );
    }
    
    this.filteredEmployees = result;
  }
  
  _getCurrentPageEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEmployees.slice(start, end);
  }
  
  _getTotalPages() {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }
  
  _onViewModeChanged(e) {
    if (!this.isMobile) {
      this.viewMode = e.detail.mode;
      this.requestUpdate();
    }
  }
  
  _onSearch(e) {
    this.searchQuery = e.detail.query;
    this.currentPage = 1;
    this._applyFilters();
  }
  
  _onPageChanged(e) {
    this.currentPage = e.detail.page;
  }
  
  _onDeleteEmployee(e) {
    const employee = e.detail.employee;
    this.employeeToDelete = employee;
    this.confirmMessage = i18n.t('messages.confirmDelete');
    this.showConfirmModal = true;
   
    this.requestUpdate();
  }
  
  _handleConfirmDelete() {
    if (this.employeeToDelete) {
      store.dispatch(deleteEmployee(this.employeeToDelete.id));
      this.showConfirmModal = false;
      this.employeeToDelete = null;
    }
  }
  
  _handleCancelDelete() {
    this.showConfirmModal = false;
    this.employeeToDelete = null;
  }
  
  _renderEmployeeView() {
    const currentEmployees = this._getCurrentPageEmployees();
    
    if (!this.loading && this.filteredEmployees.length === 0) {
      return x`
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-message">${i18n.t('employeeList.empty')}</div>
          <div class="empty-state-action">
            <button @click=${() => router.navigate('/add-new')} class="btn-add">
              ${i18n.t('navigation.createEmployee')}
            </button>
          </div>
        </div>
      `;
    }
    
    if (this.isMobile || this.viewMode === ViewMode.LIST) {
      return x`
        <employee-list
          .employees=${currentEmployees}
          .loading=${this.loading}
          @edit-employee=${this._onEditEmployee}
          @delete-employee=${this._onDeleteEmployee}
        ></employee-list>
      `;
    } else {
      return x`
        <employee-table
          .employees=${currentEmployees}
          .loading=${this.loading}
          @edit-employee=${this._onEditEmployee}
          @delete-employee=${this._onDeleteEmployee}
        ></employee-table>
      `;
    }
  }
  
  render() {
    const totalPages = this._getTotalPages();
    
    return x`
      <app-top-bar></app-top-bar>
      
      <div class="container">
        <div class="page-content">
          <employee-list-header
            @view-mode-changed=${this._onViewModeChanged}
            @search=${this._onSearch}
            .viewMode=${this.viewMode}
          ></employee-list-header>
          
          ${this._renderEmployeeView()}
        </div>
        
        ${totalPages > 1 ? x`
          <div class="pagination-container">
            <app-pagination
              .currentPage=${this.currentPage}
              .totalPages=${totalPages}
              @page-changed=${this._onPageChanged}
            ></app-pagination>
          </div>
        ` : ''}
      </div>

      <confirmation-modal
        .isOpen=${this.showConfirmModal}
        .message=${this.confirmMessage}
        .onConfirm=${() => this._handleConfirmDelete()}
        .onCancel=${() => this._handleCancelDelete()}
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-list-page', EmployeeListPage);

export { EmployeeListPage };
//# sourceMappingURL=employee-list-page-BPj6TjFX.js.map
