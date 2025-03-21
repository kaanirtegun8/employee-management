import { employeeReducer } from './reducers.js';
import { ADD_EMPLOYEE } from './actions.js';
import { StorageKeys } from '../../constants/enums.js';

class Store {
  constructor() {
    this.state = {
      employees: this._loadEmployeesFromStorage() || []
    };
    this.listeners = new Set();
    
    this._updateNextId();
  }
  
  _loadEmployeesFromStorage() {
    try {
      const storedEmployees = localStorage.getItem(StorageKeys.EMPLOYEES);
      const parsedEmployees = storedEmployees ? JSON.parse(storedEmployees) : [];
      return parsedEmployees;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }
  
  _saveEmployeesToStorage() {
    try {
      const employeesJson = JSON.stringify(this.state.employees);
      localStorage.setItem(StorageKeys.EMPLOYEES, employeesJson);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  _updateNextId() {
    this.nextId = this.state.employees.length > 0 
      ? Math.max(...this.state.employees.map(emp => emp.id)) + 1 
      : 1;
  }
  
  getState() {
    return {
      employees: [...this.state.employees]
    };
  }

  dispatch(action) {
    if (!action || !action.type) {
      console.error('Invalid action dispatched:', action);
      return;
    }
    
    if (action.type === ADD_EMPLOYEE) {
      if (!action.payload.id) {
        action.payload = {
          ...action.payload,
          id: this.nextId++
        };
      }
    }
    
    const newEmployees = employeeReducer(this.state.employees, action);
    
    this.state = {
      employees: newEmployees
    };
    
    
    this._saveEmployeesToStorage();
    this._updateNextId();
    
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }
}

export const store = new Store(); 