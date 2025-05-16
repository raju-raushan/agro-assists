
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  Lightbulb,
  UserCircle,
  CloudSun,
  Tractor,
  Users,
  History,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crop-disease", label: "Disease Detection", icon: ScanLine },
  { href: "/crop-recommendations", label: "Crop Recommendations", icon: Lightbulb },
  // { href: "/weather", label: "Weather Intel", icon: CloudSun },
  { href: "/community", label: "Community", icon: Users },
  { href: "/activity-history", label: "Activity History", icon: History },
];

const profileNavItem = { href: "/profile", label: "Profile", icon: UserCircle };

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <Tractor className="h-8 w-8 text-sidebar-primary group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
          <h1 className="text-2xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            AgroAssist
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <SidebarMenu className="flex-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className={cn(
                    "justify-start",
                    pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="mt-auto">
          <SidebarSeparator className="my-2"/>
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href={profileNavItem.href} legacyBehavior passHref>
                    <SidebarMenuButton
                    asChild
                    isActive={pathname === profileNavItem.href}
                    tooltip={profileNavItem.label}
                    className={cn(
                        "justify-start w-full",
                        pathname === profileNavItem.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                    )}
                    >
                    <a>
                        <div className="flex items-center gap-2 w-full">
                             <Avatar className="h-6 w-6 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5">
                                <AvatarImage src={user?.name === "Alex Farmer" ? "https://placehold.co/100x100.png" : undefined} alt={user?.name} data-ai-hint="user avatar"/>
                                <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
                                    {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="group-data-[collapsible=icon]:hidden truncate">{user?.name || profileNavItem.label}</span>
                        </div>
                    </a>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                tooltip="Logout"
                className="justify-start w-full text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-sidebar-foreground/70">
          © {new Date().getFullYear()} AgroAssist
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
