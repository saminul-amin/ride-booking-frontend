import type { ISidebarItem } from "@/types";
import { lazy } from "react";

// Lazy load driver components
const DriverDashboard = lazy(() => import("@/pages/driver/DriverDashboard"));
const AvailabilityControl = lazy(
  () => import("@/pages/driver/AvailabilityControl")
);
const IncomingRequests = lazy(() => import("@/pages/driver/IncomingRequests"));
const ActiveRide = lazy(() => import("@/pages/driver/ActiveRide"));
const RideManagement = lazy(() => import("@/pages/driver/RideManagement"));
const DriverRideHistory = lazy(
  () => import("@/pages/driver/DriverRideHistory")
);
const VehicleDetails = lazy(() => import("@/pages/driver/VehicleDetails"));
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
        title: "Incoming Requests",
        url: "/driver/incoming-requests",
        component: IncomingRequests,
      },
      {
        title: "Active Ride",
        url: "/driver/active-ride",
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
    title: "Vehicle & Settings",
    items: [
      {
        title: "Vehicle Details",
        url: "/driver/vehicle",
        component: VehicleDetails,
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
