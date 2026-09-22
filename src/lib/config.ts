const rawApiUrl = import.meta.env.VITE_API_URL?.trim() ?? "";
const rawUseMocks = import.meta.env.VITE_USE_MOCKS?.trim() ?? "";

/**
 * Base URL of the auth API, without a trailing slash. It is empty when the app
 * runs against the bundled mock API.
 */
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

/**
 * Mocks are used when `VITE_USE_MOCKS` says so, or when no API base URL is
 * configured at all, so a fresh checkout works without an `.env` file.
 */
export const USE_MOCKS_API = rawUseMocks ? rawUseMocks === "true" : !API_BASE_URL;
