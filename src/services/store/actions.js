export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';

export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: employee
});

export const updateEmployee = (id, employee) => ({
  type: UPDATE_EMPLOYEE,
  payload: { id, employee }
});

export const deleteEmployee = (id) => ({
  type: DELETE_EMPLOYEE,
  payload: id
}); 