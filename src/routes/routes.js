export const routes = [
  {
    path: '/',
    component: 'employee-list-page',
    action: () => import('../pages/employee-list-page.js')
  },
  {
    path: '/create',
    component: 'employee-create-page',
    action: () => import('../pages/employee-create-page.js')
  },
  {
    path: '/edit/:id',
    component: 'employee-edit-page',
    action: () => import('../pages/employee-edit-page.js')
  },
  {
    path: '(.*)',
    component: 'not-found-page',
    action: () => import('../pages/not-found-page.js')
  }
]; 