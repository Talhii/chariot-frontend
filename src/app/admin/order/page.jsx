"use client"
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

// Sample order data
const orders = [
  {
    id: 1,
    projectName: "Website Redesign",
    customerName: "Acme Corp",
    dueDate: "2025-02-15",
    status: "Pending",
    drawings: [
      { refNumber: "D123", url: "/drawings/website-redesign" },
    ]
  },
  {
    id: 2,
    projectName: "Mobile App Development",
    customerName: "Techies Inc.",
    dueDate: "2025-03-01",
    status: "In Progress",
    drawings: [
      { refNumber: "D124", url: "/drawings/mobile-app" },
    ]
  },
  {
    id: 3,
    projectName: "E-commerce Store",
    customerName: "Shopify Solutions",
    dueDate: "2025-04-10",
    status: "Completed",
    drawings: [
      { refNumber: "D125", url: "/drawings/ecommerce-store" },
    ]
  },
];

export default function Orders() {
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

  const handleAddOrderClick = () => {
    router.push("/admin/order/add");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-white">Orders</h2>
        <button
          onClick={handleAddOrderClick}
          className="flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-blue-700 transition duration-200"
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
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-700">
                <td className="px-8 py-4">{order.projectName}</td>
                <td className="px-8 py-4">{order.customerName}</td>
                <td className="px-8 py-4">{new Date(order.dueDate).toLocaleDateString()}</td>
                <td className="px-8 py-4">
                  <span
                    className={`px-4 py-2 rounded-full text-lg ${
                      order.status === "Pending"
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
                  <button className="ml-6 text-red-400 hover:text-red-600 text-lg">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
