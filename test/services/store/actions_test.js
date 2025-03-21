import { expect } from '@open-wc/testing';
import {
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from '../../../src/services/store/actions.js';

suite('Store Actions', () => {
  const mockEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  };

  test('should create add employee action', () => {
    const action = addEmployee(mockEmployee);
    
    expect(action).to.deep.equal({
      type: ADD_EMPLOYEE,
      payload: mockEmployee
    });
  });

  test('should create update employee action', () => {
    const updates = {
      firstName: 'Jane',
      lastName: 'Smith'
    };
    
    const action = updateEmployee(1, updates);
    
    expect(action).to.deep.equal({
      type: UPDATE_EMPLOYEE,
      payload: {
        id: 1,
        employee: updates
      }
    });
  });

  test('should create delete employee action', () => {
    const action = deleteEmployee(1);
    
    expect(action).to.deep.equal({
      type: DELETE_EMPLOYEE,
      payload: 1
    });
  });

  test('should handle empty employee data in add action', () => {
    const action = addEmployee({});
    
    expect(action).to.deep.equal({
      type: ADD_EMPLOYEE,
      payload: {}
    });
  });

  test('should handle empty updates in update action', () => {
    const action = updateEmployee(1, {});
    
    expect(action).to.deep.equal({
      type: UPDATE_EMPLOYEE,
      payload: {
        id: 1,
        employee: {}
      }
    });
  });
}); 