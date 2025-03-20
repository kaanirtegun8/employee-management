import { LitElement, html, css } from 'lit';
import { router } from './services/router-service.js';
import { routes } from './routes/routes.js';
import { i18n } from './i18n/i18n.js';

export class App extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        text-align: center;
        padding-top: 50px;
      }
      
      main {
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }
      
      h1 {
        color: #1976d2;
        font-size: 28px;
      }
    `;
  }

  constructor() {
    super();
    router.init(routes);
  }

  render() {
    return html`
      <main>
        <h1>${i18n.t('app.title')}</h1>
      </main>
    `;
  }
}

customElements.define('app-root', App); 