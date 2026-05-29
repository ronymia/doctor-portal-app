// ─────────────────────────────────────────────────────────────
//  src/api/client.ts
//  Central Axios instance for the Doctor Portal app.
//  Interceptors are wired separately in interceptors.ts so that
//  the store can be injected without circular-import issues.
// ─────────────────────────────────────────────────────────────

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants';

/**
 * The single shared Axios instance used throughout the app.
 *
 * Default config:
 *  - baseURL   : API_BASE_URL (e.g. http://10.0.2.2:4000/api)
 *  - timeout   : 15 000 ms
 *  - headers   : Content-Type + Accept set to application/json
 *
 * NOTE: Do NOT import this file directly in components.
 *       Always go through the RTK Query hooks (useXxxQuery / useXxxMutation).
 *       The axiosBaseQuery in baseApi.ts uses this client internally.
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Helper: returns true when the request body is a FormData instance.
 * Used by the request interceptor to remove the Content-Type header so
 * that Axios (and the browser / RN fetch polyfill) can set the correct
 * multipart/form-data boundary automatically.
 */
export function isFormData(value: unknown): value is FormData {
  return (
    typeof FormData !== 'undefined' &&
    value instanceof FormData
  );
}

export default axiosClient;
