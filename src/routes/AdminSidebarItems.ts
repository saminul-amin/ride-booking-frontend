import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const RiderManagement = lazy(() => import("@/pages/admin/RiderManagement"));
const DriverManagement = lazy(() => import("@/pages/admin/DriverManagement"));
const AllRides = lazy(() => import("@/pages/admin/AllRides"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/admin/dashboard",
        component: AdminDashboard,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "All Users",
        url: "/admin/users",
        component: UserManagement,
      },
      {
        title: "Rider Management",
        url: "/admin/riders",
        component: RiderManagement,
      },
      {
        title: "Driver Management",
        url: "/admin/drivers",
        component: DriverManagement,
      },
    ],
  },
  {
    title: "Ride Management",
    items: [
      {
        title: "All Rides",
        url: "/admin/rides",
        component: AllRides,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile Management",
        url: "/admin/profile",
        component: AdminProfile,
      },
    ],
  },
];
