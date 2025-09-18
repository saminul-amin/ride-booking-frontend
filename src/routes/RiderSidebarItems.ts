import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const RiderDashboard = lazy(() => import("@/pages/rider/RiderDashboard"));
const BookRide = lazy(() => import("@/pages/rider/BookRide"));
const RideHistory = lazy(() => import("@/pages/rider/RideHistory"));
const RiderProfile = lazy(() => import("@/pages/rider/RiderProfile"));

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
    ],
  },
  {
    title: "Ride Management",
    items: [
      {
        title: "Ride History",
        url: "/rider/ride-history",
        component: RideHistory,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile Management",
        url: "/rider/profile",
        component: RiderProfile,
      },
    ],
  },
];
