import { LitElement, html, css } from 'lit';
import { i18n } from '../../i18n/i18n.js';
import { Language } from '../../constants/enums.js';

export class ConfirmationModal extends LitElement {
  static get properties() {
    return {
      isOpen: { type: Boolean, reflect: true },
      message: { type: String },
      onConfirm: { attribute: false },
      onCancel: { attribute: false },
      lang: { type: String }
    };
  }

  constructor() {
    super();
    this.isOpen = false;
    this.message = '';
    this.lang = document.documentElement.lang || Language.EN;
    
    window.addEventListener('language-changed', this._onLanguageChanged.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this._onLanguageChanged.bind(this));
  }

  _onLanguageChanged(e) {
    this.lang = e.detail.lang;
    this.requestUpdate();
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }

      :host([isopen]) {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
      }

      .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
      }

      .dialog {
        background: white;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        min-width: 400px;
        max-width: 90%;
        text-align: left;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #eee;
      }

      .title {
        font-size: 1.1rem;
        color: #ff6600;
        font-weight: 500;
        margin: 0;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #666;
        cursor: pointer;
        padding: 0;
        width: auto;
      }

      .close-button:hover {
        color: #333;
      }

      .content {
        padding: 20px;
      }

      .message {
        margin: 0 0 20px 0;
        font-size: 1rem;
        color: #333;
      }

      .buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }

      button {
        padding: 12px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
        width: 100%;
        font-weight: 500;
      }

      .cancel-button {
        background-color: white;
        color: #666;
        border: 1px solid #ddd;
        order: 2;
      }

      .cancel-button:hover {
        background-color: #f5f5f5;
        border-color: #ccc;
      }

      .confirm-button {
        background-color: #ff6600;
        color: white;
        order: 1;
      }

      .confirm-button:hover {
        background-color: #e55c00;
      }
    `;
  }

  render() {
    if (!this.isOpen) return null;

    return html`
      <div class="wrapper" @click=${this.onCancel}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <div class="header">
            <h3 class="title">${i18n.t('messages.confirmTitle')}</h3>
            <button class="close-button" @click=${this.onCancel}>×</button>
          </div>
          <div class="content">
            <div class="message">${this.message}</div>
            <div class="buttons">
              <button class="confirm-button" @click=${this.onConfirm}>
                ${i18n.t('actions.confirm')}
              </button>
              <button class="cancel-button" @click=${this.onCancel}>
                ${i18n.t('actions.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-modal', ConfirmationModal); 