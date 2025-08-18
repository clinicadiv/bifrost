export const PUBLIC_ROUTES = [
  "/register",
  "/criar-conta",
  "/forgot-password",
  "/reset-password",
  "/nova-consulta",
];

export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};

export const DEFAULT_LOGIN_REDIRECT = "/";

export const DEFAULT_AUTHENTICATED_REDIRECT = "/";
