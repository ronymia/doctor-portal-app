import { ENDPOINTS } from '@/src/constants';
import baseApi from './base.api';

export const specializationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecializations: builder.query({
      query: (params) => ({
        url: ENDPOINTS.specializations,
        method: 'GET',
        params,
      }),
      providesTags: ['Specialization'],
    }),
    createSpecialization: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.specializations,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Specialization'],
    }),
    updateSpecialization: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${ENDPOINTS.specializations}/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Specialization'],
    }),
    deleteSpecialization: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.specializations}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Specialization'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSpecializationsQuery,
  useCreateSpecializationMutation,
  useUpdateSpecializationMutation,
  useDeleteSpecializationMutation,
} = specializationApi;
export default specializationApi;
