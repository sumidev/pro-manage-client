import axios from "axios";
import { API_BASE_URL, ROUTES, isPublicApiRequest } from "@/config/appConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRedirectingToLogin = false;

const redirectToLogin = () => {
  if (isRedirectingToLogin) return;
  const path = window.location.pathname;
  if (path === ROUTES.LOGIN || path === ROUTES.REGISTER) return;

  isRedirectingToLogin = true;
  localStorage.removeItem("token");

  const returnTo = encodeURIComponent(path + window.location.search);
  const loginUrl =
    returnTo && returnTo !== "%2F"
      ? `${ROUTES.LOGIN}?session=expired&returnTo=${returnTo}`
      : `${ROUTES.LOGIN}?session=expired`;

  window.location.replace(loginUrl);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isPublicApiRequest(error.config)) {
      import("@/app/store").then(({ store }) =>
        import("@/features/auth/authSlice").then(({ logout }) => {
          store.dispatch(logout());
          redirectToLogin();
        }),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
