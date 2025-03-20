import { LitElement, html, css } from 'lit';

export class EmployeeCreatePage extends LitElement {
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
      <h2>Create New Employee</h2>
      <p>Employee creation form will be displayed here</p>
    `;
  }
}

customElements.define('employee-create-page', EmployeeCreatePage); 