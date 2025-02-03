"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, CheckCheck, Plus, ListCollapse } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import jwtDecode from 'jsonwebtoken/decode';
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(null);
  const [piecesCount, setPiecesCount] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user.id;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiBaseUrl}/admin/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setUser(response.data.data);
      } else {
        router.push("/");
      }
    }

    fetchUser();
  }, []);


  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiBaseUrl}/worker/order?sectionNumber=${user?.section.number}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setOrders(response.data.data);
      setPiecesCount(response.data.piecesCount)
    }

    if (user?.section.number) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Project Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.photoUrl} alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="font-medium text-white">{user?.fullName}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Assigned Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-white">{user?.section?.name}</p>
              <Badge className="mt-2 bg-blue-500 bg-opacity-50 text-white">In Progress</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders?.length}
              </div>
            </CardContent>
          </Card>
          {user?.section?.number != 1 && (
            <Card className="bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Current Pieces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {piecesCount}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <OrdersTable Orders={orders} User={user} />
      </div>
    </div>
  );
}

function ProjectTable({ Pieces, User }) {
  const router = useRouter();
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // SubmitModal state
  const [isViewPieceModalOpen, setIsViewPieceModalOpen] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleMoveToNextStageClick = (pieceId) => {
    setIsModalOpen(true);
    setSelectedPieceId(pieceId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewPieceDetails = (piece) => {
    setSelectedPiece(piece);
    setIsViewPieceModalOpen(true);
  };

  const handleCloseViewPieceModal = () => {
    setIsViewPieceModalOpen(false);
    setSelectedPiece(null);
  };


  return (
    <>
      <SubmitModal isOpen={isModalOpen} onClose={handleCloseModal} selectedPieceId={selectedPieceId} User={User} />
      <ViewPieceDetailsModal
        piece={selectedPiece}
        isOpen={isViewPieceModalOpen}
        onClose={handleCloseViewPieceModal}
      />
      <div className="rounded-md bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Piece Number</TableHead>
              <TableHead className="text-gray-400">Section Name</TableHead>
              <TableHead className="text-gray-400">History</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Pieces?.length > 0 ? (
              Pieces.map((piece) => (
                <TableRow key={piece._id}>
                  <TableCell className="text-white">{piece.number}</TableCell>
                  <TableCell className="text-white">{piece.currentSectionId.name}</TableCell>
                  <TableCell className="m-4">
                    <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200"
                      onClick={() => handleViewPieceDetails(piece)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View History
                    </Button>
                  </TableCell>

                  <TableCell className="m-4">
                    <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200"
                      onClick={() => handleMoveToNextStageClick(piece._id)}
                    >
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Move to Next Section
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" className="text-center text-gray-400">No pieces found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </div>

    </>
  );
}

function OrdersTable({ Orders, User }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentTab, setCurrentTab] = useState("Current");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleAddPieceClick = (orderId) => {
    setIsModalOpen(true);
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleExpandToggle = (orderId) => {
    if(expandedOrderId == orderId){
      setExpandedOrderId(null);
    }
    else{
      setExpandedOrderId(orderId);
    }
  };


  const router = useRouter();

  return (
    <div className="rounded-md bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Project Name</TableHead>
            <TableHead className="text-gray-400">Drawings PDF</TableHead>
            {User?.section?.number === 1 && <TableHead className="text-gray-400">Cutting Sheet</TableHead>}
            <TableHead className="text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Orders?.length > 0 ? (
            Orders.map((order) => (
              <React.Fragment key={order._id}>
                <TableRow>
                  <TableCell className="text-white">{order?.projectName}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-transparent text-blue-400 hover:text-blue-300"
                      onClick={() => window.open(order?.drawings[0]?.url, "_blank")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Drawing
                    </Button>
                  </TableCell>
                  {User?.section?.number === 1 && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-transparent text-blue-400 hover:text-blue-300"
                        onClick={() => window.open(order?.drawings[1]?.url, "_blank")}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Sheet
                      </Button>
                    </TableCell>
                  )}
                  {User?.section?.number === 1 && (
                    <TableCell>
                      <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200"
                        onClick={() => handleAddPieceClick(order._id)}
                      >
                        <Plus /> Add Piece
                      </Button>
                    </TableCell>
                  )}

                  {User?.section?.number != 1 && (
                    <TableCell>
                      <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200"
                        onClick={() => handleExpandToggle(order._id)}
                      >
                        <ListCollapse />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>

                {expandedOrderId === order._id && (
                  <TableRow>
                    <TableCell colSpan="5">
                      <Tabs value={currentTab} onValueChange={(tab) => setCurrentTab(tab)} className="w-full mt-4">
                        <TabsList className="grid w-[300px] grid-cols-2 bg-gray-800 mb-4 mx-auto">
                          <TabsTrigger
                            value="Current"
                            className="flex justify-center items-center py-2 data-[state=active]:bg-white data-[state=active]:text-black">
                            Current
                          </TabsTrigger>
                          <TabsTrigger
                            value="InComing"
                            className="flex justify-center items-center py-2 data-[state=active]:bg-white data-[state=active]:text-black">
                            InComing
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="Current">
                          <ProjectTable Pieces={order.currentPieces} User={User} />
                        </TabsContent>

                        <TabsContent value="InComing">
                          <ProjectTable Pieces={order.inComingPieces} User={User} />
                        </TabsContent>
                      </Tabs>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" className="text-center text-gray-400">No orders found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* SubmitModal */}
      <SubmitModal isOpen={isModalOpen} onClose={handleCloseModal} selectedOrderId={selectedOrderId} User={User} />
    </div>
  );
}


function SubmitModal({ isOpen, onClose, selectedOrderId, selectedPieceId, User }) {
  if (!isOpen) return null;

  const [checkedStates, setCheckedStates] = useState({})
  const [pictureName, setPictureName] = useState("")
  const [pictureSelected, setPictureSelected] = useState(false)

  const handleCheckboxChange = (taskId) => {
    setCheckedStates((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }))
  };

  const handlePictureChange = (e) => {
    if (e.target.files.length > 0) {
      setPictureName(e.target.files[0].name)
      setPictureSelected(true)
    } else {
      setPictureSelected(false)
      setPictureName("")
    }
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        showErrorToast(`You are not authenticated.`);
        return;
      }

      const sectionNumber = User?.section?.number;

      const formData = new FormData();
      formData.append("file", document.getElementById("picture").files[0]);
      formData.append("sectionNumber", sectionNumber);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

      const url = selectedOrderId ? `${apiBaseUrl}/worker/piece?orderId=${selectedOrderId}` : `${apiBaseUrl}/worker/piece?pieceId=${selectedPieceId}`
      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPictureSelected(false);
      setCheckedStates({});
      // showSuccessToast("Piece successfully updated. Moved to the next section.");

    } catch (error) {
      console.error("Error submitting data:", error);
      // showErrorToast(`Error submitting data ${error}`);
    }
  };


  const isSubmitDisabled = !pictureSelected || !Object.values(checkedStates).includes(true)

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-1/2">
        <div className="flex justify-end mb-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Action Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Inspection List</h3>
            <div className="space-y-4 mb-6 text-white">
              {User?.section?.checklist.length > 0 ? (
                User?.section?.checklist.map((task, index) => (
                  <div key={task._id || index} className="flex items-center space-x-3">
                    <Checkbox
                      id={task._id || index}
                      checked={checkedStates[task._id || index]}  // Use task._id to track checked state
                      onCheckedChange={() => handleCheckboxChange(task._id || index)} // Pass task._id for the checkbox state
                      className="border-blue-400 text-blue-400"
                    />
                    <label
                      htmlFor={task._id || index}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {task.description || `QA Task ${index + 1}`}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-white">No tasks available for inspection.</p>
              )}
            </div>
          </CardContent>

          <Separator className="my-6 bg-gray-700" />

          <CardContent>
            {/* Upload Picture */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Upload Picture</h3>
              <div className="flex items-center justify-start w-full">
                <label
                  htmlFor="picture"
                  className="cursor-pointer px-4 py-2 bg-white text-black hover:bg-gray-200 hover:text-black rounded-md text-center w-[250px] transition-colors"
                >
                  Choose a picture
                </label>
                <input id="picture" type="file" className="hidden" accept="image/*" onChange={handlePictureChange} />
                {pictureName && <p className="text-white ml-4">{pictureName}</p>}
              </div>
            </div>
          </CardContent>


          {/* Submit Button */}
          <CardContent><div className="flex justify-end">
            <Button disabled={isSubmitDisabled} onClick={() => { handleSubmit() }} className="bg-white text-black hover:bg-gray-200 hover:text-black" >
              Submit
            </Button>
          </div></CardContent>

        </Card>
      </div>
    </div>
  );
}

function ViewPieceDetailsModal({ piece, isOpen, onClose }) {
  if (!isOpen || !piece) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-[80%] md:w-[600px]">
        <div className="flex justify-end mb-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <h2 className="text-xl text-white font-semibold mb-4">History</h2>

        {/* Piece History List */}
        <div className="space-y-4">
          {piece.history && piece.history.length > 0 ? (
            piece.history.map((entry, index) => (
              <div key={index} className="flex items-center space-x-4">


                {/* User Avatar */}
                <Avatar className="w-10 h-10">
                  <AvatarImage src={entry.workerId.photoUrl} alt={entry.workerId.fullName} />
                  <AvatarFallback>{entry.workerId.fullName[0]}</AvatarFallback>
                </Avatar>

                {/* User Information */}
                <div className="text-white">
                  <p className="font-semibold">{entry.workerId.fullName}</p>
                  <p className="text-sm text-gray-400">{entry.timestamp}</p> {/* Assuming timestamp is in the history entry */}
                </div>

                {/* Piece Image */}
                <div className="w-24 h-24 flex justify-center items-center">
                  <img
                    src={entry.photoUrl} // Assuming history entry has pieceImage property
                    alt={`Piece Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No history available for this piece.</p>
          )}
        </div>
      </div>
    </div>
  );
}


