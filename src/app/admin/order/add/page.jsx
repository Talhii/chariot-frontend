"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import axios from "axios";

export default function AddOrder() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [formData, setFormData] = useState({
    projectName: "",
    customerName: "",
    dueDate: "",
    status: "Pending",
    drawings: null,
    cuttingSheet: null,
  });

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
    uploadData.append("status", formData.status);
    uploadData.append("files", formData.drawings);
    uploadData.append("files", formData.cuttingSheet);

    try {
      const response = await axios.post(`${apiBaseUrl}/admin/order`, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showSuccessToast("Order Created Successfully");
      router.push("/admin/order");
    } catch (error) {
      console.error("Error creating order:", error);
      showErrorToast(`Error creating order: ${error}`);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-white mb-8">Add New Order</h2>
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

          {/* Status */}
          <div>
            <label className="block text-lg text-gray-400 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
            >
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
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
                  required
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
                  required
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
              Save Order
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
