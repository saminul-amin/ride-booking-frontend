import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const DriverDashboard = lazy(() => import("@/pages/driver/DriverDashboard"));
const AvailabilityControl = lazy(
  () => import("@/pages/driver/AvailabilityControl")
);
const ActiveRide = lazy(() => import("@/pages/driver/ActiveRide"));
const RideManagement = lazy(() => import("@/pages/driver/RideManagement"));
const DriverRideHistory = lazy(
  () => import("@/pages/driver/DriverRideHistory")
);
const DriverProfile = lazy(() => import("@/pages/driver/DriverProfile"));

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/driver/dashboard",
        component: DriverDashboard,
      },
    ],
  },
  {
    title: "Ride Operations",
    items: [
      {
        title: "Availability Control",
        url: "/driver/availability",
        component: AvailabilityControl,
      },
      {
        title: "Available Ride",
        url: "/driver/available-ride",
        component: ActiveRide,
      },
      {
        title: "Ride Management",
        url: "/driver/ride-management",
        component: RideManagement,
      },
    ],
  },
  {
    title: "Earnings & History",
    items: [
      {
        title: "Ride History",
        url: "/driver/ride-history",
        component: DriverRideHistory,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile Management",
        url: "/driver/profile",
        component: DriverProfile,
      },
    ],
  },
];
