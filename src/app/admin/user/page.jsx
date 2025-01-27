"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "@/lib/utils";

export default function Users() {
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("fullName");
    const [sortOrder, setSortOrder] = useState("asc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/admin/user`, {
                    params: {
                        search: search,
                        sortBy: sortBy,
                        sortOrder: sortOrder,
                    }
                });
                const users = response?.data?.data;
                if (users) {
                    setUsers(users);
                } else {
                    console.error("Error fetching users");
                }
            } catch (err) {
                showErrorToast(`Error fetching users ${err}`);
                console.error("Error fetching users", err);
            }
        };

        fetchUsers();
    }, [search, sortBy, sortOrder]);

    const toggleSortOrder = (column) => {
        if (sortBy === column) {
            setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleAddUserClick = () => {
        router.push("/admin/user/add");
    };

    const handleEditUserClick = (userId) => {
        router.push(`/admin/user/edit/${userId}`);
    };

    const handleDeleteUserClick = (user) => {
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${apiBaseUrl}/admin/user/${userToDelete._id}`);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userToDelete._id));
            setIsModalOpen(false);
            setUserToDelete(null);
            showSuccessToast("User deleted successfully");
        } catch (error) {
            showErrorToast(`Error deleting user ${error}`);
            console.error("Error deleting user", error);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setUserToDelete(null);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-white">Users</h2>
                <button
                    onClick={handleAddUserClick}
                    className="flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-gray-200 transition duration-200"
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
                                        <button onClick={() => handleDeleteUserClick(user)} className="ml-6 text-red-400 hover:text-red-600 text-lg">Delete</button>
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

            {/* Dark Mode Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 text-white rounded-lg p-6 max-w-sm mx-auto">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this user?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};
