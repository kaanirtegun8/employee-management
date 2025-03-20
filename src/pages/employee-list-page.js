import { LitElement, html, css } from 'lit';

import '../components/layout/app-top-bar.js';
import '../components/employee/employee-list-header.js';
import '../components/employee/employee-table.js';
import '../components/ui/pagination.js';

export class EmployeeListPage extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      filteredEmployees: { type: Array },
      loading: { type: Boolean },
      viewMode: { type: String },
      currentPage: { type: Number },
      pageSize: { type: Number },
      searchQuery: { type: String }
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
      
      .pagination-container {
        background-color: transparent;
        padding: 0.5rem;
        text-align: center;
      }
    `;
  }
  
  connectedCallback() {
    super.connectedCallback();
    this._loadEmployees();
  }
  
  _loadEmployees() {
    this.loading = true;
    
    setTimeout(() => {
      this.employees = Array(50).fill(null).map((_, index) => ({
        id: index + 1,
        firstName: 'Ahmet',
        lastName: 'Sourtimes',
        dateOfEmployment: '23/09/2022',
        dateOfBirth: '23/09/2022',
        phoneNumber: '+90 532 123 45 67',
        email: 'ahmet@sourtimes.org',
        department: 'analytics',
        position: 'junior'
      }));
      
      this._applyFilters();
      this.loading = false;
    }, 1000);
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
    this.viewMode = e.detail.mode;
  }
  
  _onSearch(e) {
    this.searchQuery = e.detail.query;
    this.currentPage = 1;
    this._applyFilters();
  }
  
  _onPageChanged(e) {
    this.currentPage = e.detail.page;
  }
  
  _onEditEmployee(e) {
    const employee = e.detail.employee;
    console.log(`Edit employee: ${employee.id}`);
  }
  
  _onDeleteEmployee(e) {
    const employee = e.detail.employee;
    console.log(`Delete employee: ${employee.id}`);
  }
  
  render() {
    return html`
      <app-top-bar></app-top-bar>
      
      <div class="container">
        <div class="page-content">
          <employee-list-header
            .viewMode=${this.viewMode}
            @view-mode-changed=${this._onViewModeChanged}
            @search=${this._onSearch}
          ></employee-list-header>
          
          <employee-table
            .employees=${this._getCurrentPageEmployees()}
            .loading=${this.loading}
            @edit-employee=${this._onEditEmployee}
            @delete-employee=${this._onDeleteEmployee}
          ></employee-table>
        </div>
        
        <div class="pagination-container">
          <app-pagination
            .currentPage=${this.currentPage}
            .totalPages=${this._getTotalPages()}
            @page-changed=${this._onPageChanged}
          ></app-pagination>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-list-page', EmployeeListPage); 