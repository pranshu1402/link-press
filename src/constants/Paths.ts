/**
 * Express router paths go here.
 */

export default {
  Base: '/',
  Auth: {
    Base: '/auth',
    Login: '/login',
    Logout: '/logout',
  },
  Users: {
    Base: '/users',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Link: {
    Redirect: '/:id',
    Shorten: '/shorten',
    Reactivate: '/re-activate/:id',
    GetAllByUser: '/user/:id',
  },
} as const;
