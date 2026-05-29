// ─────────────────────────────────────────────────────────────
//  src/store/api/baseApi.ts
//
//  Replaces the old fetchBaseQuery + baseQueryWithReauth approach
//  with a custom axiosBaseQuery that delegates every HTTP call to
//  the central Axios client (src/api/client.ts).
//
//  Token refresh is handled transparently by the Axios response
//  interceptor (src/api/interceptors.ts) — RTK Query never needs
//  to know about it.
//
//  All existing RTK Query hooks and cache tags are unchanged.
// ─────────────────────────────────────────────────────────────

import {
  BaseQueryFn,
  createApi,
} from '@reduxjs/toolkit/query/react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { axiosClient, isFormData } from '../../api/client';
import type { RtkApiError } from '../../api/types';

// ─── axiosBaseQuery ──────────────────────────────────────────

/**
 * RTK Query BaseQueryFn backed by the shared Axios client.
 *
 * Accepts the same query-descriptor shape used by fetchBaseQuery so
 * that existing endpoint definitions (authApi, doctorApi, appointmentApi)
 * require zero changes:
 *
 *   query: (id) => ({
 *     url: `/v1.0/appointments/${id}`,
 *     method: 'GET',
 *   })
 *
 * FormData bodies (registerPatient, registerDoctor) are forwarded
 * verbatim — the request interceptor removes Content-Type so that
 * Axios can set the correct multipart/form-data boundary.
 *
 * Errors are mapped to the RTK Query error shape:
 *   { status: <http-code | string>, data: <server-body | message> }
 */
export const axiosBaseQuery: BaseQueryFn<
  // args shape (mirrors what endpoint query() functions return)
  {
    url: string;
    method?: AxiosRequestConfig['method'];
    body?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
  },
  // result type (unknown — endpoints type their own responses)
  unknown,
  // error type
  RtkApiError
> = async ({ url, method = 'GET', body, params, headers }) => {
  try {
    const response = await axiosClient({
      url,
      method,
      // FormData is passed directly; plain objects are the JSON body
      data: body,
      params,
      headers,
    });

    return { data: response.data };

  } catch (axiosError) {
    const err = axiosError as AxiosError;

    // Server responded with an error body
    if (err.response) {
      return {
        error: {
          status: err.response.status,
          data:
            (err.response.data as any) ?? {
              message: err.message,
            },
        } satisfies RtkApiError,
      };
    }

    // Network / timeout error (no response received)
    const status =
      err.code === 'ECONNABORTED' ? 'TIMEOUT_ERROR' : 'FETCH_ERROR';

    return {
      error: {
        status,
        data: { message: err.message },
      } satisfies RtkApiError,
    };
  }
};

// ─── RTK Query API root ──────────────────────────────────────

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'User',
    'Doctor',
    'Appointment',
    'Specialization',
    'Service',
    'TimeSlot',
  ],
  endpoints: () => ({}),
});

export default baseApi;
