import { r, i, x } from './app-DZ_NUhAs.js';

class NotFoundPage extends r {
  static get styles() {
    return i`
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
    return x`
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage);

export { NotFoundPage };
//# sourceMappingURL=not-found-page-DD6KzXzu.js.map
