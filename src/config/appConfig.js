/**
 * App-wide URLs and routes — use env vars in production (Vercel).
 */

const trimSlash = (url) => (url || "").replace(/\/+$/, "");

const apiBaseRaw =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

/** e.g. http://127.0.0.1:8000/api */
export const API_BASE_URL = trimSlash(apiBaseRaw);

/** Backend origin without /api — e.g. http://127.0.0.1:8000 */
export const BACKEND_ORIGIN = trimSlash(
  import.meta.env.VITE_BACKEND_URL ||
    API_BASE_URL.replace(/\/api\/?$/i, "") ||
    "http://127.0.0.1:8000",
);

/** Public disk — e.g. http://127.0.0.1:8000/storage */
export const STORAGE_BASE_URL = trimSlash(
  import.meta.env.VITE_STORAGE_URL || `${BACKEND_ORIGIN}/storage`,
);

export const REVERB = {
  key: import.meta.env.VITE_REVERB_APP_KEY || "",
  host: import.meta.env.VITE_REVERB_HOST || "localhost",
  port: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
  scheme: import.meta.env.VITE_REVERB_SCHEME || "http",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  SETTINGS: "/settings",
  USER_MANAGEMENT: "/user-management",
  INVITATION_ACCEPT: "/invitations/accept",
};

/** API paths that must not trigger session-expired redirect on 401 */
export const PUBLIC_API_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function resolveStorageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${STORAGE_BASE_URL}/${String(path).replace(/^\/+/, "")}`;
}

export function isPublicApiRequest(config) {
  const url = config?.url || "";
  return PUBLIC_API_PATHS.some((segment) => url.includes(segment));
}
