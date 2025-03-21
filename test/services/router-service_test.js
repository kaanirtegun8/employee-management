import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { router } from '../../src/services/router-service.js';
import { Router } from '@vaadin/router';

suite('RouterService', () => {
  let routerStub;
  let outletStub;

  setup(() => {
    routerStub = stub(Router, 'go');
    outletStub = document.createElement('div');
    outletStub.id = 'outlet';
    document.body.appendChild(outletStub);
  });

  teardown(() => {
    routerStub.restore();
    if (document.body.contains(outletStub)) {
      document.body.removeChild(outletStub);
    }
  });

  test('should initialize router with routes', () => {
    const routes = [
      { path: '/', component: 'home-page' },
      { path: '/about', component: 'about-page' }
    ];

    router.init(routes);
    expect(router.routes).to.deep.equal(routes);
    expect(router.router).to.exist;
  });

  test('should navigate to specified path', () => {
    const path = '/test-path';
    router.navigate(path);
    expect(routerStub).to.have.been.calledWith(path);
  });

  test('should handle missing outlet gracefully', () => {
    if (document.body.contains(outletStub)) {
      document.body.removeChild(outletStub);
    }
    const consoleErrorStub = stub(console, 'error');
    
    router.init([]);
    
    expect(consoleErrorStub).to.have.been.calledWith('Router outlet not found');
    consoleErrorStub.restore();
  });

  test('should handle DOMContentLoaded event', () => {
    const routes = [{ path: '/', component: 'home-page' }];
    
    Object.defineProperty(document, 'readyState', {
      get() { return 'loading'; }
    });
    
    router.init(routes);
    
    window.dispatchEvent(new Event('DOMContentLoaded'));
    
    expect(router.routes).to.deep.equal(routes);
    expect(router.router).to.exist;
  });
}); 