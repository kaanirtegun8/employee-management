export const routes = [
  {
    path: '/',
    component: 'employee-list-page',
    action: () => import('../pages/employee-list-page.js')
  },
  {
    path: '/add-new',
    component: 'add-employee-page',
    action: () => import('../pages/add-employee-page.js')
  },
  {
    path: '/edit-employee/:id',
    component: 'edit-employee-page',
    action: () => import('../pages/edit-employee-page.js')
  },
  {
    path: '(.*)',
    component: 'not-found-page',
    action: () => import('../pages/not-found-page.js')
  }
]; 