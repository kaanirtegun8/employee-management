import { fixture, html, expect } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/components/common/confirmation-modal.js';

suite('ConfirmationModal', () => {
  let element;
  let onConfirmSpy;
  let onCancelSpy;

  setup(async () => {
    onConfirmSpy = spy();
    onCancelSpy = spy();
    element = await fixture(html`
      <confirmation-modal
        .isOpen=${false}
        .message=${'Test message'}
        .onConfirm=${onConfirmSpy}
        .onCancel=${onCancelSpy}
      ></confirmation-modal>
    `);
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('confirmation-modal'));
  });

  test('should not render content when closed', () => {
    expect(element.shadowRoot.querySelector('.wrapper')).to.be.null;
  });

  test('should render content when open', async () => {
    element.isOpen = true;
    await element.updateComplete;
    expect(element.shadowRoot.querySelector('.wrapper')).to.exist;
  });

  test('should display the provided message', async () => {
    element.isOpen = true;
    element.message = 'Custom test message';
    await element.updateComplete;
    expect(element.shadowRoot.querySelector('.message').textContent).to.equal('Custom test message');
  });

  test('should call onConfirm when confirm button is clicked', async () => {
    element.isOpen = true;
    await element.updateComplete;
    element.shadowRoot.querySelector('.confirm-button').click();
    expect(onConfirmSpy).to.have.been.calledOnce;
  });

  test('should call onCancel when cancel button is clicked', async () => {
    element.isOpen = true;
    await element.updateComplete;
    element.shadowRoot.querySelector('.cancel-button').click();
    expect(onCancelSpy).to.have.been.calledOnce;
  });

  test('should call onCancel when clicking outside the modal', async () => {
    element.isOpen = true;
    await element.updateComplete;
    element.shadowRoot.querySelector('.wrapper').click();
    expect(onCancelSpy).to.have.been.calledOnce;
  });

  test('should not call onCancel when clicking inside the modal', async () => {
    element.isOpen = true;
    await element.updateComplete;
    element.shadowRoot.querySelector('.dialog').click();
    expect(onCancelSpy).to.not.have.been.called;
  });
}); 