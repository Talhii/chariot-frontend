"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "@/lib/utils";

export default function Sections() {
    const [sections, setSections] = useState([]);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/admin/section`);
                const sectionsData = response.data.data;
                if (sectionsData.length > 0) {
                    setSections(sectionsData);
                } 
            } catch (error) {
                showErrorToast(`Error fetching sections ${error}`);
                console.error("Error fetching sections:", error);
            }
        };

        fetchSections();
    }, [sectionToDelete]);

    const handleAddSectionClick = () => {
        router.push("/admin/section/add");
    };

    const handleEditSectionClick = (sectionId) => {
        router.push(`/admin/section/edit/${sectionId}`);
    };

    const handleDeleteSectionClick = (section) => {
        setSectionToDelete(section);
        setIsModalOpen(true);
    };

    const deleteSection = async () => {
        try {
            const response = await axios.delete(`${apiBaseUrl}/admin/section/${sectionToDelete._id}`);

            if (response.status === 200 || response.status === 201) {
                setIsModalOpen(false);
                setSectionToDelete(null);
                showSuccessToast("Section deleted successfully.");
            } else {
                throw new Error("Failed to delete section");
            }
        } catch (error) {
            console.error("Error deleting section:", error);
            showErrorToast(`Failed to delete section. Please try again. ${error}`);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setSectionToDelete(null);
    };

    return (
        <div className="p-8">            
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-white">Sections</h2>
                <button
                    onClick={handleAddSectionClick}
                    className="flex items-center px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-md hover:bg-gray-200 transition duration-200"
                >
                    <Plus className="mr-2" />
                    Add Section
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-left text-lg text-gray-400">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-6 py-3">Section Number</th>
                            <th className="px-6 py-3">Section</th>
                            <th className="px-6 py-3">Checklist</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections && sections.length > 0 ? sections.map((section) => (
                            <tr key={section._id} className="border-t border-gray-700">
                                <td className="px-6 py-3">{section.number}</td>
                                <td className="px-6 py-3">{section.name}</td>
                                <td className="px-6 py-3">
                                    <ul>
                                        {section.checklist.map((task) => (
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
                                    <button onClick={() => { handleEditSectionClick(section._id); }} className="text-blue-400 hover:text-blue-600">Edit</button>
                                    <button onClick={() => { handleDeleteSectionClick(section); }} className="ml-4 text-red-400 hover:text-red-600">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-4 text-center">
                                    No Sections available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 text-white rounded-lg p-6 max-w-sm mx-auto">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this section?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={deleteSection}
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
            <ToastContainer />
        </div>
    );
};
