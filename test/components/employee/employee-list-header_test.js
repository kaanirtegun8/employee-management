import { fixture, html, expect } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/components/employee/employee-list-header.js';
import { ViewMode, Events } from '../../../src/constants/enums.js';

suite('EmployeeListHeader', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<employee-list-header></employee-list-header>`);
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('employee-list-header'));
  });

  test('should initialize with table view mode', () => {
    expect(element.viewMode).to.equal(ViewMode.TABLE);
  });

  test('should change view mode and dispatch event', async () => {
    const eventSpy = spy();
    element.addEventListener('view-mode-changed', eventSpy);

    const listButton = element.shadowRoot.querySelector('.view-button:last-child');
    listButton.click();
    await element.updateComplete;

    expect(element.viewMode).to.equal(ViewMode.LIST);
    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail).to.deep.equal({ mode: ViewMode.LIST });
  });

  test('should dispatch search event when input changes', async () => {
    const eventSpy = spy();
    element.addEventListener('search', eventSpy);

    const searchInput = element.shadowRoot.querySelector('.search-input');
    searchInput.value = 'test';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;

    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail).to.deep.equal({ query: 'test' });
  });

  test('should update language when language changed event is dispatched', async () => {
    const newLang = 'tr';
    window.dispatchEvent(new CustomEvent(Events.LANGUAGE_CHANGED, {
      detail: { lang: newLang }
    }));
    await element.updateComplete;

    expect(element.lang).to.equal(newLang);
  });

  test('should show active state for current view mode', async () => {
    const tableButton = element.shadowRoot.querySelector('.view-button:first-child');
    expect(tableButton.classList.contains('active')).to.be.true;

    element.viewMode = ViewMode.LIST;
    await element.updateComplete;

    const listButton = element.shadowRoot.querySelector('.view-button:last-child');
    expect(listButton.classList.contains('active')).to.be.true;
  });
}); 