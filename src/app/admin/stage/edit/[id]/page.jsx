"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function EditStage({ params }) {
    const router = useRouter();
    const stageId = use(params)?.id;

    const [stageData, setStageData] = useState(null);
    const [stageNumber, setStageNumber] = useState("");
    const [stageName, setStageName] = useState("");
    const [checklist, setChecklist] = useState([]);
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [isMandatory, setIsMandatory] = useState(false);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchStageData = async () => {
            try {

                const response = await axios.get(`${apiBaseUrl}/admin/stage/${stageId}`);
                const { number, name, checklist } = response.data.data;

                setStageData(response.data.data);
                setStageNumber(number);
                setStageName(name);
                setChecklist(checklist);
            } catch (error) {
                console.error("Error fetching stage data:", error);
            }
        };

        if (stageId) fetchStageData();
    }, [stageId]);

    // Handle input changes
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
        setNewTaskDescription("");
        setIsMandatory(false);
    };

    const handleRemoveTask = (task) => {
        setChecklist((prevChecklist) =>
            prevChecklist.filter((item) => item.description !== task.description)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${apiBaseUrl}/admin/stage/${stageId}`, {
                number: stageNumber,
                name: stageName,
                checklist: checklist.map((task) => ({
                    description: task.description,
                    isMandatory: task.isMandatory,
                })),
            });

            router.push("/admin/stage");
        } catch (error) {
            console.error("Error updating stage:", error);
        }
    };

    if (!stageData) return <div>Loading...</div>;

    return (
        <div className="p-8 w-full">
            <h2 className="text-3xl font-semibold text-white mb-8">Edit Stage</h2>
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
                        {checklist && checklist.length > 0 && checklist.map((task, index) => (
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
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
