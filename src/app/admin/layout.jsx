"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';

const AdminLayout = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwt.decode(token);
                if (decodedToken && decodedToken.user.role == "Admin") {
                    setIsAuthenticated(true);
                } else {
                    router.push("/");
                }
            } catch (err) {
                console.error('Error decoding token', err);
                router.push("/");
            }
        }
        else {
            router.push("/");
        }

    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-black text-white flex h-screen w-full">
            <SidebarProvider>
                <SidebarTrigger />
                <div className="flex h-screen w-full">
                    {/* Sidebar remains solid dark */}
                    <AppSidebar className="dark w-64" />

                    {/* Content area with backdrop blur */}
                    <SidebarInset className="flex-1 overflow-auto bg-black text-white backdrop-blur-md">
                        {children}
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
};

export default AdminLayout;
