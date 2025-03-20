import { LitElement, html, css } from 'lit';

export class EmployeeEditPage extends LitElement {
  static get properties() {
    return {
      employeeId: { type: String }
    };
  }
  
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
      <h2>Edit Employee</h2>
      <p>Employee ID: ${this.employeeId}</p>
      <p>Employee edit form will be displayed here</p>
    `;
  }
}

customElements.define('employee-edit-page', EmployeeEditPage); 