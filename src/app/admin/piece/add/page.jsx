"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/lib/utils";

export default function AddPiece() {

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const [orders, setOrders ] = useState([])

    const router = useRouter();
    const [formData, setFormData] = useState({
        orderId: "",
        refNumber: "",
        dimensions: "",
        currentSection: "",
        status: "Pending",
        flagged: false,
        qrCode: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          const response = await axios.post(`${apiBaseUrl}/admin/piece`, formData);
          showSuccessToast("Piece Created Successfully")
          router.push("/admin/piece");
        } catch (error) {
          console.error("Error creating piece:", error);
          showErrorToast(`Error creating piece ${error}`);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await axios.get(`${apiBaseUrl}/admin/order`);
            const orders = response.data.data;
            setOrders(orders);
          } catch (error) {
            console.error("Error fetching orders:", error);
            showErrorToast(`Error fetching orders ${error}`);
          }
        };
        fetchOrders();
      }, []);

    return (
        <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
            <div className="p-8 w-full">
                <h2 className="text-3xl font-semibold text-white mb-8">Add New Piece</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Reference Number */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Reference Number</label>
                        <input
                            type="text"
                            name="refNumber"
                            value={formData.refNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Dimensions */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Dimensions</label>
                        <input
                            type="text"
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleChange}
                            placeholder="e.g. 30x20x10 cm"
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Current Section */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Orders</label>
                        <select
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        >
                            <option value="">Select Order</option>
                            {orders?.length > 0 && orders.map((order) => (
                                <option key={order._id} value={order._id}>
                                    {order.projectName}
                                </option>
                            ))}
                        </select>
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
                            <option value="Flagged">Flagged</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Flagged */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Flagged</label>
                        <input
                            type="checkbox"
                            name="flagged"
                            checked={formData.flagged}
                            onChange={(e) => setFormData({ ...formData, flagged: e.target.checked })}
                            className="text-white"
                        />
                        <span className="ml-2 text-gray-400">Mark as Flagged</span>
                    </div>

                    {/* QR Code */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">QR Code</label>
                        <input
                            type="text"
                            name="qrCode"
                            value={formData.qrCode}
                            onChange={handleChange}
                            placeholder="QR Code URL"
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition duration-200"
                        >
                            Save Piece
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
