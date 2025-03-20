import { LitElement, html, css } from 'lit';
import { router } from './services/router-service.js';
import { routes } from './routes/routes.js';
import { Router } from '@vaadin/router';

export class App extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        background-color: #f5f5f5;
        height: 100%; 
      }
    `;
  }

  constructor() {
    super();
    this.createRenderRoot();
  }
  
  createRenderRoot() {
    return this;
  }
  
  firstUpdated() {
    const outlet = this.querySelector('#outlet');
    if (outlet) {
      const appRouter = new Router(outlet);
      appRouter.setRoutes(routes);
      router.router = appRouter;
    }
  }

  render() {
    return html`
      <div id="outlet"></div>
    `;
  }
}

customElements.define('app-root', App); 