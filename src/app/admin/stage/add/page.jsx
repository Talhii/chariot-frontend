"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function AddStage() {
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

    const [stageName, setStageName] = useState("");
    const [checklist, setChecklist] = useState([]);
    const [newTask, setNewTask] = useState(""); // State for new task input

    const handleStageNameChange = (e) => {
        setStageName(e.target.value);
    };

    const handleNewTaskChange = (e) => {
        setNewTask(e.target.value);
    };

    const handleAddTask = () => {
        if (newTask.trim() === "") return; // Don't add empty tasks
        setChecklist((prevChecklist) => [...prevChecklist, newTask]);
        setNewTask(""); // Clear the input field after adding
    };

    const handleRemoveTask = (task) => {
        setChecklist((prevChecklist) => prevChecklist.filter((item) => item !== task));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here, you can send the `stageName` and `checklist` to your API to save the stage
        // Example: await createStage({ name: stageName, checklist: checklist });

        router.push("/stages"); // Redirect to stages list page
    };

    return (
        <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
            <div className="p-8 w-full">
                <h2 className="text-3xl font-semibold text-white mb-8">Add New Stage</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            {/* Display current tasks in checklist */}
                            {checklist.map((task, index) => (
                                <div key={index} className="flex items-center text-gray-400">
                                    <span className="mr-2">{task}</span>
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
                        <div className="mt-4 flex items-center">
                            <input
                                type="text"
                                value={newTask}
                                onChange={handleNewTaskChange}
                                placeholder="Enter new task"
                                className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            />
                            <button
                                type="button"
                                onClick={handleAddTask}
                                className="ml-2 px-4 py-2 bg-white text-black rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Add Task
                            </button>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-white text-black rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            Save Stage
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
