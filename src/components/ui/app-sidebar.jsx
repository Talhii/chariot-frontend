"use client"

import { Home, Users, FileText, Settings, User, Layers } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
  { icon: FileText, label: "Orders", path: "/admin/order" },
  { icon: Users, label: "Pieces", path: "/admin/piece" },  // Added Pieces
  { icon: User, label: "Users", path: "/admin/user" },  // Added User
  { icon: Layers, label: "Stages", path: "/admin/stage" },  // Added Stages
  { icon: Settings, label: "Settings", path: "/admin/setting" },
]

export function AppSidebar({ className, ...props }) {
  return (
    <Sidebar
      className={cn("border-r border-gray-800 bg-gray-900 w-64", className)} // Adjust width here
      {...props}
    >
      <SidebarHeader className="p-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <Link key={index} href={item.path}>
                  <SidebarMenuItem key={index} className="mb-4"> {/* Added bottom margin */}
                    <SidebarMenuButton
                      className="w-full justify-start gap-4 p-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                    >
                      <item.icon className="h-6 w-6" /> {/* Increased icon size */}

                      <span className="text-lg">{item.label}</span> {/* Increased text size */}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
