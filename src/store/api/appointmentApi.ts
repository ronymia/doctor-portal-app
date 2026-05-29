import baseApi from './baseApi';
import { ENDPOINTS } from '../../constants';

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: (params) => ({
        url: ENDPOINTS.appointments,
        method: 'GET',
        params,
      }),
      providesTags: ['Appointment'],
    }),
    getAppointmentById: builder.query({
      query: (id) => ({
        url: `${ENDPOINTS.appointments}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),
    bookAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: `${ENDPOINTS.appointments}/book-appointment`,
        method: 'POST',
        body: appointmentData,
      }),
      invalidatesTags: ['Appointment'],
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.appointments}/cancel-appointment/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Appointment'],
    }),
    startAppointment: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.appointments}/start-appointment/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Appointment'],
    }),
    finishAppointment: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.appointments}/finish-appointment/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Appointment'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
  useStartAppointmentMutation,
  useFinishAppointmentMutation,
} = appointmentApi;
export default appointmentApi;
