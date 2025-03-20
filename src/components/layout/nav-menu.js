import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';

export class NavMenu extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        background-color: #333;
        color: white;
      }
      
      nav {
        display: flex;
        padding: 0 16px;
      }
      
      ul {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      li {
        padding: 16px;
      }
      
      a {
        color: white;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
    `;
  }
  
  render() {
    return html`
      <nav>
        <ul>
          <li>
            <a href="/">${i18n.t('navigation.employees')}</a>
          </li>
          <li>
            <a href="/create">${i18n.t('navigation.createEmployee')}</a>
          </li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu); 