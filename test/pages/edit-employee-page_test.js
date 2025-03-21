import { fixture, html, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../src/pages/edit-employee-page.js';
import { store } from '../../src/services/store/store.js';
import { router } from '../../src/services/router-service.js';
import { Language } from '../../src/constants/enums.js';

suite('EditEmployeePage', () => {
  let element;
  let storeDispatchStub;
  let routerNavigateStub;

  const mockEmployee = {
    id: 1,
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
    routerNavigateStub = stub(router, 'navigate');
    
    stub(store, 'getState').returns({ employees: [mockEmployee] });
    
    element = await fixture(html`<edit-employee-page></edit-employee-page>`);
  });

  teardown(() => {
    storeDispatchStub.restore();
    routerNavigateStub.restore();
    store.getState.restore();
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('edit-employee-page'));
  });

  test('should initialize with default values', () => {
    expect(element.employeeId).to.equal('');
    expect(element.employeeData).to.be.null;
    expect(element.lang).to.equal(Language.EN);
    expect(element.loading).to.be.true;
  });

  test('should load employee data on route enter', async () => {
    element.onBeforeEnter({ params: { id: '1' } });
    await element.updateComplete;

    expect(element.employeeId).to.equal('1');
    expect(element.employeeData).to.deep.equal(mockEmployee);
    expect(element.loading).to.be.false;
  });

  test('should navigate to home if employee not found', async () => {
    store.getState.returns({ employees: [] });
    element.onBeforeEnter({ params: { id: '999' } });
    await element.updateComplete;

    await new Promise(resolve => setTimeout(resolve, 600));

    expect(routerNavigateStub).to.have.been.calledWith('/');
  });

  test('should render loading state', async () => {
    element.loading = true;
    await element.updateComplete;

    const loadingMessage = element.shadowRoot.querySelector('.page-content p');
    expect(loadingMessage).to.exist;
  });

  test('should render employee form when data is loaded', async () => {
    element.loading = false;
    element.employeeId = '1';
    element.employeeData = mockEmployee;
    await element.updateComplete;

    const form = element.shadowRoot.querySelector('employee-form');
    expect(form).to.exist;
    expect(form.employee).to.deep.equal(mockEmployee);
  });

  test('should update language when language changed event is received', async () => {
    const newLang = Language.TR;
    window.dispatchEvent(new CustomEvent('language-changed', {
      detail: { lang: newLang }
    }));
    await element.updateComplete;

    expect(element.lang).to.equal(newLang);
  });

  test('should render page title and employee ID', async () => {
    element.loading = false;
    element.employeeId = '1';
    element.employeeData = mockEmployee;
    await element.updateComplete;

    const title = element.shadowRoot.querySelector('.page-title');
    const idElement = element.shadowRoot.querySelector('.employee-id');

    expect(title).to.exist;
    expect(idElement.textContent).to.include('1');
  });

  test('should render app-top-bar', async () => {
    const topBar = element.shadowRoot.querySelector('app-top-bar');
    expect(topBar).to.exist;
  });
}); 