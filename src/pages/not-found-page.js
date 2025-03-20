import { LitElement, html, css } from 'lit';

export class NotFoundPage extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        text-align: center;
      }
      h2 {
        color: #d32f2f;
      }
    `;
  }
  
  render() {
    return html`
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage); 