class Store {
  constructor() {
    this.employees = [];
    this.listeners = new Set();
  }

  getState() {
    return {
      employees: [...this.employees]
    };
  }

  dispatch(action) {
    console.log('Action dispatched:', action);
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

export const store = new Store(); 