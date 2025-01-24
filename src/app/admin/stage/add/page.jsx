"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function AddStage() {
    const router = useRouter();
    const [stages, setStages] = useState([]); // Assuming you have a state to manage stages

    const [stageNumber, setStageNumber] = useState(stages.length + 1); // Set stage number dynamically
    const [stageName, setStageName] = useState("");
    const [checklist, setChecklist] = useState([]);
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [isMandatory, setIsMandatory] = useState(false);

    const handleStageNumberChange = (e) => {
        setStageNumber(Number(e.target.value));
    };

    const handleStageNameChange = (e) => {
        setStageName(e.target.value);
    };

    const handleNewTaskDescriptionChange = (e) => {
        setNewTaskDescription(e.target.value);
    };

    const handleIsMandatoryChange = (e) => {
        setIsMandatory(e.target.checked);
    };

    const handleAddTask = () => {
        if (newTaskDescription.trim() === "") return;

        const newTask = {
            description: newTaskDescription,
            isMandatory: isMandatory,
        };

        setChecklist((prevChecklist) => [...prevChecklist, newTask]);
        setNewTaskDescription("");  // Clear the description input after adding
        setIsMandatory(false);      // Reset the mandatory checkbox after adding
    };

    const handleRemoveTask = (task) => {
        setChecklist((prevChecklist) =>
            prevChecklist.filter((item) => item.description !== task.description)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

        try {
            const response = await axios.post(`${apiBaseUrl}/admin/stage`, {
                number: stageNumber,
                name: stageName,
                checklist: checklist,
            });

            router.push("/admin/stage");
        } catch (error) {
            console.error("Error creating stage:", error);
            showErrorToast(`Error creating stage ${error}`);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
            <div className="p-8 w-full">
                <h2 className="text-3xl font-semibold text-white mb-8">Add New Stage</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Stage Number */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Stage Number</label>
                        <input
                            type="number"
                            value={stageNumber}
                            onChange={handleStageNumberChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Stage Name */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Stage Name</label>
                        <input
                            type="text"
                            value={stageName}
                            onChange={handleStageNameChange}
                            placeholder="e.g., Cutting"
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Checklist */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Checklist</label>
                        <div className="space-y-2">
                            {checklist.map((task, index) => (
                                <div key={index} className="flex items-center text-gray-400">
                                    <span className="mr-2">{task.description}</span>
                                    <span className="mr-2">{task.isMandatory ? "(Mandatory)" : "(Optional)"}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTask(task)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* New Task Input */}
                        <div className="mt-4 space-y-2">
                            <input
                                type="text"
                                value={newTaskDescription}
                                onChange={handleNewTaskDescriptionChange}
                                placeholder="Enter new task description"
                                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            />

                            <div className="flex items-center">
                                <label className="mr-2 text-gray-400">Mandatory:</label>
                                <input
                                    type="checkbox"
                                    checked={isMandatory}
                                    onChange={handleIsMandatoryChange}
                                    className="text-white"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleAddTask}
                                className="ml-2 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition duration-200"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition duration-200"
                        >
                            Save Stage
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};
