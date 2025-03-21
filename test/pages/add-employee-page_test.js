import { fixture, html, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../src/pages/add-employee-page.js';
import { store } from '../../src/services/store/store.js';
import { Language } from '../../src/constants/enums.js';

suite('AddEmployeePage', () => {
  let element;
  let storeDispatchStub;

  const mockEmployee = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    department: 'tech',
    position: 'senior',
    dateOfBirth: '1990-01-01',
    dateOfEmployment: '2023-01-01'
  };

  setup(async () => {
    storeDispatchStub = stub(store, 'dispatch');
    element = await fixture(html`<add-employee-page></add-employee-page>`);
  });

  teardown(() => {
    storeDispatchStub.restore();
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('add-employee-page'));
  });

  test('should initialize with default language', () => {
    expect(element.lang).to.equal(Language.EN);
  });

  test('should render app-top-bar', async () => {
    const topBar = element.shadowRoot.querySelector('app-top-bar');
    expect(topBar).to.exist;
  });

  test('should render employee form', async () => {
    const form = element.shadowRoot.querySelector('employee-form');
    expect(form).to.exist;
  });

  test('should render page title', async () => {
    const title = element.shadowRoot.querySelector('.page-title');
    expect(title).to.exist;
  });

  test('should handle employee creation', async () => {
    const event = new CustomEvent('employee-created', {
      detail: { employee: mockEmployee }
    });
    element.dispatchEvent(event);
    await element.updateComplete;

    expect(storeDispatchStub).to.have.been.calledOnce;
  });

  test('should update language when language changed event is received', async () => {
    const newLang = Language.TR;
    window.dispatchEvent(new CustomEvent('language-changed', {
      detail: { lang: newLang }
    }));
    await element.updateComplete;

    expect(element.lang).to.equal(newLang);
  });

  test('should handle employee creation error gracefully', async () => {
    storeDispatchStub.throws(new Error('Test error'));
    const consoleErrorStub = stub(console, 'error');

    const event = new CustomEvent('employee-created', {
      detail: { employee: mockEmployee }
    });
    element.dispatchEvent(event);
    await element.updateComplete;

    expect(consoleErrorStub).to.have.been.calledOnce;
    consoleErrorStub.restore();
  });

  test('should add event listener on connect and remove on disconnect', async () => {
    const addEventListenerSpy = stub(element, 'addEventListener');
    const removeEventListenerSpy = stub(element, 'removeEventListener');

    element.connectedCallback();
    expect(addEventListenerSpy).to.have.been.calledWith('employee-created');

    element.disconnectedCallback();
    expect(removeEventListenerSpy).to.have.been.calledWith('employee-created');

    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
  });
}); 