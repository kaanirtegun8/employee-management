import { LitElement, html, css } from 'lit';
import { router } from './services/router-service.js';
import { routes } from './routes/routes.js';
import { Router } from '@vaadin/router';
import { Events, Language } from './constants/enums.js';

export class App extends LitElement {
  static get properties() {
    return {
      lang: { type: String }
    };
  }
  
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
    this.lang = document.documentElement.lang || Language.EN;
    this.createRenderRoot();
    
    window.addEventListener(Events.LANGUAGE_CHANGED, this._onLanguageChanged.bind(this));
  }
  
  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
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
      <div id="outlet" lang="${this.lang}"></div>
    `;
  }
}

customElements.define('app-root', App); 