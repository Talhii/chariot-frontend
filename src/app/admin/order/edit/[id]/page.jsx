"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import axios from "axios";

export default function EditOrder({ params }) {
    const orderId = use(params)?.id;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const [formData, setFormData] = useState({
        projectName: "",
        customerName: "",
        dueDate: "",
        status: "Pending",
        drawings: [{ refNumber: "", url: "" }],
    });

    useEffect(() => {
        if (orderId) {
            const fetchOrderData = async () => {
                try {
                    const response = await axios.get(`${apiBaseUrl}/admin/order/${orderId}`);
                    setFormData(response.data.data);
                } catch (error) {
                    console.error("Error fetching order:", error);
                    showErrorToast(`Error fetching order ${error}`);
                }
            };
            fetchOrderData();
        }
    }, [orderId]);

    const handleChange = (e, index, field) => {
        const updatedDrawings = [...formData.drawings];
        if (index !== undefined) {
            updatedDrawings[index][field] = e.target.value;
            setFormData({ ...formData, drawings: updatedDrawings });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleAddDrawing = () => {
        setFormData({
            ...formData,
            drawings: [...formData.drawings, { refNumber: "", url: "" }],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`${apiBaseUrl}/admin/order/${orderId}`, formData);
            showSuccessToast("Order Updated Successfully");
            router.push("/admin/order");
        } catch (error) {
            console.error("Error updating order:", error);
            showErrorToast(`Error updating order ${error}`);
        }
    };

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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                        >
                            <option value="Pending">Pending</option>
                            <option value="InProgress">InProgress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Drawings */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Drawings</label>
                        {formData?.drawings?.length > 0 && formData.drawings.map((drawing, index) => (
                            <div key={index} className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="refNumber"
                                        value={drawing.refNumber}
                                        onChange={(e) => handleChange(e, index, "refNumber")}
                                        placeholder="Drawing Reference Number"
                                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        name="url"
                                        value={drawing.url}
                                        onChange={(e) => handleChange(e, index, "url")}
                                        placeholder="Drawing URL"
                                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddDrawing}
                            className="text-blue-500 hover:text-blue-600 transition duration-200"
                        >
                            + Add Drawing
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-black rounded-md hover:bg-white-600 transition duration-200"
                        >
                            Save Order
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
