import baseApi from './baseApi';
import { ENDPOINTS } from '../../constants';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: ENDPOINTS.login,
        method: 'POST',
        body: credentials,
      }),
    }),
    registerPatient: builder.mutation({
      query: (patientData) => ({
        url: ENDPOINTS.registerPatient,
        method: 'POST',
        body: patientData,
      }),
    }),
    registerDoctor: builder.mutation({
      query: (doctorData) => ({
        url: ENDPOINTS.registerDoctor,
        method: 'POST',
        body: doctorData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterPatientMutation,
  useRegisterDoctorMutation,
} = authApi;
