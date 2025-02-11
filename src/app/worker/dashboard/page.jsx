"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Eye, CheckCheck, Plus, ListCollapse, Flag, X, Camera, File } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import jwtDecode from "jsonwebtoken/decode"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ToastContainer } from "react-toastify"
import { showSuccessToast, showErrorToast } from "@/lib/utils"
import { Html5Qrcode } from "html5-qrcode"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState(null)
  const [piecesCount, setPiecesCount] = useState(null)
  const [piecesChange, setPiecesChange] = useState(false)
  const router = useRouter()
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [isViewPieceModalOpen, setIsViewPieceModalOpen] = useState(false)
  const [selectedPieceId, setSelectedPieceId] = useState(null)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState(null)
  const [isSectionOneUser, setIsSectionOneUser] = useState(false)
  const [pdfViewerUrl, setPdfViewerUrl] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token")

      if (token) {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken.user.id
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await axios.get(`${apiBaseUrl}/admin/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const userData = response.data.data
        setUser(userData)
        setIsSectionOneUser(userData.section.number == 1)
      } else {
        router.push("/")
      }
    }

    fetchUser()
  }, [router])

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem("token")
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await axios.get(`${apiBaseUrl}/worker/order?sectionNumber=${user?.section.number}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setOrders(response.data.data)
      setPiecesCount(response.data.piecesCount)
    }

    if (user?.section.number) {
      fetchOrders()
    }
  }, [user])

  useEffect(() => {
    let html5QrCode

    if (isScanning) {
      html5QrCode = new Html5Qrcode("qr-reader")

      html5QrCode
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            setScannedData(decodedText)
            setIsScanning(false)
          },
          (errorMessage) => {
            console.warn("QR Code scan error:", errorMessage)
          },
        )
        .catch((err) => {
          console.error("QR Code Scanner initialization error:", err)
        })
    }

    return () => {
      if (html5QrCode) {
        html5QrCode
          .stop()
          .then(() => html5QrCode.clear())
          .catch(() => {})
      }
    }
  }, [isScanning])

  useEffect(() => {
    async function fetchPieceandCompareSection() {
      const token = localStorage.getItem("token")
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

      const lines = scannedData.split("\n")

      // Extract values safely
      const code = lines[0].replace("code:", "").trim()
      const number = lines[1].replace("number:", "").trim()

      const response = await axios.get(`${apiBaseUrl}/worker/piece/${encodeURIComponent(code)}/${number}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const piece = response.data.data

      if (piece.currentSectionId.number == user?.section.number) {
        handleOpenSubmitModal(null, scannedData)
      } else {
        showErrorToast("Piece does not belong to this section")
      }
    }

    if (scannedData) {
      fetchPieceandCompareSection()
    }
  }, [scannedData])

  const PictureUpload = ({ onImageSelect }) => {
    const [pictureName, setPictureName] = useState("")
    const [imageSrc, setImageSrc] = useState(null)

    const handleFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setPictureName(file.name)
        const reader = new FileReader()
        reader.onloadend = () => {
          setImageSrc(reader.result)
          onImageSelect(file)
        }
        reader.readAsDataURL(file)
      }
    }

    const handleCameraCapture = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            const video = document.createElement("video")
            video.srcObject = stream
            video.play()

            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            video.addEventListener("play", () => {
              setTimeout(() => {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                const dataUrl = canvas.toDataURL("image/png")
                setImageSrc(dataUrl)
                setPictureName("Captured Image")
                stream.getTracks().forEach((track) => track.stop())

                fetch(dataUrl)
                  .then((res) => res.blob())
                  .then((blob) => {
                    const file = new File([blob], "captured_image.png", { type: "image/png" })
                    onImageSelect(file)
                  })
              }, 1000)
            })
          })
          .catch((err) => {
            console.error("Camera error: ", err)
          })
      } else {
        alert("Camera is not available on this device.")
      }
    }

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Upload Picture</h3>
        <div className="flex flex-col sm:flex-row items-center justify-start w-full space-y-4 sm:space-y-0 sm:space-x-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-4 py-2 bg-white text-black hover:bg-gray-200 hover:text-black rounded-md text-center w-full sm:w-[250px] transition-colors flex items-center justify-center"
          >
            <Camera className="mr-2 h-4 w-4" />
            Upload Photo
          </label>
          <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />

          {/* Open Camera Button */}
          {/* <button
            type="button"
            onClick={handleCameraCapture}
            className="cursor-pointer px-4 py-2 bg-white text-black hover:bg-gray-200 hover:text-black rounded-md text-center w-full sm:w-[250px] transition-colors flex items-center justify-center"
          >
            <Camera className="mr-2 h-4 w-4" />
            Open Camera
          </button> */}
        </div>

        {pictureName && <p className="text-white ml-4 mt-2">{pictureName}</p>}

        {imageSrc && (
          <div className="mt-4">
            <img
              src={imageSrc || "/placeholder.svg"}
              alt="Uploaded or Captured"
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>
    )
  }

  function ProjectTable({ Pieces, Tab, onOpenSubmitModal, onOpenViewPieceModal }) {
    return (
      <div className="rounded-md bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white overflow-x-auto">
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
                    <Button
                      variant="outline"
                      disabled={Tab == "InComing"}
                      size="sm"
                      className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto"
                      onClick={() => onOpenViewPieceModal(piece)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View History
                    </Button>
                  </TableCell>

                  <TableCell className="m-4">
                    <Button
                      variant="outline"
                      disabled={Tab == "InComing"}
                      size="sm"
                      className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto"
                      onClick={() => onOpenSubmitModal(null, piece._id)}
                    >
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Move to Next Section
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" className="text-center text-gray-400">
                  No pieces found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  function OrdersTable({ Orders, onOpenSubmitModal, onOpenViewPieceModal, expandedOrderId, setExpandedOrderId }) {
    const [currentTab, setCurrentTab] = useState("Current")

    const handleAddPieceClick = (orderId) => {
      onOpenSubmitModal(orderId, null)
    }

    const handleExpandToggle = (orderId) => {
      setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
    }

    const handleViewPdf = (url) => {
      setPdfViewerUrl(url)
    }

    return (
      <div className="rounded-md bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Project Name</TableHead>
              <TableHead className="text-gray-400">Drawings PDF</TableHead>
              {isSectionOneUser && <TableHead className="text-gray-400">Cutting Sheet</TableHead>}
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
                        className="hover:bg-transparent text-blue-400 hover:text-blue-300 w-full sm:w-auto"
                        onClick={() => handleViewPdf(order?.drawings[0]?.url)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Drawing
                      </Button>
                    </TableCell>
                    {isSectionOneUser && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-transparent text-blue-400 hover:text-blue-300 w-full sm:w-auto"
                          onClick={() => handleViewPdf(order?.drawings[1]?.url)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Sheet
                        </Button>
                      </TableCell>
                    )}
                    {isSectionOneUser && (
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto"
                          onClick={() => handleAddPieceClick(order._id)}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Piece
                        </Button>
                      </TableCell>
                    )}

                    {!isSectionOneUser && (
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto"
                          onClick={() => handleExpandToggle(order._id)}
                        >
                          <ListCollapse className="mr-2 h-4 w-4" />{" "}
                          {expandedOrderId === order._id ? "Collapse" : "Expand"}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>

                  {!isSectionOneUser && expandedOrderId === order._id && (
                    <TableRow>
                      <TableCell colSpan="5">
                        <Tabs value={currentTab} onValueChange={(tab) => setCurrentTab(tab)} className="w-full mt-4">
                          <TabsList className="grid w-full sm:w-[300px] grid-cols-2 bg-gray-800 mb-4 mx-auto">
                            <TabsTrigger
                              value="Current"
                              className="flex justify-center items-center py-2 data-[state=active]:bg-white data-[state=active]:text-black"
                            >
                              Current
                            </TabsTrigger>
                            <TabsTrigger
                              value="InComing"
                              className="flex justify-center items-center py-2 data-[state=active]:bg-white data-[state=active]:text-black"
                            >
                              InComing
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="Current">
                            <ProjectTable
                              Pieces={order.currentPieces}
                              Tab={"Current"}
                              onOpenSubmitModal={onOpenSubmitModal}
                              onOpenViewPieceModal={onOpenViewPieceModal}
                            />
                          </TabsContent>

                          <TabsContent value="InComing">
                            <ProjectTable
                              Pieces={order.inComingPieces}
                              Tab={"InComing"}
                              onOpenSubmitModal={onOpenSubmitModal}
                              onOpenViewPieceModal={onOpenViewPieceModal}
                            />
                          </TabsContent>
                        </Tabs>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" className="text-center text-gray-400">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  function SubmitModal({ isOpen, onClose, selectedOrderId, selectedPieceId, User }) {
    if (!isOpen) return null

    const [checkedStates, setCheckedStates] = useState({})
    const [selectedImage, setSelectedImage] = useState(null)

    const handleCheckboxChange = (taskId) => {
      setCheckedStates((prevState) => ({
        ...prevState,
        [taskId]: !prevState[taskId],
      }))
    }

    const handleSubmit = async () => {
      try {
        setPiecesChange(false)
        const token = localStorage.getItem("token")

        const sectionNumber = User?.section?.number

        const formData = new FormData()
        formData.append("file", selectedImage)
        formData.append("sectionNumber", sectionNumber)
        formData.append("code", "UNIT #1-K-1")

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

        const url = selectedOrderId
          ? `${apiBaseUrl}/worker/piece?orderId=${selectedOrderId}`
          : `${apiBaseUrl}/worker/piece?pieceId=${selectedPieceId}`
        const response = await axios.post(url, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        })

        showSuccessToast("Piece successfully updated. Moved to the next section.")

        setSelectedImage(null)
        setCheckedStates({})
        setPiecesChange(true)
        onClose()
      } catch (error) {
        console.error("Error submitting data:", error)
        showErrorToast(`Error submitting data: ${error.response.data.message}`)
      }
    }

    const isSubmitDisabled = !selectedImage || !Object.values(checkedStates).includes(true)

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
          <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Action Panel</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Inspection List</h3>
              <div className="space-y-4 text-white">
                {User?.section?.checklist.length > 0 ? (
                  User?.section?.checklist.map((task, index) => (
                    <div key={task._id || index} className="flex items-center space-x-3">
                      <Checkbox
                        id={task._id || index}
                        checked={checkedStates[task._id || index]}
                        onCheckedChange={() => handleCheckboxChange(task._id || index)}
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
              <Separator className="my-6 bg-gray-700" />
              <PictureUpload onImageSelect={setSelectedImage} />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 mt-4">
              <Button
                variant="ghost"
                className="bg-white text-black hover:bg-gray-200 hover:text-black"
                onClick={onClose}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
                className="bg-white text-black hover:bg-gray-200 hover:text-black"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Submit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  function ViewPieceDetailsModal({ piece, isOpen, onClose }) {
    if (!isOpen || !piece) return null

    const flagPiece = async () => {
      setPiecesChange(false)
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
      const token = localStorage.getItem("token")

      const response = await axios.post(
        `${apiBaseUrl}/worker/piece/flag/${piece._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        },
      )

      showSuccessToast("Piece Flagged Successfully")
      setPiecesChange(true)
      onClose()
    }

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
          <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-white">Piece History</CardTitle>
              <div className="flex space-x-2">
                <Button className="bg-red-300 text-black" onClick={flagPiece}>
                  <Flag className="mr-2 h-4 w-4" />
                  Flag Piece
                </Button>
                <Button className="bg-white text-black" onClick={onClose}>
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto">
              {piece.history && piece.history.length > 0 ? (
                piece.history.map((entry, index) => (
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
                        onClick={() => setEnlargedImage(entry.photoUrl)}
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
      </div>
    )
  }

  function EnlargedImageModal({ imageUrl, onClose }) {
    if (!imageUrl) return null

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
        <div className="relative max-w-4xl max-h-4xl">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Enlarged piece image"
            className="max-w-full max-h-full object-contain"
          />
          <Button className="absolute top-4 right-4 bg-white text-black" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const handleOpenSubmitModal = (orderId, pieceId) => {
    setSelectedOrderId(orderId)
    setSelectedPieceId(pieceId)
    setIsSubmitModalOpen(true)
    if (orderId) setExpandedOrderId(orderId)
  }

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false)
    setSelectedOrderId(null)
    setSelectedPieceId(null)
  }

  const handleOpenViewPieceModal = (piece) => {
    setSelectedPiece(piece)
    setIsViewPieceModalOpen(true)
  }

  const handleCloseViewPieceModal = () => {
    setIsViewPieceModalOpen(false)
    setSelectedPiece(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700 h-70 sm:h-72 lg:h-74">
            <CardHeader>
              <CardTitle className="text-white">Assigned Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-white">{user?.section?.name}</p>
              <Badge className="mt-2 bg-blue-500 bg-opacity-50 text-white">InProgress</Badge>
            </CardContent>
          </Card>

          <div className="lg:flex lg:flex-col lg:space-y-6 sm:flex sm:flex-col sm:space-y-6 gap-0 mb-8">
            <Card className="bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">Total Orders</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="text-2xl font-bold">{orders?.length}</div>
              </CardContent>
            </Card>

            {!isSectionOneUser && (
              <Card className="bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold">Total Current Pieces</CardTitle>
                </CardHeader>
                <CardContent className="py-6">
                  <div className="text-2xl font-bold">{piecesCount}</div>
                </CardContent>
              </Card>
            )}
          </div>

          {!isSectionOneUser && (
            <Card className="bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 mb-8 h-70 sm:h-72 lg:h-74 flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-white">QR Code Scanner</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <div id="qr-reader" className="w-32 h-32 bg-gray-700 mx-auto mb-4 rounded-lg overflow-hidden"></div>
                <Button
                  className="w-full bg-white text-black hover:bg-gray-200 hover:text-black"
                  onClick={() => {
                    setScannedData(null)
                    setIsScanning(!isScanning)
                  }}
                >
                  <Camera className="mr-2 h-4 w-4" /> {isScanning ? "Stop Scanning" : "Start Scanning"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <OrdersTable
          Orders={orders}
          User={user}
          onOpenSubmitModal={handleOpenSubmitModal}
          onOpenViewPieceModal={handleOpenViewPieceModal}
          expandedOrderId={expandedOrderId}
          setExpandedOrderId={setExpandedOrderId}
        />
        <SubmitModal
          isOpen={isSubmitModalOpen}
          onClose={handleCloseSubmitModal}
          selectedOrderId={selectedOrderId}
          selectedPieceId={selectedPieceId}
          User={user}
        />
        <ViewPieceDetailsModal
          piece={selectedPiece}
          isOpen={isViewPieceModalOpen}
          onClose={handleCloseViewPieceModal}
        />
        <EnlargedImageModal imageUrl={enlargedImage} onClose={() => setEnlargedImage(null)} />
        {pdfViewerUrl && <PdfViewer url={pdfViewerUrl} onClose={() => setPdfViewerUrl(null)} />}
      </div>
      <ToastContainer />
    </div>
  )
}

function PdfViewer({ url, onClose }) {
  if (!url) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full h-full max-w-4xl max-h-full">
        <iframe src={`${url}#toolbar=0`} className="w-full h-full border-0" title="PDF Viewer" />
        <Button className="absolute top-4 right-4 bg-white text-black hover:bg-gray-200" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}