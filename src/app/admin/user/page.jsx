"use client"
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import axios from "axios";



export default function Users() {
    return (
        <SidebarProvider>
            <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
                <AppSidebar className="dark hidden md:block" />
                <SidebarInset className="bg-gradient-to-br from-gray-950 to-black flex-1 overflow-auto text-white w-full">
                    <Component />
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

const Component = () => {
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState(""); // Search query for fullName
    const [sortBy, setSortBy] = useState("fullName"); // Default sort by fullName
    const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending

    // Fetch users with search and sorting params
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/admin/user`, {
                    params: {
                        search: search,       // Search query for fullName
                        sortBy: sortBy,       // Sorting field (fullName, role, username)
                        sortOrder: sortOrder, // Sorting order (asc, desc)
                    }
                });
                const users = response?.data?.data;
                if (users) {
                    setUsers(users);
                } else {
                    console.error("Error fetching users");
                }
            } catch (err) {
                console.error("Error fetching users", err);
            }
        }

        fetchUsers();
    }, [search, sortBy, sortOrder]);

    // Handler to change sorting direction
    const toggleSortOrder = (column) => {
        if (sortBy === column) {
            setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc"); // Reset to ascending when switching columns
        }
    };

    // Handler for search input change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };


    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get(`${apiBaseUrl}/admin/user`);
            const users = response?.data?.data
            console.log(users)
            if (users) {
                setUsers(users);
            }
            else {
                console.error("Error fetching users");
            }
        }

        fetchUsers();
    }, []);

    const handleAddUserClick = () => {
        router.push("/admin/user/add");
    };

    const handleEditUserClick = (userId) => {
        router.push(`/admin/user/edit/${userId}`);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-white">Users</h2>
                <button
                    onClick={handleAddUserClick}
                    className="flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    <Plus className="mr-2" />
                    Add User
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-left text-lg text-gray-400">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-8 py-4">Full Name</th>
                            <th className="px-8 py-4">Role</th>
                            <th className="px-8 py-4">Username</th>
                            <th className="px-8 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id} className="border-t border-gray-700">
                                    <td className="px-8 py-4">{user.fullName}</td>
                                    <td className="px-8 py-4">{user.role}</td>
                                    <td className="px-8 py-4">{user.username || "-"}</td>
                                    <td className="px-8 py-4">
                                        <button onClick={() => handleEditUserClick(user._id)} className="text-blue-400 hover:text-blue-600 text-lg">Edit</button>
                                        <button className="ml-6 text-red-400 hover:text-red-600 text-lg">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-4 text-center">
                                    No users available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
