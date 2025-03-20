import { Router } from '@vaadin/router';

export class RouterService {
  constructor() {
    this.router = null;
  }

  init(routes) {
    const outlet = document.querySelector('main');
    if (outlet) {
      this.router = new Router(outlet);
      this.router.setRoutes(routes);
      console.log('Router initialized with routes:', routes);
    } else {
      console.error('Router outlet not found');
    }
  }

  navigate(path) {
    if (this.router) {
      Router.go(path);
    }
  }
}

export const router = new RouterService(); 