import { store } from './store/store.js';

export class EmployeeService {
  constructor() {
    this.nextId = 1;
  }

  getAllEmployees() {
    return store.getState().employees;
  }

  getEmployeeById(id) {
    return store.getState().employees.find(emp => emp.id === id);
  }

  addEmployee(employee) {
    const newEmployee = {
      ...employee,
      id: this.nextId++
    };
    
    store.dispatch({
      type: 'ADD_EMPLOYEE',
      payload: newEmployee
    });
    
    return newEmployee;
  }

  updateEmployee(id, employee) {
    store.dispatch({
      type: 'UPDATE_EMPLOYEE',
      payload: { id, employee }
    });
  }

  deleteEmployee(id) {
    store.dispatch({
      type: 'DELETE_EMPLOYEE',
      payload: id
    });
  }
}

export const employeeService = new EmployeeService(); 