import { fixture, html, expect } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import '../../../src/components/employee/employee-table.js';
import { router } from '../../../src/services/router-service.js';

suite('EmployeeTable', () => {
  let element;
  let routerNavigateStub;

  const mockEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      department: 'tech',
      position: 'senior',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2023-01-01'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phoneNumber: '0987654321',
      department: 'analytics',
      position: 'junior',
      dateOfBirth: '1985-05-15',
      dateOfEmployment: '2022-06-01'
    }
  ];

  setup(async () => {
    routerNavigateStub = stub(router, 'navigate');
    element = await fixture(html`<employee-table></employee-table>`);
  });

  teardown(() => {
    routerNavigateStub.restore();
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('employee-table'));
  });

  test('should initialize with empty employees array', () => {
    expect(element.employees).to.be.an('array').that.is.empty;
    expect(element.loading).to.be.false;
  });

  test('should show loading message when loading', async () => {
    element.loading = true;
    await element.updateComplete;
    
    const loadingMessage = element.shadowRoot.querySelector('.loading-message');
    expect(loadingMessage).to.exist;
  });

  test('should show empty message when no employees', async () => {
    const emptyMessage = element.shadowRoot.querySelector('.empty-message');
    expect(emptyMessage).to.exist;
  });

  test('should render employee table with correct headers', async () => {
    element.employees = mockEmployees;
    await element.updateComplete;
    
    const table = element.shadowRoot.querySelector('.employee-table');
    expect(table).to.exist;
    
    const headers = table.querySelectorAll('th');
    expect(headers.length).to.equal(10);
  });

  test('should render employee rows with correct data', async () => {
    element.employees = mockEmployees;
    await element.updateComplete;
    
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(2);
    
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td');
    
    expect(cells[1].textContent).to.equal(mockEmployees[0].firstName);
    expect(cells[2].textContent).to.equal(mockEmployees[0].lastName);
    expect(cells[3].textContent).to.equal(mockEmployees[0].dateOfEmployment);
    expect(cells[4].textContent).to.equal(mockEmployees[0].dateOfBirth);
    expect(cells[5].textContent).to.equal(mockEmployees[0].phoneNumber);
    expect(cells[6].textContent).to.equal(mockEmployees[0].email);
  });

  test('should navigate to edit page when edit button is clicked', async () => {
    element.employees = mockEmployees;
    await element.updateComplete;
    
    const editButton = element.shadowRoot.querySelector('.edit-button');
    editButton.click();
    
    expect(routerNavigateStub).to.have.been.calledWith(`/edit-employee/${mockEmployees[0].id}`);
  });

  test('should dispatch delete event when delete button is clicked', async () => {
    const eventSpy = spy();
    element.addEventListener('delete-employee', eventSpy);
    
    element.employees = mockEmployees;
    await element.updateComplete;
    
    const deleteButton = element.shadowRoot.querySelector('.delete-button');
    deleteButton.click();
    
    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail).to.deep.equal({ employee: mockEmployees[0] });
  });

  test('should update when language changes', async () => {
    element.employees = mockEmployees;
    await element.updateComplete;
    
    const newLang = 'tr';
    window.dispatchEvent(new CustomEvent('language-changed', {
      detail: { lang: newLang }
    }));
    await element.updateComplete;
    
    expect(element.lang).to.equal(newLang);
  });

  test('should translate department and position names', async () => {
    element.employees = mockEmployees;
    await element.updateComplete;
    
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td');
    
    const departmentCell = cells[7];
    const positionCell = cells[8];
    
    expect(departmentCell.textContent).to.not.equal(mockEmployees[0].department);
    expect(positionCell.textContent).to.not.equal(mockEmployees[0].position);
  });
}); 