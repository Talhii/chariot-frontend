"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast } from "@/lib/utils";

export default function Progress() {
    const [pieces, setPieces] = useState([]);
    const [sections, setSections] = useState([]);
    const [workers, setWorkers] = useState([]);

    const today = new Date().toLocaleDateString("en-CA");

    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedWorker, setSelectedWorker] = useState("");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchPieces();
        fetchSections();
        fetchWorkers();
    }, [selectedDate, selectedSection, selectedWorker]);

    const fetchPieces = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (selectedDate) queryParams.append("date", selectedDate);
            if (selectedSection) queryParams.append("section", selectedSection);
            if (selectedWorker) queryParams.append("worker", selectedWorker);

            const response = await axios.get(`${apiBaseUrl}/admin/piece/progress?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPieces(response.data.data);
        } catch (error) {
            showErrorToast(`Error fetching pieces: ${error}`);
            console.error("Error fetching pieces:", error);
        }
    };

    const fetchSections = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/admin/section`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSections(response.data.data);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };

    const fetchWorkers = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/admin/user?role=Worker`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWorkers(response.data.data);
        } catch (error) {
            console.error("Error fetching workers:", error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-white">Progress</h2>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6 flex gap-4">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-2 rounded-md bg-gray-900 text-white border border-gray-700"
                />
                <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="p-2 rounded-md bg-gray-900 text-white border border-gray-700"
                >
                    <option value="">All Sections</option>
                    {sections.map((section) => (
                        <option key={section._id} value={section._id}>
                            {section.name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    className="p-2 rounded-md bg-gray-900 text-white border border-gray-700"
                >
                    <option value="">All Workers</option>
                    {workers.map((worker) => (
                        <option key={worker._id} value={worker._id}>
                            {worker.fullName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-left text-lg text-gray-400">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-8 py-4">Code</th>
                            <th className="px-8 py-4">Number</th>
                            <th className="px-8 py-4">Section Processed</th>
                            <th className="px-8 py-4">Processed by</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pieces.map((piece) => {
                            const filteredHistory = piece.history.filter(entry => {
                                return (!selectedDate || (new Date(entry.timestamp).toISOString().split("T")[0] === selectedDate)) &&
                                    (!selectedWorker || entry.workerId?._id === selectedWorker) &&
                                    (!selectedSection || entry.section?._id === selectedSection);
                            });

                            if (filteredHistory.length === 0) return null;

                            return filteredHistory.map((entry, index) => (
                                <tr key={`${piece._id}-${index}`} className="border-t border-gray-700">
                                    <td className="px-8 py-4">{piece.code}</td>
                                    <td className="px-8 py-4">{piece.number}</td>
                                    <td className="px-8 py-4">{entry.section?.name}</td>
                                    <td className="px-8 py-4">{entry.workerId?.fullName}</td>
                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
            </div>

            <ToastContainer />
        </div>
    );
}
