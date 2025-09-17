import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User Management
    getAllUsers: builder.query({
      query: () => ({
        url: "/user/all-users",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    getSingleUser: builder.query({
      query: (id: string) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "USER", id }],
    }),

    // Driver Management
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
      query: ({ id, ...data }) => ({
        url: `/driver/${id}/earnings`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DRIVER", id },
        "DRIVER",
      ],
    }),

    updateDriverStats: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/driver/${id}/stats`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DRIVER", id },
        "DRIVER",
      ],
    }),

    deleteDriverProfile: builder.mutation({
      query: (id: string) => ({
        url: `/driver/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "DRIVER", id },
        "DRIVER",
      ],
    }),

    // Ride Management
    getAllRides: builder.query({
      query: () => ({
        url: "/ride/all-rides",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    getSingleRide: builder.query({
      query: (id: string) => ({
        url: `/ride/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "RIDE", id }],
    }),
  }),
});

export const {
  // User Management
  useGetAllUsersQuery,
  useGetSingleUserQuery,

  // Driver Management
  useGetOnlineDriversQuery,
  useGetAllDriversQuery,
  useAddDriverEarningMutation,
  useUpdateDriverStatsMutation,
  useDeleteDriverProfileMutation,

  // Ride Management
  useGetAllRidesQuery,
  useGetSingleRideQuery,
} = adminApi;
