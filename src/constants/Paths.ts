/**
 * Express router paths go here.
 */

export default {
  Base: "/api",
  Auth: {
    Base: "/auth",
    Login: "/login",
    Logout: "/logout",
  },
  Users: {
    Base: "/users",
    Register: "/register",
    Update: "/update",
    Delete: "/delete/:id",
  },
  Link: {
    Redirect: "/:id",
    Shorten: "/shorten",
    Reactivate: "/re-activate/:id",
    GetAllByUser: "/user",
  },
} as const;
