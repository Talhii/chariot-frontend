"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Flag, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer } from "react-toastify"
import { showSuccessToast, showErrorToast } from "@/lib/utils"


export default function EditPiece({ params }) {
    const pieceId = use(params)?.id;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const [sections, setSections] = useState({})
    const [formData, setFormData] = useState({
        number: "",
        currentSectionId: "",
        status: "InProgress",
        history: []
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
                        <label className="block text-lg text-gray-400 mb-2">Piece Number</label>
                        <input
                            type="text"
                            name="refNumber"
                            value={formData.number}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        />
                    </div>

                    {/* Current Section */}
                    <div>
                        <label className="block text-lg text-gray-400 mb-2">Section</label>
                        <select
                            name="currentSection"  // Bind the name of the current section
                            value={formData.currentSectionId ? formData.currentSectionId._id : ""}  // Ensure the correct value is selected
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
                            required
                        >
                            <option value="">Select Section</option> {/* You can keep this option to handle cases where no section is selected */}
                            {sections?.length > 0 && sections.map((section) => (
                                <option key={section._id} value={section._id}>
                                    {section.name}
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
                            <option value="InProgress">InProgress</option>
                            <option value="Flagged">Flagged</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>


                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
                        <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
                            <CardHeader className="flex justify-between items-center">
                                <CardTitle className="text-white">Piece History</CardTitle>
                            </CardHeader>
                            <CardContent className="max-h-[60vh] overflow-y-auto">
                                {formData.history && formData.history.length > 0 ? (
                                    formData.history.map((entry, index) => (
                                        <div key={index} className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg mb-4">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={entry.workerId.photoUrl} alt={entry.workerId.fullName} />
                                                <AvatarFallback>{entry.workerId.fullName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-white">{`${entry.workerId.fullName} (${entry.section.name})`}</p>
                                                <p className="text-sm text-gray-400">{entry.timestamp}</p>
                                            </div>
                                            <div className="w-16 h-16 flex-shrink-0">
                                                <img
                                                    src={entry.photoUrl || "/placeholder.svg"}
                                                    alt={`Piece Image ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-md cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white">No history available for this piece.</p>
                                )}
                            </CardContent>
                        </Card>
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
