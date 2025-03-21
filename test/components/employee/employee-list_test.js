import { fixture, html, expect } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import '../../../src/components/employee/employee-list.js';
import { router } from '../../../src/services/router-service.js';

suite('EmployeeList', () => {
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
    element = await fixture(html`<employee-list></employee-list>`);
  });

  teardown(() => {
    routerNavigateStub.restore();
  });

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('employee-list'));
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

  test('should render employee cards', async () => {
    element.employees = mockEmployees;
    await element.updateComplete;
    
    const cards = element.shadowRoot.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(2);
    
    const firstCard = cards[0];
    expect(firstCard.querySelector('.employee-name').textContent.trim())
      .to.equal(`${mockEmployees[0].firstName} ${mockEmployees[0].lastName}`);
    expect(firstCard.querySelector('.employee-avatar').textContent.trim())
      .to.equal(`${mockEmployees[0].firstName.charAt(0)}${mockEmployees[0].lastName.charAt(0)}`);
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

  test('should show employee details in card', async () => {
    element.employees = mockEmployees;
    await element.updateComplete;
    
    const firstCard = element.shadowRoot.querySelector('.employee-card');
    const fields = firstCard.querySelectorAll('.field-value');
    
    expect(fields[0].textContent).to.equal(mockEmployees[0].email);
    expect(fields[1].textContent).to.equal(mockEmployees[0].phoneNumber);
    expect(fields[2].textContent).to.equal(mockEmployees[0].dateOfEmployment);
    expect(fields[3].textContent).to.equal(mockEmployees[0].dateOfBirth);
  });
}); 