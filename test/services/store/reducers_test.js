import { expect } from '@open-wc/testing';
import { employeeReducer } from '../../../src/services/store/reducers.js';
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../../../src/services/store/actions.js';

suite('Employee Reducer', () => {
  const initialState = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com'
    }
  ];

  test('should return initial state for unknown action', () => {
    const state = employeeReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(state).to.deep.equal(initialState);
  });

  test('should return empty array if state is undefined', () => {
    const state = employeeReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).to.be.an('array').that.is.empty;
  });

  test('should add employee', () => {
    const newEmployee = {
      id: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com'
    };

    const state = employeeReducer(initialState, {
      type: ADD_EMPLOYEE,
      payload: newEmployee
    });

    expect(state).to.have.length(3);
    expect(state).to.deep.include(newEmployee);
  });

  test('should update employee', () => {
    const updates = {
      firstName: 'Johnny',
      lastName: 'Doe Updated'
    };

    const state = employeeReducer(initialState, {
      type: UPDATE_EMPLOYEE,
      payload: {
        id: 1,
        employee: updates
      }
    });

    expect(state).to.have.length(2);
    expect(state[0]).to.include(updates);
    expect(state[0].id).to.equal(1);
    expect(state[0].email).to.equal('john@example.com');
  });

  test('should delete employee', () => {
    const state = employeeReducer(initialState, {
      type: DELETE_EMPLOYEE,
      payload: 1
    });

    expect(state).to.have.length(1);
    expect(state).to.not.deep.include(initialState[0]);
    expect(state).to.deep.include(initialState[1]);
  });

  test('should not modify state for non-existent employee update', () => {
    const state = employeeReducer(initialState, {
      type: UPDATE_EMPLOYEE,
      payload: {
        id: 999,
        employee: { firstName: 'NonExistent' }
      }
    });

    expect(state).to.deep.equal(initialState);
  });

  test('should not modify state for non-existent employee delete', () => {
    const state = employeeReducer(initialState, {
      type: DELETE_EMPLOYEE,
      payload: 999
    });

    expect(state).to.deep.equal(initialState);
  });

  test('should handle empty updates in update action', () => {
    const state = employeeReducer(initialState, {
      type: UPDATE_EMPLOYEE,
      payload: {
        id: 1,
        employee: {}
      }
    });

    expect(state[0]).to.deep.equal(initialState[0]);
  });
}); 