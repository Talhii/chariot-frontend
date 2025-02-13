"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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
            <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700 p-4 rounded-lg mb-6 flex gap-4">
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-32 p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                />

                <Select onValueChange={(value) => setSelectedSection(value === "all" ? "" : value)}>
                    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="all">All Sections</SelectItem>
                        {sections.map((section) => (
                            <SelectItem key={section._id} value={section._id}>
                                {section.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={(value) => setSelectedWorker(value === "all" ? "" : value)}>
                    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="All Workers" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="all">All Workers</SelectItem>
                        {workers.map((worker) => (
                            <SelectItem key={worker._id} value={worker._id}>
                                {worker.fullName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

            </Card>

            {/* Table */}
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <Table className="w-full text-left text-lg text-gray-400">
                    <TableHeader className="bg-gray-900">
                        <TableRow>
                            <TableHead className="px-8 py-4">Code</TableHead>
                            <TableHead className="px-8 py-4">Number</TableHead>
                            <TableHead className="px-8 py-4">Section Processed</TableHead>
                            <TableHead className="px-8 py-4">Processed by</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pieces.map((piece) => {
                            const filteredHistory = piece.history.filter(entry => {
                                return (!selectedDate || (new Date(entry.timestamp).toISOString().split("T")[0] === selectedDate)) &&
                                    (!selectedWorker || entry.workerId?._id === selectedWorker) &&
                                    (!selectedSection || entry.section?._id === selectedSection);
                            });

                            if (filteredHistory.length === 0) return null;
                            return filteredHistory.map((entry, index) => (
                                <TableRow key={index} className="border-t border-gray-700">
                                    <TableCell className="px-8 py-4">{piece.code}</TableCell>
                                    <TableCell className="px-8 py-4">{piece.number}</TableCell>
                                    <TableCell className="px-8 py-4">{entry.section?.name}</TableCell>
                                    <TableCell className="px-8 py-4">{entry.workerId?.fullName}</TableCell>
                                </TableRow>
                            ));
                        })}
                    </TableBody>
                </Table>
            </div>

            <ToastContainer />
        </div>
    );
}
