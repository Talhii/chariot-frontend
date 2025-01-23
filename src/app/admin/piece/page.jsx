"use client"
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"

// Sample piece data
const pieces = [
    {
        id: 1,
        refNumber: "P123",
        dimensions: "30x20x10 cm",
        currentStage: "Stage 1",
        status: "Pending",
        flagged: true,
        qrCode: "/qr/p123",
        history: [
            {
                stage: 1,
                workerId: "W001",
                timestamp: "2025-01-01",
                photoUrl: "/photos/worker1.jpg",
                notes: "Piece checked",
                flagged: true
            }
        ]
    },
    {
        id: 2,
        refNumber: "P124",
        dimensions: "25x15x8 cm",
        currentStage: "Stage 2",
        status: "In Progress",
        flagged: false,
        qrCode: "/qr/p124",
        history: [
            {
                stage: 2,
                workerId: "W002",
                timestamp: "2025-01-05",
                photoUrl: "/photos/worker2.jpg",
                notes: "Piece in progress",
                flagged: false
            }
        ]
    }
];

export default function Pieces() {
    return (
        <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
            <SidebarProvider>
                <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
                    <AppSidebar className="dark hidden md:block" />
                    <SidebarInset className="bg-gradient-to-br from-gray-950 to-black flex-1 overflow-auto text-white w-full">
                        <Component />
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}

const Component = () => {
    const router = useRouter();

    const handleAddPieceClick = () => {
        router.push("/admin/piece/add");
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-white">Pieces</h2>
                <button
                    onClick={handleAddPieceClick}
                    className="flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    <Plus className="mr-2" />
                    Add Piece
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-left text-lg text-gray-400">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-8 py-4">Reference Number</th>
                            <th className="px-8 py-4">Dimensions</th>
                            <th className="px-8 py-4">Current Stage</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pieces.map((piece) => (
                            <tr key={piece.id} className="border-t border-gray-700">
                                <td className="px-8 py-4">{piece.refNumber}</td>
                                <td className="px-8 py-4">{piece.dimensions}</td>
                                <td className="px-8 py-4">{piece.currentStage}</td>
                                <td className="px-8 py-4">
                                    <span
                                        className={`px-4 py-2 rounded-full text-lg ${piece.status === "Pending"
                                                ? "bg-yellow-500 text-yellow-900"
                                                : piece.status === "In Progress"
                                                    ? "bg-blue-500 text-blue-900"
                                                    : piece.status === "Flagged"
                                                        ? "bg-red-500 text-red-900"
                                                        : "bg-green-500 text-green-900"
                                            }`}
                                    >
                                        {piece.status}
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
