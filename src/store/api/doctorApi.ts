import baseApi from './baseApi';
import { ENDPOINTS } from '../../constants';

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecializations: builder.query({
      query: (params) => ({
        url: ENDPOINTS.specializations,
        method: 'GET',
        params,
      }),
      providesTags: ['Specialization'],
    }),
    getServices: builder.query({
      query: (params) => ({
        url: ENDPOINTS.services,
        method: 'GET',
        params,
      }),
      providesTags: ['Service'],
    }),
    getAvailableDoctors: builder.query({
      query: (params) => ({
        url: ENDPOINTS.availableDoctors,
        method: 'GET',
        params,
      }),
      providesTags: ['Doctor'],
    }),
    getAvailableServices: builder.query({
      query: (params) => ({
        url: ENDPOINTS.availableServices,
        method: 'GET',
        params,
      }),
      providesTags: ['Service'],
    }),
    getAvailableServiceById: builder.query({
      query: (id) => ({
        url: `${ENDPOINTS.availableServices}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSpecializationsQuery,
  useGetServicesQuery,
  useGetAvailableDoctorsQuery,
  useGetAvailableServicesQuery,
  useGetAvailableServiceByIdQuery,
} = doctorApi;
export default doctorApi;
