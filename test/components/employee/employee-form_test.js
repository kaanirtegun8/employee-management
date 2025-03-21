import { fixture, html, expect } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import '../../../src/components/employee/employee-form.js';
import { router } from '../../../src/services/router-service.js';
import { EmployeeFields } from '../../../src/constants/enums.js';

suite('EmployeeForm', () => {
  let element;
  let routerNavigateStub;

  const validEmployee = {
    [EmployeeFields.FIRST_NAME]: 'John',
    [EmployeeFields.LAST_NAME]: 'Doe',
    [EmployeeFields.EMAIL]: 'john@example.com',
    [EmployeeFields.PHONE_NUMBER]: '+1234567890',
    [EmployeeFields.DEPARTMENT]: 'tech',
    [EmployeeFields.POSITION]: 'senior',
    [EmployeeFields.DATE_OF_BIRTH]: '1990-01-01',
    [EmployeeFields.DATE_OF_EMPLOYMENT]: '2023-01-01'
  };

  setup(async () => {
    routerNavigateStub = stub(router, 'navigate');
    element = await fixture(html`<employee-form></employee-form>`);
  });

  teardown(() => {
    routerNavigateStub.restore();
  });

  function createSubmitEvent() {
    return {
      type: 'submit',
      preventDefault: () => {},
      stopPropagation: () => {},
      bubbles: true,
      cancelable: true
    };
  }

  test('should be defined', () => {
    expect(element).to.be.instanceOf(customElements.get('employee-form'));
  });

  test('should initialize with empty form data', () => {
    expect(element.formData).to.deep.equal({
      [EmployeeFields.FIRST_NAME]: '',
      [EmployeeFields.LAST_NAME]: '',
      [EmployeeFields.EMAIL]: '',
      [EmployeeFields.PHONE_NUMBER]: '',
      [EmployeeFields.DEPARTMENT]: '',
      [EmployeeFields.POSITION]: '',
      [EmployeeFields.DATE_OF_BIRTH]: '',
      [EmployeeFields.DATE_OF_EMPLOYMENT]: ''
    });
  });

  test('should update form data when input changes', async () => {
    const input = element.shadowRoot.querySelector(`input[name="${EmployeeFields.FIRST_NAME}"]`);
    input.value = 'John';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await element.updateComplete;
    
    expect(element.formData[EmployeeFields.FIRST_NAME]).to.equal('John');
  });

  test('should show validation errors for empty required fields', async () => {
    element._handleSubmit(createSubmitEvent());
    await element.updateComplete;
    
    expect(Object.keys(element.errors).length).to.be.above(0);
    expect(element.errors[EmployeeFields.FIRST_NAME]).to.exist;
  });

  test('should show validation error for invalid email', async () => {
    element.formData = {
      ...validEmployee,
      [EmployeeFields.EMAIL]: 'invalid-email'
    };
    await element.updateComplete;
    
    element._handleSubmit(createSubmitEvent());
    await element.updateComplete;
    
    expect(element.errors[EmployeeFields.EMAIL]).to.exist;
  });

  test('should show validation error for invalid phone', async () => {
    element.formData = {
      ...validEmployee,
      [EmployeeFields.PHONE_NUMBER]: 'invalid-phone'
    };
    await element.updateComplete;
    
    element._handleSubmit(createSubmitEvent());
    await element.updateComplete;
    
    expect(element.errors[EmployeeFields.PHONE_NUMBER]).to.exist;
  });

  test('should dispatch employee-created event on valid form submit in create mode', async () => {
    const eventSpy = spy();
    element.addEventListener('employee-created', eventSpy);
    
    element.formData = validEmployee;
    await element.updateComplete;
    
    element._handleSubmit(createSubmitEvent());
    await element.updateComplete;
    
    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail).to.deep.equal({ employee: validEmployee });
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(routerNavigateStub).to.have.been.calledWith('/');
  });

  test('should show confirmation modal on valid form submit in edit mode', async () => {
    element.employee = validEmployee;
    await element.updateComplete;
    
    element.formData = {
      ...validEmployee,
      [EmployeeFields.FIRST_NAME]: 'Jane'
    };
    await element.updateComplete;
    
    element._handleSubmit(createSubmitEvent());
    await element.updateComplete;
    
    expect(element.showConfirmModal).to.be.true;
  });

  test('should dispatch employee-updated event when update is confirmed', async () => {
    const eventSpy = spy();
    element.addEventListener('employee-updated', eventSpy);
    
    element.employee = validEmployee;
    await element.updateComplete;
    
    element._handleConfirmUpdate();
    await element.updateComplete;
    
    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail).to.deep.equal({ employee: validEmployee });
    expect(routerNavigateStub).to.have.been.calledWith('/');
  });

  test('should navigate to home when cancel is clicked', async () => {
    element._handleCancel();
    expect(routerNavigateStub).to.have.been.calledWith('/');
  });
});