// ─────────────────────────────────────────────────────────────
//  src/api/types.ts
//  Shared TypeScript types for the Axios API layer
// ─────────────────────────────────────────────────────────────

/**
 * Standard success envelope returned by every API endpoint.
 *
 * @example
 *   { success: true, message: "OK", data: { id: "..." } }
 */
export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

/**
 * Shape of the error body the server sends back on 4xx / 5xx.
 */
export interface IApiErrorBody {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * RTK Query–compatible error shape produced by axiosBaseQuery.
 * Components can type-narrow on `status` to distinguish HTTP errors
 * from network/timeout errors.
 */
export interface IRtkApiError {
  /** HTTP status code, or 'FETCH_ERROR' / 'TIMEOUT_ERROR' / 'PARSING_ERROR' */
  status: number | 'FETCH_ERROR' | 'TIMEOUT_ERROR' | 'PARSING_ERROR';
  data: IApiErrorBody | { message: string };
}

/**
 * Decoded token response from the refresh-token endpoint.
 */
export interface IRefreshTokenResponse {
  success: boolean;
  data: {
    access_token: string;
  };
}
