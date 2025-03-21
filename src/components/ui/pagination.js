import { LitElement, html, css } from 'lit';

export class Pagination extends LitElement {
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
    return css`
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
    
    return html`
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
          
          ${visiblePages.map(page => html`
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