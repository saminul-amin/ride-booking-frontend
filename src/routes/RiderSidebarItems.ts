// import RiderDashboard from "@/pages/rider/RiderDashboard";
import type { ISidebarItem } from "@/types";
import { lazy } from "react";

// Lazy load rider components
const RiderDashboard = lazy(() => import("@/pages/rider/RiderDashboard"))
const BookRide = lazy(() => import("@/pages/rider/BookRide"));
// const LiveTracking = lazy(() => import("@/pages/Rider/LiveTracking"));
// const RideHistory = lazy(() => import("@/pages/Rider/RideHistory"));
// const RideDetails = lazy(() => import("@/pages/Rider/RideDetails"));
// const RiderProfile = lazy(() => import("@/pages/Rider/RiderProfile"));
// const EmergencyContacts = lazy(() => import("@/pages/Rider/EmergencyContacts"));
// const PaymentMethods = lazy(() => import("@/pages/Rider/PaymentMethods"));

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/rider/dashboard",
        component: RiderDashboard,
      },
    ],
  },
  {
    title: "Ride Services",
    items: [
      {
        title: "Book a Ride",
        url: "/rider/book-ride",
        component: BookRide,
      },
    //   {
    //     title: "Live Tracking",
    //     url: "/rider/live-tracking",
    //     component: LiveTracking,
    //   },
    ],
  },
//   {
//     title: "Ride Management",
//     items: [
//       {
//         title: "Ride History",
//         url: "/rider/ride-history",
//         component: RideHistory,
//       },
//       {
//         title: "Ride Details",
//         url: "/rider/ride-details",
//         component: RideDetails,
//       },
//     ],
//   },
//   {
//     title: "Payment & Settings",
//     items: [
//       {
//         title: "Payment Methods",
//         url: "/rider/payment-methods",
//         component: PaymentMethods,
//       },
//       {
//         title: "Emergency Contacts",
//         url: "/rider/emergency-contacts",
//         component: EmergencyContacts,
//       },
//     ],
//   },
//   {
//     title: "Account",
//     items: [
//       {
//         title: "Profile Management",
//         url: "/rider/profile",
//         component: RiderProfile,
//       },
//     ],
//   },
];
