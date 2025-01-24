"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminLayout = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null);  // Track authentication state

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            // If no token, navigate to the login page and don't render the layout
            router.push("/");  // Redirect to login page
        } else {
            setIsAuthenticated(true);  // Token exists, authenticate the user
        }
    }, [router]); // Only re-run effect if `router` changes (it rarely changes in most cases)

    if (isAuthenticated === null) {
        // Wait until authentication check is complete (this prevents any content rendering)
        return null; // Don't render anything until we know the user is authenticated
    }

    return (
        <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
            <SidebarProvider>
                <SidebarTrigger />
                <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
                    <AppSidebar className="dark hidden md:block" />
                    <SidebarInset className="bg-gradient-to-br from-gray-950 to-black flex-1 overflow-auto text-white w-full">
                        {children}
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
};

export default AdminLayout;
