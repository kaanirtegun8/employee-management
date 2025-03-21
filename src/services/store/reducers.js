import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from './actions.js';

export const employeeReducer = (state = [], action) => {
  
  let newState;

  switch (action.type) {
    case ADD_EMPLOYEE:
      newState = [...state, action.payload];
      return newState;
      
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