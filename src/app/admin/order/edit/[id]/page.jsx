"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import axios from "axios";

export default function EditOrder({ params }) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const orderId = use(params)?.id;

    const [formData, setFormData] = useState({
        projectName: "",
        customerName: "",
        dueDate: "",
        drawings: null,
        cuttingSheet: null,
    });

    const [loading, setLoading] = useState(true);

    // Fetch the order details when the component mounts
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/admin/order/${orderId}`);
                const order = response.data.data;

                const formattedDueDate = new Date(order.dueDate).toISOString().split('T')[0];
                // Set the existing order details in form data
                setFormData({
                    projectName: order.projectName,
                    customerName: order.customerName,
                    dueDate: formattedDueDate,
                    drawings: null,
                    cuttingSheet: null,
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order:", error);
                showErrorToast(`Error fetching order: ${error}`);
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId, apiBaseUrl]);

    const handleDrawings = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            drawings: file,
        });
    };

    const handleCuttingSheet = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            cuttingSheet: file,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const uploadData = new FormData();
        uploadData.append("projectName", formData.projectName);
        uploadData.append("customerName", formData.customerName);
        uploadData.append("dueDate", formData.dueDate);

        if (formData.drawings) {
            uploadData.append("files", formData.drawings);
        }
        if (formData.cuttingSheet) {
            uploadData.append("files", formData.cuttingSheet);
        }

        try {
            const response = await axios.put(`${apiBaseUrl}/admin/order/${orderId}`, uploadData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            showSuccessToast("Order Updated Successfully");
            router.push("/admin/order");
        } catch (error) {
            console.error("Error updating order:", error);
            showErrorToast(`Error updating order: ${error}`);
        }
    };

    if (loading) {
        return <p>Loading order data...</p>;
    }

    return (
        <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
            <div className="p-8">
                <h2 className="text-3xl font-semibold text-white mb-8">Edit Order</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Name */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Project Name</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Customer Name */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Customer Name</label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Drawings */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Drawings (PDF Only)</label>
                        <div className="mb-4 flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    name="file"
                                    accept=".pdf"
                                    onChange={handleDrawings}
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                                />
                            </div>
                        </div>

                        {/* Cutting Sheet */}
                        <label className="block text-lg text-gray-400 mb-2">Cutting Sheet (PDF Only)</label>
                        <div className="mb-4 flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    name="file"
                                    accept=".pdf"
                                    onChange={handleCuttingSheet}
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-black rounded-md hover:bg-white-600 transition duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
