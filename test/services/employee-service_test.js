import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { employeeService } from '../../src/services/employee-service.js';
import { store } from '../../src/services/store/store.js';

suite('EmployeeService', () => {
  let storeDispatchStub;
  let storeGetStateStub;

  const mockEmployees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'IT'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      department: 'HR'
    }
  ];

  setup(() => {
    storeDispatchStub = stub(store, 'dispatch');
    storeGetStateStub = stub(store, 'getState').returns({ employees: mockEmployees });
    employeeService.nextId = 3;
  });

  teardown(() => {
    storeDispatchStub.restore();
    storeGetStateStub.restore();
  });

  test('should get all employees', () => {
    const employees = employeeService.getAllEmployees();
    expect(employees).to.deep.equal(mockEmployees);
  });

  test('should get employee by id', () => {
    const employee = employeeService.getEmployeeById(1);
    expect(employee).to.deep.equal(mockEmployees[0]);
  });

  test('should return undefined for non-existent employee id', () => {
    const employee = employeeService.getEmployeeById(999);
    expect(employee).to.be.undefined;
  });

  test('should add new employee', () => {
    const newEmployee = {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      department: 'Sales'
    };

    const result = employeeService.addEmployee(newEmployee);
    
    expect(result.id).to.equal(3);
    expect(storeDispatchStub).to.have.been.calledWith({
      type: 'ADD_EMPLOYEE',
      payload: { ...newEmployee, id: 3 }
    });
  });

  test('should update employee', () => {
    const updatedEmployee = {
      firstName: 'John Updated',
      lastName: 'Doe Updated'
    };

    employeeService.updateEmployee(1, updatedEmployee);
    
    expect(storeDispatchStub).to.have.been.calledWith({
      type: 'UPDATE_EMPLOYEE',
      payload: { id: 1, employee: updatedEmployee }
    });
  });

  test('should delete employee', () => {
    employeeService.deleteEmployee(1);
    
    expect(storeDispatchStub).to.have.been.calledWith({
      type: 'DELETE_EMPLOYEE',
      payload: 1
    });
  });

  test('should increment nextId after adding employee', () => {
    const employee1 = employeeService.addEmployee({ firstName: 'Test1' });
    const employee2 = employeeService.addEmployee({ firstName: 'Test2' });
    
    expect(employee1.id).to.equal(3);
    expect(employee2.id).to.equal(4);
  });
}); 