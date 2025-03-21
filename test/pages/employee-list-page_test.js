import { fixture, html, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../src/pages/employee-list-page.js';
import { store } from '../../src/services/store/store.js';
import { router } from '../../src/services/router-service.js';
import { ViewMode } from '../../src/constants/enums.js';

suite('EmployeeListPage', () => {
  let element;
  let storeDispatchStub;
  let routerNavigateStub;

  const mockEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'IT'
    }
  ];

  setup(async () => {
    storeDispatchStub = stub(store, 'dispatch');
    routerNavigateStub = stub(router, 'navigate');
    
    stub(store, 'getState').returns({ employees: mockEmployees });
    stub(store, 'subscribe').callsFake(callback => {
      callback({ employees: mockEmployees });
      return () => {};
    });
    
    element = await fixture(html`<employee-list-page></employee-list-page>`);
    await element.updateComplete;
  });

  teardown(() => {
    storeDispatchStub.restore();
    routerNavigateStub.restore();
    store.getState.restore();
    store.subscribe.restore();
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('employee-list-page'));
  });

  test('should handle view mode change', async () => {
    element.viewMode = ViewMode.LIST;
    await element.updateComplete;
    expect(element.viewMode).to.equal(ViewMode.LIST);
  });

  test('should show confirmation modal when deleting employee', async () => {
    element.employeeToDelete = mockEmployees[0];
    element.showConfirmModal = true;
    await element.updateComplete;
    
    const modal = element.shadowRoot.querySelector('confirmation-modal');
    expect(modal).to.exist;
    expect(element.showConfirmModal).to.be.true;
  });

  test('should show empty state when no employees', async () => {
    element.employees = [];
    element.filteredEmployees = [];
    await element.updateComplete;
    
    const pageContent = element.shadowRoot.querySelector('.page-content');
    expect(pageContent).to.exist;
  });

  test('should show loading state', async () => {
    element.loading = true;
    await element.updateComplete;
    
    const pageContent = element.shadowRoot.querySelector('.page-content');
    expect(pageContent).to.exist;
  });
}); 