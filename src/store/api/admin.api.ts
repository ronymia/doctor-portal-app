import { ENDPOINTS } from "@/src/constants";
import baseApi from "./base.api";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: (params) => ({
        url: "/v1.0/admins",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    createAdmin: builder.mutation({
      query: (adminData) => ({
        url: "/v1.0/users/create-admin",
        method: "POST",
        body: adminData,
        // Handled via multipart form data in actual flow if image is uploaded
      }),
      invalidatesTags: ["User"],
    }),
    createDoctor: builder.mutation({
      query: (doctorData) => ({
        url: "/v1.0/users/create-doctor",
        method: "POST",
        body: doctorData,
      }),
      invalidatesTags: ["User"],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1.0/users/${id}/update-doctor`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/v1.0/doctors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1.0/admins/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/v1.0/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: (params) => ({
        url: ENDPOINTS.users,
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    approveDoctor: builder.mutation({
      query: (id) => ({
        url: `/v1.0/users/${id}/approve-doctor`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    rejectDoctor: builder.mutation({
      query: (id) => ({
        url: `/v1.0/users/${id}/reject-doctor`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    suspendUser: builder.mutation({
      query: (id) => ({
        url: `/v1.0/users/${id}/suspend-user`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    unsuspendUser: builder.mutation({
      query: (id) => ({
        url: `/v1.0/users/${id}/unsuspend-user`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    getTimeSlots: builder.query({
      query: (params) => ({
        url: ENDPOINTS.timeSlots,
        method: "GET",
        params,
      }),
      providesTags: ["Service"],
    }),
    createTimeSlot: builder.mutation({
      query: (timeSlotData) => ({
        url: ENDPOINTS.timeSlots,
        method: "POST",
        body: timeSlotData,
      }),
      invalidatesTags: ["Service"],
    }),
    getPermissions: builder.query({
      query: (params) => ({
        url: "/permissions",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    getUserPermissions: builder.query({
      query: (userId) => ({
        url: `/v1.0/users/${userId}/permissions`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    assignPermissions: builder.mutation({
      query: ({ userId, permissions }) => ({
        url: `/v1.0/users/${userId}/assign-permissions`,
        method: "POST",
        body: { permissions },
      }),
      invalidatesTags: ["User"],
    }),
    removePermissions: builder.mutation({
      query: ({ userId, permissions }) => ({
        url: `/v1.0/users/${userId}/remove-permissions`,
        method: "POST",
        body: { permissions },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetUsersQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  useApproveDoctorMutation,
  useRejectDoctorMutation,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useGetTimeSlotsQuery,
  useCreateTimeSlotMutation,
  useGetPermissionsQuery,
  useGetUserPermissionsQuery,
  useAssignPermissionsMutation,
  useRemovePermissionsMutation,
} = adminApi;
