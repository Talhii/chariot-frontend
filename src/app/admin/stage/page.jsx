"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "@/lib/utils";

export default function Stages() {
    const [stages, setStages] = useState([]);
    const [stageToDelete, setStageToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

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
    }, [stageToDelete]);

    const handleAddStageClick = () => {
        router.push("/admin/stage/add");
    };

    const handleEditStageClick = (stageId) => {
        router.push(`/admin/stage/edit/${stageId}`);
    };

    const handleDeleteStageClick = (stage) => {
        setStageToDelete(stage);  // Store stage to delete
        setIsModalOpen(true);      // Open the confirmation modal
    };

    const deleteStage = async () => {
        try {
            const response = await axios.delete(`${apiBaseUrl}/admin/stage/${stageToDelete._id}`);

            if (response.status === 200 || response.status === 201) {
                setIsModalOpen(false);  // Close the modal
                setStageToDelete(null);  // Reset the stageToDelete state
                showSuccessToast("Stage deleted successfully.");
            } else {
                throw new Error("Failed to delete stage");
            }
        } catch (error) {
            console.error("Error deleting stage:", error);
            // Show a toast notification for the error
            showErrorToast(`Failed to delete stage. Please try again. ${error}`);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);  // Close the modal without deleting
        setStageToDelete(null);  // Reset the stageToDelete state
    };

    return (
        <div className="p-8">
            
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-white">Stages</h2>
                <button
                    onClick={handleAddStageClick}
                    className="flex items-center px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-gray-200 transition duration-200"
                >
                    <Plus className="mr-2" />
                    Add Stage
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-left text-lg text-gray-400">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3">Stage Number</th>
                            <th className="px-6 py-3">Stage</th>
                            <th className="px-6 py-3">Checklist</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages && stages.length > 0 ? stages.map((stage) => (
                            <tr key={stage._id} className="border-t border-gray-700">
                                <td className="px-6 py-3">{stage.number}</td>
                                <td className="px-6 py-3">{stage.name}</td>
                                <td className="px-6 py-3">
                                    <ul>
                                        {stage.checklist.map((task) => (
                                            <li key={task._id} className="text-gray-300">
                                                {task.description}{" "}
                                                {task.isMandatory ? (
                                                    <span className="text-red-500">(Mandatory)</span>
                                                ) : (
                                                    <span className="text-green-500">(Optional)</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="flex justify-content px-4 py-4">
                                    <button onClick={() => { handleEditStageClick(stage._id); }} className="text-blue-400 hover:text-blue-600">Edit</button>
                                    <button onClick={() => { handleDeleteStageClick(stage); }} className="ml-4 text-red-400 hover:text-red-600">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-4 text-center">
                                    No Stages available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 text-white rounded-lg p-6 max-w-sm mx-auto">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this stage?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={deleteStage}  // Call deleteStage instead of handleDeleteStageClick
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-200 transition duration-200"
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
