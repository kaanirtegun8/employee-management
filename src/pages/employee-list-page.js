import { LitElement, html, css } from 'lit';

export class EmployeeListPage extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
      }
    `;
  }
  
  render() {
    return html`
      <h2>Employee List</h2>
      <p>Employee list will be displayed here</p>
    `;
  }
}

customElements.define('employee-list-page', EmployeeListPage); 