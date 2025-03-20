import { LitElement, html, css } from 'lit';

import '../components/layout/app-top-bar.js';
import '../components/employee/employee-list-header.js';
import '../components/employee/employee-table.js';
import '../components/employee/employee-list.js';
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
      searchQuery: { type: String },
      isMobile: { type: Boolean }
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
    
    this._resizeHandler = this._handleResize.bind(this);
    window.addEventListener('resize', this._resizeHandler);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._resizeHandler);
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
      const firstNames = [
        'Ahmet', 'Mehmet', 'Ali', 'Mustafa', 'Hasan', 'İbrahim', 'Hüseyin', 'İsmail', 'Osman', 'Yusuf',
        'Ayşe', 'Fatma', 'Emine', 'Hatice', 'Zeynep', 'Elif', 'Meryem', 'Özlem', 'Sibel', 'Hülya'
      ];
      
      const lastNames = [
        'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Erdoğan', 'Öztürk', 'Aydın', 'Özdemir',
        'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Koç', 'Kurt', 'Korkmaz', 'Aksoy', 'Kaplan'
      ];
      
      const departments = ['analytics', 'development', 'marketing', 'sales', 'hr', 'finance', 'operations'];
      const positions = ['junior', 'mid', 'senior', 'manager', 'director', 'intern'];
      
      const randomDate = (start, end) => {
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      };
      
      const randomPhone = () => {
        const prefixes = ['532', '533', '535', '536', '537', '538', '539', '542', '544', '545', '546', '548', '549'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
        return `+90 ${prefix} ${number.substring(0, 3)} ${number.substring(3, 5)} ${number.substring(5, 7)}`;
      };
      
      this.employees = Array(150).fill(null).map((_, index) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        
        const now = new Date();
        const birthStart = new Date(now);
        birthStart.setFullYear(now.getFullYear() - 65);
        const birthEnd = new Date(now);
        birthEnd.setFullYear(now.getFullYear() - 22);
        const dateOfBirth = randomDate(birthStart, birthEnd);
        
        const empStart = new Date(now);
        empStart.setFullYear(now.getFullYear() - 10);
        const dateOfEmployment = randomDate(empStart, now);
        
        const emailName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o');
        const domains = ['company.com', 'example.org', 'sourtimes.org', 'acme.com', 'globex.net'];
        const email = `${emailName}@${domains[Math.floor(Math.random() * domains.length)]}`;
        
        return {
          id: index + 1,
          firstName,
          lastName,
          dateOfEmployment,
          dateOfBirth,
          phoneNumber: randomPhone(),
          email,
          department,
          position
        };
      });
      
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
  
  _onEditEmployee(e) {
    const employee = e.detail.employee;
    console.log(`Edit employee: ${employee.id}`);
  }
  
  _onDeleteEmployee(e) {
    const employee = e.detail.employee;
    console.log(`Delete employee: ${employee.id}`);
  }
  
  _renderEmployeeView() {
    const currentEmployees = this._getCurrentPageEmployees();
    
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
    return html`
      <app-top-bar></app-top-bar>
      
      <div class="container">
        <div class="page-content">
          <employee-list-header
            .viewMode=${this.viewMode}
            .isMobile=${this.isMobile}
            @view-mode-changed=${this._onViewModeChanged}
            @search=${this._onSearch}
          ></employee-list-header>
          
          ${this._renderEmployeeView()}
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