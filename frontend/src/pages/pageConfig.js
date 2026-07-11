export const navItems = ['Home', 'About', 'Services', 'Contact'];

export const pageToPath = {
  Home: '/',
  About: '/about',
  Services: '/services',
  Contact: '/contacts',
  AdminLogin: '/admin-login',
  AdminDashboard: '/admin-dashboard',
  AdminCategoryEditor: '/admin-dashboard/category',
  AdminContainerEditor: '/admin-dashboard/container',
  NotFound: '/404',
};

export const pathToPage = {
  '/': 'Home',
  '/home': 'Home',
  '/about': 'About',
  '/services': 'Services',
  '/contact': 'Contact',
  '/contacts': 'Contact',
  '/admin-login': 'AdminLogin',
  '/admin-dashboard': 'AdminDashboard',
  '/admin-dashboard/category': 'AdminCategoryEditor',
  '/admin-dashboard/container': 'AdminContainerEditor',
};
