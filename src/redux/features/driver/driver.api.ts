import { baseApi } from "@/redux/baseApi";

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDriverProfile: builder.mutation({
      query: (profileData) => ({
        url: "/driver/profile",
        method: "POST",
        data: profileData,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    getDriverProfile: builder.query({
      query: () => ({
        url: "/driver/profile",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    setOnlineStatus: builder.mutation({
      query: (statusData) => ({
        url: "/driver/status",
        method: "PATCH",
        data: statusData,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    updateLocation: builder.mutation({
      query: (locationData) => ({
        url: "/driver/location",
        method: "PATCH",
        data: locationData,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    getDriverDashboard: builder.query({
      query: () => ({
        url: "/driver/dashboard",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    getDriverEarnings: builder.query({
      query: () => ({
        url: "/driver/earnings",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    getDriverStats: builder.query({
      query: () => ({
        url: "/driver/stats",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    getOnlineDrivers: builder.query({
      query: () => ({
        url: "/driver/online",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    getAllDrivers: builder.query({
      query: () => ({
        url: "/driver/all-drivers",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),
    addDriverEarning: builder.mutation({
      query: ({ id, earningData }) => ({
        url: `/driver/${id}/earnings`,
        method: "POST",
        data: earningData,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    updateDriverStats: builder.mutation({
      query: ({ id, statsData }) => ({
        url: `/driver/${id}/stats`,
        method: "PATCH",
        data: statsData,
      }),
      invalidatesTags: ["DRIVER"],
    }),
    deleteDriverProfile: builder.mutation({
      query: (id) => ({
        url: `/driver/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DRIVER"],
    }),
  }),
});

export const {
  useCreateDriverProfileMutation,
  useGetDriverProfileQuery,
  useSetOnlineStatusMutation,
  useUpdateLocationMutation,
  useGetDriverDashboardQuery,
  useGetDriverEarningsQuery,
  useGetDriverStatsQuery,
  useGetOnlineDriversQuery,
  useGetAllDriversQuery,
  useAddDriverEarningMutation,
  useUpdateDriverStatsMutation,
  useDeleteDriverProfileMutation,
} = driverApi;
