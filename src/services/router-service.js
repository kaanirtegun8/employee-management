import { Router } from '@vaadin/router';

export class RouterService {
  constructor() {
    this.router = null;
    this.routes = null;
  }

  init(routes) {
    this.routes = routes;
    
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => this._initRouter());
    } else {
      this._initRouter();
    }
  }
  
  _initRouter() {
    const outlet = document.getElementById('outlet');
    if (outlet) {
      this.router = new Router(outlet);
      this.router.setRoutes(this.routes);
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