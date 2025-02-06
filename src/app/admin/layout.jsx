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
        <SidebarProvider>
            <SidebarTrigger />
            <div className="flex h-screen w-full">
                <AppSidebar />
                <SidebarInset className="bg-gradient-to-br from-gray-900 to-black text-white">
                    {children}
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default AdminLayout;
