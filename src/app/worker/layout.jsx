"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';
import WorkerDashboard from "./dashboard/page";

const WorkerLayout = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwt.decode(token);
                if (decodedToken && decodedToken.user.role == "Worker") {
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
        <WorkerDashboard/>
    );
};

export default WorkerLayout;
