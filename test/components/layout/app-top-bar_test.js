import { fixture, html, expect } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/components/layout/app-top-bar.js';
import { Language } from '../../../src/constants/enums.js';

suite('AppTopBar', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<app-top-bar></app-top-bar>`);
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('app-top-bar'));
  });

  test('should initialize with default language', () => {
    expect(element.currentLang).to.equal(Language.EN);
  });

  test('should render logo with correct attributes', async () => {
    const logo = element.shadowRoot.querySelector('.logo');
    const logoIcon = logo.querySelector('.logo-icon');
    const logoText = logo.querySelector('.logo-text');

    expect(logo.href).to.equal(window.location.origin + '/');
    expect(logoIcon.src).to.include('/src/assets/images/logo.webp');
    expect(logoIcon.alt).to.equal('ING Logo');
    expect(logoText.textContent).to.equal('ING');
  });

  test('should render navigation links', async () => {
    const employeesLink = element.shadowRoot.querySelector('.employees-link');
    const addButton = element.shadowRoot.querySelector('.add-button');

    expect(employeesLink.href).to.equal(window.location.origin + '/');
    expect(addButton.href).to.equal(window.location.origin + '/add-new');
  });

  test('should change language when language button is clicked', async () => {
    const eventSpy = spy();
    element.addEventListener('lang-changed', eventSpy);

    const trButton = element.shadowRoot.querySelector('.lang-button:last-child');
    trButton.click();
    await element.updateComplete;

    expect(element.currentLang).to.equal(Language.TR);
    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail).to.deep.equal({ lang: Language.TR });
  });

  test('should update language when language changed event is received', async () => {
    const newLang = Language.TR;
    window.dispatchEvent(new CustomEvent('language-changed', {
      detail: { lang: newLang }
    }));
    await element.updateComplete;

    expect(element.currentLang).to.equal(newLang);
  });

  test('should render language buttons with correct titles', async () => {
    const enButton = element.shadowRoot.querySelector('.lang-button:first-child');
    const trButton = element.shadowRoot.querySelector('.lang-button:last-child');

    expect(enButton.title).to.equal('English');
    expect(trButton.title).to.equal('Türkçe');
  });

  test('should render user icon and add icon', async () => {
    const userIcon = element.shadowRoot.querySelector('.user-icon');
    const addIcon = element.shadowRoot.querySelector('.add-icon');

    expect(userIcon.textContent).to.equal('👤');
    expect(addIcon.textContent).to.equal('+');
  });
}); 