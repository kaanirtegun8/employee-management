import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { store } from '../../../src/services/store/store.js';
import { StorageKeys } from '../../../src/constants/enums.js';
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../../../src/services/store/actions.js';

suite('Store', () => {
  let localStorageStub;
  let consoleErrorStub;

  const mockEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    }
  ];

  setup(() => {
    localStorageStub = {
      getItem: stub(),
      setItem: stub(),
      removeItem: stub(),
      clear: stub()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageStub
    });
    
    consoleErrorStub = stub(console, 'error');
    
    store.state = { employees: [] };
    store.listeners = new Set();
    store.nextId = 1;
  });

  teardown(() => {
    consoleErrorStub.restore();
  });

  test('should initialize with empty state if no stored data', () => {
    localStorageStub.getItem.returns(null);
    
    const state = store.getState();
    expect(state.employees).to.be.an('array').that.is.empty;
  });

  test('should load employees from storage on initialization', () => {
    localStorageStub.getItem.returns(JSON.stringify(mockEmployees));
    
    store.state = { employees: store._loadEmployeesFromStorage() };
    store._updateNextId();
    
    const state = store.getState();
    expect(state.employees).to.deep.equal(mockEmployees);
    expect(store.nextId).to.equal(2);
  });

  test('should handle localStorage errors gracefully', () => {
    localStorageStub.getItem.throws(new Error('Storage error'));
    
    const employees = store._loadEmployeesFromStorage();
    expect(employees).to.be.an('array').that.is.empty;
    expect(consoleErrorStub).to.have.been.calledOnce;
  });

  test('should save state to localStorage after dispatch', () => {
    store.dispatch({
      type: ADD_EMPLOYEE,
      payload: mockEmployees[0]
    });
    
    expect(localStorageStub.setItem).to.have.been.calledWith(
      StorageKeys.EMPLOYEES,
      JSON.stringify([mockEmployees[0]])
    );
  });

  test('should notify listeners after state change', () => {
    const listener = stub();
    store.subscribe(listener);
    
    store.dispatch({
      type: ADD_EMPLOYEE,
      payload: mockEmployees[0]
    });
    
    expect(listener).to.have.been.calledWith(store.getState());
  });

  test('should handle listener errors gracefully', () => {
    const errorListener = () => { throw new Error('Listener error'); };
    store.subscribe(errorListener);
    
    store.dispatch({
      type: ADD_EMPLOYEE,
      payload: mockEmployees[0]
    });
    
    expect(consoleErrorStub).to.have.been.calledOnce;
  });

  test('should handle invalid actions gracefully', () => {
    store.dispatch(null);
    store.dispatch({});
    store.dispatch({ type: 'INVALID_ACTION' });
    
    expect(consoleErrorStub).to.have.been.called;
    expect(store.getState().employees).to.be.an('array').that.is.empty;
  });

  test('should unsubscribe listeners correctly', () => {
    const listener = stub();
    const unsubscribe = store.subscribe(listener);
    
    unsubscribe();
    
    store.dispatch({
      type: ADD_EMPLOYEE,
      payload: mockEmployees[0]
    });
    
    expect(listener).to.not.have.been.called;
  });

  test('should handle all employee actions correctly', () => {
    store.dispatch({
      type: ADD_EMPLOYEE,
      payload: mockEmployees[0]
    });
    expect(store.getState().employees).to.deep.equal([mockEmployees[0]]);
    
    store.dispatch({
      type: UPDATE_EMPLOYEE,
      payload: { id: 1, employee: { firstName: 'Jane' } }
    });
    expect(store.getState().employees[0].firstName).to.equal('Jane');
    
    store.dispatch({
      type: DELETE_EMPLOYEE,
      payload: 1
    });
    expect(store.getState().employees).to.be.an('array').that.is.empty;
  });

  test('should assign id to new employee if not provided', () => {
    const employeeWithoutId = {
      firstName: 'John',
      lastName: 'Doe'
    };
    
    store.dispatch({
      type: ADD_EMPLOYEE,
      payload: employeeWithoutId
    });
    
    expect(store.getState().employees[0].id).to.equal(1);
  });
}); 