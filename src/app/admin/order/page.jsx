"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt from 'jsonwebtoken';
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const token = localStorage.getItem('token');
  const decodedToken = jwt.decode(token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/admin/order`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const orders = response.data.data;
        setOrders(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        showErrorToast(`Error fetching orders ${error}`);
      }
    };
    fetchOrders();
  }, [orderToDelete]);

  const handleAddOrderClick = () => {
    router.push("/admin/order/add");
  };

  const handleEditOrderClick = (orderId) => {
    router.push(`/admin/order/edit/${orderId}`);
  };

  const handleDeleteOrderClick = (order) => {
    setOrderToDelete(order);
    setIsModalOpen(true);
  };

  const deleteOrder = async () => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/admin/order/${orderToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        showSuccessToast("Order Deleted Successfully")
      } else {
        throw new Error("Failed to delete order");
      }
      setIsModalOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      showErrorToast("Failed to Delete Order")
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setOrderToDelete(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-white">Orders</h2>
        {decodedToken?.user.role == "Admin" &&
          <Button
            onClick={handleAddOrderClick}
            className="flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-gray-200 transition duration-200"
          >
            <Plus className="mr-2" />
            Add Order
          </Button>
        }
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <Table className="w-full text-left text-lg text-gray-400">
          <TableHeader className="bg-gray-900">
            <TableRow>
              <TableHead className="px-8 py-4">Project Name</TableHead>
              <TableHead className="px-8 py-4">Customer</TableHead>
              <TableHead className="px-8 py-4">Due Date</TableHead>
              <TableHead className="px-8 py-4">Status</TableHead>
              {decodedToken?.user.role == "Admin" && <TableHead className="px-8 py-4">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 && orders.map((order) => (
              <TableRow key={order._id} className="border-t border-gray-700">
                <TableCell className="px-8 py-4">{order.projectName}</TableCell>
                <TableCell className="px-8 py-4">{order.customerName}</TableCell>
                <TableCell className="px-8 py-4">{new Date(order.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="px-8 py-4">
                  <span
                    className={`px-4 py-2 rounded-full text-lg ${order.status === "Pending"
                      ? "bg-yellow-500 text-yellow-900"
                      : order.status === "InProgress"
                        ? "bg-blue-500 text-blue-900"
                        : "bg-green-500 text-green-900"
                      }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                {decodedToken?.user.role == "Admin" &&
                  <TableCell className="flex justify-content px-4 py-4">
                    <Button onClick={() => { handleEditOrderClick(order._id); }} className="bg-white text-black text-lg">Edit</Button>
                    <Button
                      onClick={() => handleDeleteOrderClick(order)}
                      className="bg-red-500 ml-6 text-white text-lg"
                    >
                      Delete
                    </Button>
                  </TableCell>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-900 text-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this order?</h3>
            <div className="flex justify-between">
              <Button
                onClick={deleteOrder}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
              >
                Yes, Delete
              </Button>
              <Button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-600 bg-white text-black rounded-md hover:bg-gray-200 transition duration-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};
