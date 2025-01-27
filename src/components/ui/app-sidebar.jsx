"use client"

import { Home, Users, FileText, Settings, User, Layers, Menu, LogOut } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import axios from 'axios'
import { useEffect, useState } from 'react'
import jwtDecode from 'jsonwebtoken/decode'
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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
  const { isMobile, openMobile, setOpenMobile } = useSidebar()
  const router = useRouter();

  const [user, setUser] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.user.id
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
      axios.get(`${apiBaseUrl}/admin/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
        .then((response) => {
          setUser(response.data.data)
        })
        .catch((error) => {
          console.error("Error fetching user data:", error)
        })
    } else {
      router.push("/");
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push("/");
  }

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        className={cn("border-r border-gray-800 bg-gray-900 w-64 shadow-lg", className)} // Added shadow for sidebar
        {...props}
      >
        {/* Sidebar Header */}
        <SidebarHeader className="p-6 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item, index) => (
                  <Link key={index} href={item.path}>
                    <SidebarMenuItem className="mb-4">
                      <SidebarMenuButton
                        className="w-full justify-start gap-4 p-3 text-gray-400 hover:bg-gray-200 hover:text-white transition-colors duration-200 rounded-lg"
                      >
                        <item.icon className="h-6 w-6" />
                        <span className="text-lg">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Link>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Info and Logout */}
        {user && (
          <div className="p-4 mt-auto bg-gray-800 rounded-t-lg border-t border-gray-700">
            <div className="flex items-center">
              {user.photoUrl ?
                <img
                  src={user.photoUrl} // Fallback image if photoUrl is not provided
                  alt="User Avatar"
                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-600"
                />
                : <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>}

              <span className="text-white px-4 text-lg font-semibold">{user.fullName}</span>
            </div>

            {(
              <div className="mt-2 p-2 bg-gray-700 rounded-md">
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-500 hover:bg-gray-200 p-2 rounded-md flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </Sidebar>

      {/* Mobile Sidebar (Side Drawer) */}
      {isMobile && openMobile && (
        <div
          className={`fixed inset-0 bg-gray-950 bg-opacity-75 transition-all duration-300 transform ${openMobile ? 'translate-x-0' : '-translate-x-full'
            } z-40`}
          onClick={() => setOpenMobile(false)}
        >
          <Sidebar
            className="dark w-64 bg-gray-800 z-50"
            {...props}
          >
            <SidebarHeader className="p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item, index) => (
                      <Link key={index} href={item.path}>
                        <SidebarMenuItem className="mb-4">
                          <SidebarMenuButton
                            className="w-full justify-start gap-4 p-3 text-gray-400 hover:bg-gray-200 hover:text-white transition-colors duration-200 rounded-lg"
                          >
                            <item.icon className="h-6 w-6" />
                            <span className="text-lg">{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Link>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>
      )}
    </>
  )
}
