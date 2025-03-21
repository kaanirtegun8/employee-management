import { LitElement, html, css } from 'lit';

export class TestModal extends LitElement {
  static get properties() {
    return {
      isOpen: { 
        type: Boolean,
        reflect: true
      }
    };
  }

  constructor() {
    super();
    this.isOpen = false;
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
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        min-width: 300px;
        text-align: center;
      }

      .close-button {
        margin-top: 10px;
        padding: 8px 16px;
        background: #ff6600;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .close-button:hover {
        background: #e55c00;
      }
    `;
  }

  close() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('modal-closed'));
  }

  render() {
    if (!this.isOpen) return null;

    return html`
      <div class="wrapper" @click=${this.close}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <div>Hello</div>
          <button class="close-button" @click=${this.close}>Close</button>
        </div>
      </div>
    `;
  }
}

customElements.define('test-modal', TestModal); 