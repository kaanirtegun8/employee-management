import { LitElement, html, css } from 'lit';

import '../components/layout/app-top-bar.js';
import '../components/employee/employee-list-header.js';
import '../components/employee/employee-table.js';
import '../components/employee/employee-list.js';
import '../components/ui/pagination.js';
import '../components/common/confirmation-modal.js';
import { i18n } from '../i18n/i18n.js';
import { store } from '../services/store/store.js';
import { deleteEmployee } from '../services/store/actions.js';
import { router } from '../services/router-service.js';

export class EmployeeListPage extends LitElement {
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
    this.viewMode = 'table';
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
    
    if (!wasMobile && this.isMobile) {
      this.viewMode = 'list';
    }
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
        padding: 20px;
        margin-bottom: 1rem;

        @media (max-width: 767px) {
          margin-top: 60px;
        }
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
    } else {
      this.viewMode = 'list';
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
      return html`
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
    
    if (this.isMobile || this.viewMode === 'list') {
      return html`
        <employee-list
          .employees=${currentEmployees}
          .loading=${this.loading}
          @edit-employee=${this._onEditEmployee}
          @delete-employee=${this._onDeleteEmployee}
        ></employee-list>
      `;
    } else {
      return html`
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
    
    return html`
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
        
        ${totalPages > 1 ? html`
          <div class="pagination-container">
            <pagination-component
              .currentPage=${this.currentPage}
              .totalPages=${totalPages}
              @page-changed=${this._onPageChanged}
            ></pagination-component>
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