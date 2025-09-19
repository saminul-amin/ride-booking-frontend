import App from "@/App";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Homepage from "@/pages/Homepage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter } from "react-router";
import { riderSidebarItems } from "./RiderSidebarItems";
import { driverSidebarItems } from "./DriverSidebarItems";
import { adminSidebarItems } from "./AdminSidebarItems";
import Faq from "@/pages/Faq";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: Homepage,
        path: "",
        index: true,
      },
      {
        Component: Faq,
        path: "faq",
      },
      {
        Component: AboutUs,
        path: "about-us",
      },
      {
        Component: ContactUs,
        path: "contact-us",
      },
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: DashboardLayout,
    path: "/admin",
    children: [...generateRoutes(adminSidebarItems)],
  },
  {
    Component: DashboardLayout,
    path: "/rider",
    children: [...generateRoutes(riderSidebarItems)],
  },
  {
    Component: DashboardLayout,
    path: "/driver",
    children: [...generateRoutes(driverSidebarItems)],
  },
]);
