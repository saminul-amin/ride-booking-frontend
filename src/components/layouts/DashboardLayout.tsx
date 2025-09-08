import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { 
  User, 
  ChevronDown
} from "lucide-react";
import { ModeToggle } from "@/components/layouts/ModeToggler";
import { 
  useLogoutMutation, 
  useUserInfoQuery 
} from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import type { IRole } from "@/types";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSidebarItems } from "@/utils/getSidebarItems";


export default function DashboardLayout() {
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();

  // const userRole = (userInfo?.role || "DRIVER") as IRole;
  const userRole = "DRIVER";

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      toast("Successfully logged out!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const isActiveRoute = (url: string) => {
    return location.pathname === url;
  };

  const getCurrentPageTitle = () => {
    console.log(userRole);
    const sidebarItems = getSidebarItems(userRole);
    const currentItem = sidebarItems
      .flatMap(section => section.items)
      .find(item => isActiveRoute(item.url));
    return currentItem?.title || 'Dashboard';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <SidebarTrigger className="-ml-1" />

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="capitalize">{userRole.toLowerCase()}</span>
                <span>/</span>
                <span className="text-foreground font-medium">
                  {getCurrentPageTitle()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ModeToggle />

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium capitalize hidden sm:block">
                    {userInfo?.name || userRole.toLowerCase()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover border">
                    <div className="py-1">
                      <Link
                        to={`/${userRole.toLowerCase()}/profile`}
                        className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        Account Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}