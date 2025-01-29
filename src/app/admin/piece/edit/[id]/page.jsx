"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/lib/utils";

export default function EditPiece({ params }) {
    const pieceId = use(params)?.id;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const [stages, setStages] = useState({})
    const [formData, setFormData] = useState({
        refNumber: "",
        dimensions: "",
        currentStage: "",
        status: "Pending",
        flagged: false,
        qrCode: "",
    });
    const router = useRouter();

    useEffect(() => {
        const fetchPieceData = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/admin/piece/${pieceId}`);
                setFormData(response.data.data);
            } catch (error) {
                console.error("Error fetching piece data:", error);
                showErrorToast(`Error fetching piece data ${error}`);
            }
        };

        if (pieceId) {
            fetchPieceData();
        }
    }, [pieceId]);

    useEffect(() => {
        const fetchStages = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/admin/stage`);
                const stagesData = response.data.data;
                if (stagesData.length > 0) {
                    setStages(stagesData);
                }
            } catch (error) {
                showErrorToast(`Error fetching stages ${error}`);
                console.error("Error fetching stages:", error);
            }
        };

        fetchStages();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${apiBaseUrl}/admin/piece/${pieceId}`, formData);
            showSuccessToast("Piece Updated Successfully");
            router.push("/admin/piece");
        } catch (error) {
            console.error("Error updating piece:", error);
            showErrorToast(`Error updating piece: ${error}`);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
            <div className="p-8 w-full">
                <h2 className="text-3xl font-semibold text-white mb-8">Edit Piece</h2>
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
                        <label className="block text-lg text-gray-400 mb-2">Stage</label>
                        <select
                            name="currentStage"  // Bind the name of the current stage
                            value={formData.currentStage ? formData.currentStage._id : ""}  // Ensure the correct value is selected
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        >
                            <option value="">Select Stage</option> {/* You can keep this option to handle cases where no stage is selected */}
                            {stages?.length > 0 && stages.map((stage) => (
                                <option key={stage._id} value={stage._id}>
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
