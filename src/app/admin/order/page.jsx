"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "@/lib/utils";


export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

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

  const handleAddOrderClick = () => {
    router.push("/admin/order/add");
  };

  const handleDeleteOrderClick = (order) => {
    setOrderToDelete(order); // Store the order to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const deleteOrder = async () => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/admin/order/${orderToDelete._id}`);
      console.log(response)
      if (response.status === 200) {
        setOrders(orders.filter((order) => order._id !== orderToDelete._id)); // Remove deleted order from state
        showSuccessToast("Order Deleted Successfully")
      } else {
        throw new Error("Failed to delete order");
      }
      setIsModalOpen(false); // Close the modal after deletion
      setOrderToDelete(null); // Reset the order to delete
    } catch (error) {
      showErrorToast("Failed to Delete Order")
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false); // Close the modal without deleting
    setOrderToDelete(null); // Reset the order to delete
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-white">Orders</h2>
        <button
          onClick={handleAddOrderClick}
          className="flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-gray-200 transition duration-200"
        >
          <Plus className="mr-2" />
          Add Order
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full text-left text-lg text-gray-400">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-8 py-4">Project Name</th>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Due Date</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 && orders.map((order) => (
              <tr key={order._id} className="border-t border-gray-700">
                <td className="px-8 py-4">{order.projectName}</td>
                <td className="px-8 py-4">{order.customerName}</td>
                <td className="px-8 py-4">{new Date(order.dueDate).toLocaleDateString()}</td>
                <td className="px-8 py-4">
                  <span
                    className={`px-4 py-2 rounded-full text-lg ${order.status === "Pending"
                      ? "bg-yellow-500 text-yellow-900"
                      : order.status === "In Progress"
                        ? "bg-blue-500 text-blue-900"
                        : "bg-green-500 text-green-900"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <button className="text-blue-400 hover:text-blue-600 text-lg">Edit</button>
                  <button
                    onClick={() => handleDeleteOrderClick(order)}
                    className="ml-6 text-red-400 hover:text-red-600 text-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-900 text-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this order?</h3>
            <div className="flex justify-between">
              <button
                onClick={deleteOrder}
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

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
