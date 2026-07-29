// ─────────────────────────────────────────────────────────────
//  src/api/index.ts  —  Barrel export for the API layer
// ─────────────────────────────────────────────────────────────

export { axiosClient, isFormData } from './client';
export { setupInterceptors } from './interceptors';
export type {
  IApiResponse,
  IApiErrorBody,
  IRtkApiError,
  IRefreshTokenResponse,
} from './types';
