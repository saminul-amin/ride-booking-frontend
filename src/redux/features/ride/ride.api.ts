import { baseApi } from "@/redux/baseApi";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestRide: builder.mutation({
      query: (rideInfo) => ({
        url: "/ride/request",
        method: "POST",
        data: rideInfo,
      }),
      invalidatesTags: ["RIDE"],
    }),
    cancelRide: builder.mutation({
      query: (id) => ({
        url: `/ride/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),
    rateRide: builder.mutation({
      query: ({ id, ratingData }) => ({
        url: `/ride/${id}/rate`,
        method: "POST",
        data: ratingData,
      }),
      invalidatesTags: ["RIDE"],
    }),
    acceptRide: builder.mutation({
      query: (id) => ({
        url: `/ride/${id}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),
    updateRideStatus: builder.mutation({
      query: ({ id, statusData }) => ({
        url: `/ride/${id}/status`,
        method: "PATCH",
        data: statusData,
      }),
      invalidatesTags: ["RIDE"],
    }),
    getAvailableRides: builder.query({
      query: () => ({
        url: "/ride/available",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getRideHistory: builder.query({
      query: () => ({
        url: "/ride/history",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getAllRides: builder.query({
      query: () => ({
        url: "/ride/all-rides",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
    getSingleRide: builder.query({
      query: (id) => ({
        url: `/ride/${id}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
  }),
});

export const {
  useRequestRideMutation,
  useCancelRideMutation,
  useRateRideMutation,
  useAcceptRideMutation,
  useUpdateRideStatusMutation,
  useGetAvailableRidesQuery,
  useGetRideHistoryQuery,
  useGetAllRidesQuery,
  useGetSingleRideQuery,
} = rideApi;