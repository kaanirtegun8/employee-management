import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from './actions.js';

export const employeeReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_EMPLOYEE:
      return [...state, action.payload];
      
    case UPDATE_EMPLOYEE:
      return state.map(employee => 
        employee.id === action.payload.id 
          ? { ...employee, ...action.payload.employee }
          : employee
      );
      
    case DELETE_EMPLOYEE:
      return state.filter(employee => employee.id !== action.payload);
      
    default:
      return state;
  }
}; 