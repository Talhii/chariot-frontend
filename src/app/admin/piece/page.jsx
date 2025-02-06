"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "@/lib/utils";

export default function Pieces() {
    const router = useRouter();
    const [pieces, setPieces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pieceToDelete, setPieceToDelete] = useState(null);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchPieces = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/admin/piece`);
                const pieces = await response.data.data;
                setPieces(pieces);
            } catch (error) {
                showErrorToast(`Error fetching pieces ${error}`);
                console.error("Error fetching pieces:", error);
            }
        };

        fetchPieces();
    }, [pieceToDelete]);

    const handleAddPieceClick = () => {
        router.push("/admin/piece/add");
    };

    const handleEditPieceClick = (sectionId) => {
        router.push(`/admin/piece/edit/${sectionId}`);
    };

    const handleDeletePieceClick = (piece) => {
        setPieceToDelete(piece);
        setIsModalOpen(true);
    };

    const deletePiece = async () => {
        try {
            const response = await axios.delete(`${apiBaseUrl}/admin/piece/${pieceToDelete._id}`);
            if (response.status === 200) {
                showSuccessToast("Piece deleted successfully");
            } else {
                throw new Error("Failed to delete piece");
            }
            setIsModalOpen(false);
            setPieceToDelete(null);
        } catch (error) {
            showErrorToast(`Error deleting piece ${error}`);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setPieceToDelete(null);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold text-white">Pieces</h2>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                <table className="w-full text-left text-lg text-gray-400">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="px-8 py-4">Piece Number</th>
                            <th className="px-8 py-4">Current Section</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pieces.map((piece) => (
                            <tr key={piece._id} className="border-t border-gray-700">
                                <td className="px-8 py-4">{piece.number}</td>
                                <td className="px-8 py-4">{piece?.currentSectionId?.name}</td>
                                <td className="px-8 py-4">
                                    <span
                                        className={`px-4 py-2 rounded-full text-lg ${piece.status === "Pending"
                                            ? "bg-yellow-500 text-yellow-900"
                                            : piece.status === "InProgress"
                                                ? "bg-blue-500 text-blue-900"
                                                : piece.status === "Flagged"
                                                    ? "bg-red-500 text-red-900"
                                                    : "bg-green-500 text-green-900"
                                            }`}
                                    >
                                        {piece.status}
                                    </span>
                                </td>
                                <td className="flex justify-content px-4 py-4">
                                    <button onClick={() => { handleEditPieceClick(piece._id); }} className="text-blue-400 hover:text-blue-600 text-lg" >Edit</button>
                                    <button onClick={() => handleDeletePieceClick(piece)} className="ml-6 text-red-400 hover:text-red-600 text-lg">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 text-white rounded-lg p-6 max-w-sm mx-auto">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this piece?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={deletePiece}
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
