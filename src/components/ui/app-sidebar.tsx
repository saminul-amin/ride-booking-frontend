import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { Car } from "lucide-react";

import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getSidebarItems } from "@/utils/getSidebarItems";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useUserInfoQuery(undefined);

  console.log(userData?.data?.role)

  const data = {
    navMain: getSidebarItems(userData?.data?.role),
  };

  return (
    <Sidebar 
      {...props} 
      className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95"
    >
      <SidebarHeader className="items-center py-6 px-4 border-b border-border/20">
        <Link 
          to="/" 
          className="flex items-center space-x-2 group transition-all duration-200 hover:scale-105"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200">
            <Car className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200">
            RideBook
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item: any) => (
          <SidebarGroup key={item.title} className="mb-2">
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-2 hover:text-muted-foreground transition-colors duration-200">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu className="space-y-1">
                {item.items.map((menuItem: any) => (
                  <SidebarMenuItem key={menuItem.title}>
                    <SidebarMenuButton 
                      asChild
                      className="w-full justify-start rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent/60 hover:text-accent-foreground hover:translate-x-1 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:bg-accent/60"
                    >
                      <Link 
                        to={menuItem.url}
                        className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {/* Add dynamic icons based on menu item or use a default */}
                        <div className="w-5 h-5 rounded-sm bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center transition-all duration-200 group-hover:from-green-400/40 group-hover:to-green-600/40">
                          <div className="w-2 h-2 rounded-full bg-green-500/60 group-hover:bg-green-500 transition-all duration-200" />
                        </div>
                        <span className="flex-1 truncate group-hover:text-foreground transition-colors duration-200">
                          {menuItem.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        
        {/* Add some bottom spacing */}
        <div className="h-4" />
      </SidebarContent>
      
      <SidebarRail className="bg-green-500/10 hover:bg-green-500/20 transition-colors duration-200" />
    </Sidebar>
  );
}