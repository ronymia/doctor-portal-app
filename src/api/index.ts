// ─────────────────────────────────────────────────────────────
//  src/api/index.ts  —  Barrel export for the API layer
// ─────────────────────────────────────────────────────────────

export { axiosClient, isFormData } from './client';
export { setupInterceptors } from './interceptors';
export type {
  ApiResponse,
  ApiErrorBody,
  RtkApiError,
  RefreshTokenResponse,
} from './types';
