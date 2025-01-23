"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"


export default function AddPiece() {
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
    const stages = [
        { id: 1, name: "Stage 1" },
        { id: 2, name: "Stage 2" },
        { id: 3, name: "Stage 3" }
    ];

    const router = useRouter();
    const [formData, setFormData] = useState({
        refNumber: "",
        dimensions: "",
        currentStage: "",
        status: "Pending",
        flagged: false,
        qrCode: "",
        history: []
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddHistory = () => {
        setFormData({
            ...formData,
            history: [
                ...formData.history,
                {
                    stage: formData.currentStage,
                    workerId: "",
                    timestamp: new Date().toISOString(),
                    photoUrl: "",
                    notes: "",
                    flagged: false
                }
            ]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        router.push("/admin/piece");
    };

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

                    {/* Current Stage */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Current Stage</label>
                        <select
                            name="currentStage"
                            value={formData.currentStage}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        >
                            <option value="">Select Stage</option>
                            {stages.map((stage) => (
                                <option key={stage.id} value={stage.name}>
                                    {stage.name}
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
                            <option value="In Progress">In Progress</option>
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

                    {/* History */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">History</label>
                        {formData.history.map((historyItem, index) => (
                            <div key={index} className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-gray-400">Stage: {historyItem.stage}</label>
                                    <input
                                        type="text"
                                        placeholder="Worker ID"
                                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                                        value={historyItem.workerId}
                                        onChange={(e) => {
                                            const updatedHistory = [...formData.history];
                                            updatedHistory[index].workerId = e.target.value;
                                            setFormData({ ...formData, history: updatedHistory });
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400">Notes</label>
                                    <textarea
                                        placeholder="Add notes"
                                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                                        value={historyItem.notes}
                                        onChange={(e) => {
                                            const updatedHistory = [...formData.history];
                                            updatedHistory[index].notes = e.target.value;
                                            setFormData({ ...formData, history: updatedHistory });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddHistory}
                            className="text-blue-500 hover:text-blue-600 transition duration-200"
                        >
                            + Add History Item
                        </button>
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
        </div>
    );
}
