// ─────────────────────────────────────────────────────────────
//  src/api/interceptors.ts
//
//  Wires request + response interceptors onto the shared Axios
//  client.  Must be called ONCE after the Redux store is created.
//
//  Token-refresh flow
//  ──────────────────
//  1. Every outgoing request gets Authorization: Bearer <token>
//     (read from Redux state first, fallback to SecureStore).
//  2. On a 401 response:
//     a. If a refresh is already in flight  → queue this request
//        and wait for the new token.
//     b. Otherwise  → set isRefreshing=true and call
//        POST /v1.0/auth/refresh-token (with Cookie header).
//     c. On success → persist new token → flush the queue → retry.
//     d. On failure → logout user → reject all queued requests.
// ─────────────────────────────────────────────────────────────

import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { ENDPOINTS } from '../constants';
import { logout, setCredentials } from '../store/slices/authSlice';
import appStorage from '../services/storage';
import { axiosClient, isFormData } from './client';
import type { RefreshTokenResponse } from './types';

// ─── Types ───────────────────────────────────────────────────

/** Lazy reference to the Redux store — set by setupInterceptors(). */
type StoreRef = {
  getState: () => { auth: { token: string | null; user: any } };
  dispatch: (action: any) => void;
};

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

// ─── Module-level refresh state ──────────────────────────────

/** True while a token refresh HTTP call is in flight. */
let isRefreshing = false;

/**
 * Requests that arrived with a 401 while a refresh was already running.
 * Each entry is resolved/rejected once the refresh completes.
 */
let pendingQueue: QueuedRequest[] = [];

/**
 * Flush the pending queue.
 * @param error – If set, every queued request is rejected.
 * @param token – If set, every queued request is resolved with the new token.
 */
function flushQueue(error: unknown, token: string | null): void {
  pendingQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token as string);
    }
  });
  pendingQueue = [];
}

// ─── Public setup function ────────────────────────────────────

/**
 * Call this once in the app bootstrap (after store is created).
 *
 * @example
 *   // app/_layout.tsx
 *   import { store } from '../src/store/store';
 *   import { setupInterceptors } from '../src/api/interceptors';
 *   setupInterceptors(store);
 */
export function setupInterceptors(store: StoreRef): void {

  // ── REQUEST interceptor ──────────────────────────────────
  axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // 1. Remove Content-Type for FormData so Axios sets the correct
      //    multipart boundary automatically.
      if (isFormData(config.data)) {
        delete config.headers['Content-Type'];
      }

      // 2. Attach Bearer token.
      //    Priority: Redux state → SecureStore fallback
      let token: string | null = store.getState().auth.token;

      if (!token) {
        token = await appStorage.getItem('auth_token');
      }

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // ── RESPONSE interceptor ─────────────────────────────────
  axiosClient.interceptors.response.use(
    // Success: pass through unchanged
    (response) => response,

    // Error handler
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retried?: boolean;
      };

      // Only attempt refresh on 401 and only ONCE per request
      if (error.response?.status !== 401 || originalRequest._retried) {
        return Promise.reject(error);
      }

      // ── Already refreshing: queue this request ────────────
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest._retried = true;
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };
            return axiosClient(originalRequest);
          })
          .catch((queueError) => Promise.reject(queueError));
      }

      // ── Start a fresh refresh ─────────────────────────────
      originalRequest._retried = true;
      isRefreshing = true;

      try {
        const refreshToken = await appStorage.getItem('auth_refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint — uses a plain axios call (not the
        // intercepted client) to avoid recursive 401 loops.
        const refreshResponse = await axios.post<RefreshTokenResponse>(
          `${axiosClient.defaults.baseURL}${ENDPOINTS.refreshToken}`,
          {},
          {
            headers: {
              Cookie: `refresh_token=${refreshToken}`,
              'Content-Type': 'application/json',
            },
            timeout: 10_000,
          }
        );

        const newAccessToken = refreshResponse.data.data.access_token;

        // Persist the new token in Redux + SecureStore
        const currentUser = store.getState().auth.user;
        store.dispatch(
          setCredentials({ token: newAccessToken, user: currentUser })
        );

        // Flush queue → all queued requests get the new token
        flushQueue(null, newAccessToken);

        // Retry the original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return axiosClient(originalRequest);

      } catch (refreshError) {
        // Refresh failed → log out + reject all queued requests
        flushQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }
  );
}
