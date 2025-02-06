"use client"

import { Home, Users, FileText, Settings, User, Layers, LogOut } from 'lucide-react'
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
} from "@/components/ui/sidebar"

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
  { icon: FileText, label: "Orders", path: "/admin/order" },
  { icon: Users, label: "Pieces", path: "/admin/piece" },
  { icon: User, label: "Users", path: "/admin/user" },
  { icon: Layers, label: "Sections", path: "/admin/section" },
  { icon: Settings, label: "Settings", path: "/admin/setting" },
]

export function AppSidebar({ className, ...props }) {
  const router = useRouter();

  const [user, setUser] = useState(null)
  useEffect(() => {
    const fetctUser = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken.user.id
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await axios.get(`${apiBaseUrl}/admin/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })

        setUser(response.data.data)
      } else {
        router.push("/");
      }
    }

    fetctUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push("/");
  }

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        className={cn("border-r border-gray-800 bg-gray-900 w-64 shadow-lg", className)}
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
                        className="w-full justify-start gap-4 p-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 rounded-lg"
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
                  src={user.photoUrl}
                  alt="User Avatar"
                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-600"
                />
                : <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>}

              <span className="text-white px-4 text-lg font-semibold">{user.fullName}</span>
            </div>

            <div className="mt-2 p-2 bg-gray-700 rounded-md">
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:bg-gray-200 p-2 rounded-md flex items-center"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </Sidebar>
    </>
  )
}
