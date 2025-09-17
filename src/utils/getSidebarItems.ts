import { adminSidebarItems } from "@/routes/AdminSidebarItems";
import { driverSidebarItems } from "@/routes/DriverSidebarItems";
import { riderSidebarItems } from "@/routes/RiderSidebarItems";

export const getSidebarItems = (userRole: string) => {
  switch (userRole) {
    case "admin":
      return [...adminSidebarItems];
    case "RIDER":
      return [...riderSidebarItems];
    case "driver":
      return [...driverSidebarItems];
    default:
      return [];
  }
};