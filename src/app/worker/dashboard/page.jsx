"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Html5Qrcode } from "html5-qrcode"
import { HiChevronDown, HiChevronUp } from "react-icons/hi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "@/lib/utils";


export default function WorkerDashboard() {
  const [checkedStates, setCheckedStates] = useState({
    task1: false,
    task2: false,
    task3: false,
  })

  const handleCheckboxChange = (task) => {
    setCheckedStates((prevState) => ({
      ...prevState,
      [task]: !prevState[task],
    }))
  }

  const [notes, setNotes] = useState("")
  const [scannedData, setScannedData] = useState("")
  const [scanned, setScanned] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [pictureSelected, setPictureSelected] = useState(false)
  const [pictureName, setPictureName] = useState("")
  const [flagged, setFlagged] = useState(false);

  const [isScanning, setIsScanning] = useState(false)
  const qrReaderId = "reader"

  const [pieceDetails, setPieceDetails] = useState(null)

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        showErrorToast(`You are not authenticated.`);
        return;
      }

      const stageNumber = pieceDetails.currentStage?.number;

      const formData = new FormData();
      formData.append("file", document.getElementById("picture").files[0]);
      formData.append("stageNumber", stageNumber);
      formData.append("notes", notes);
      formData.append("flagged", flagged);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.put(
        `${apiBaseUrl}/worker/piece/${scannedData}`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showSuccessToast("Piece successfully updated. Moving to the next stage.");

      setScannedData("");
      setIsScanning(false);
      setPictureSelected(false);
      setNotes("");
      setCheckedStates({ task1: false, task2: false, task3: false }); // Reset the checklist

    } catch (error) {
      console.error("Error submitting data:", error);
      showErrorToast(`Error submitting data ${error}`);
    }
  };


  useEffect(() => {
    let html5QrCode

    if (isScanning) {
      html5QrCode = new Html5Qrcode(qrReaderId)

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
          .catch(() => { })
      }
      setScanned(true)
    }
  }, [isScanning])

  useEffect(() => {
    if (scannedData) {
      fetchPieceDetails(scannedData)
    }
  }, [scannedData])

  const fetchPieceDetails = async (pieceId) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiBaseUrl}/worker/piece/${pieceId}`)
      setPieceDetails(response.data.data)
    } catch (error) {
      showErrorToast(`Error fetching piece details ${error}`);
      console.error("Error fetching piece details:", error)
    }
  }

  const handlePictureChange = (e) => {
    if (e.target.files.length > 0) {
      setPictureName(e.target.files[0].name)
      setPictureSelected(true)
    } else {
      setPictureSelected(false)
      setPictureName("")
    }
  }

  const isSubmitDisabled = !pictureSelected || !Object.values(checkedStates).includes(true) || notes.trim() === ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex justify-between items-center py-6 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              Worker Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <Button
              onClick={() => setScanned(false)}
              variant="outline"
              className="bg-transparent border-blue-400 text-blue-400 hover:bg-gray-200 hover:text-black transition-colors"
            >
              Reset
            </Button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="font-medium text-white">John Doe</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Assigned Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-white">Processing - Stage 3</p>
              <Badge className="mt-2 bg-blue-500 bg-opacity-50 text-white">In Progress</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-400">QR Code Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <div id={qrReaderId} className="w-64 h-64 bg-gray-700 mx-auto mb-4 rounded-lg overflow-hidden"></div>
              {scannedData && (
                <p className="text-center mb-4 text-white">
                  Scanned Piece Successfully
                </p>
              )}
              <Button
                className="w-full bg-white text-black hover:bg-gray-200 hover:text-black"
                onClick={() => setIsScanning(!isScanning)}
              >
                {isScanning ? "Stop Scanning" : "Start Scanning"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {pieceDetails && (
          <Card className="mb-8 bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader>
              <CardTitle
                className="flex justify-between items-center cursor-pointer text-blue-400"
                onClick={() => setExpanded(!expanded)}
              >
                Piece Details
                {expanded ? <HiChevronUp className="text-2xl" /> : <HiChevronDown className="text-2xl" />}
              </CardTitle>
            </CardHeader>
            {expanded && pieceDetails && (
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white">
                  <div>
                    <p className="text-sm text-gray-400">Piece ID</p>
                    <p className="text-lg font-medium">{pieceDetails._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Reference</p>
                    <p className="text-lg font-medium">{pieceDetails.refNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Dimensions</p>
                    <p className="text-lg font-medium">{pieceDetails.dimensions || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Drawing</p>
                    {pieceDetails.drawingUrl ? (
                      <a href={pieceDetails.drawingUrl} className="text-lg font-medium text-blue-400 hover:text-blue-300">
                        View Drawing
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">No drawing available</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-lg font-medium">{pieceDetails.status}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-lg font-medium text-gray-300">History</p>
                <div className="space-y-4">
                  {pieceDetails.history.length > 0 ? (
                    pieceDetails.history.map((entry) => (
                      <div key={entry.timestamp} className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <p className="text-lg font-medium text-gray-200">
                            {entry.stage ? `Stage ${entry.stage}` : "Stage N/A"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {entry.photoUrl && (
                          <img
                            src={entry.photoUrl}
                            alt={`Photo for stage ${entry.stage}`}
                            className="max-w-full h-auto rounded-lg border border-gray-600"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No history available</p>
                  )}
                </div>
              </CardContent>
            )}

          </Card>
        )}

        {pieceDetails && (
          <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Action Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4 text-teal-400">Inspection List</h3>
              <div className="space-y-4 mb-6 text-white">
                {pieceDetails && pieceDetails.currentStage?.checklist?.length > 0 ? (
                  pieceDetails.currentStage.checklist.map((task, index) => (
                    <div key={task._id || index} className="flex items-center space-x-3">
                      <Checkbox
                        id={`task${index}`}
                        checked={checkedStates[`task${index}`]}
                        onCheckedChange={() => handleCheckboxChange(`task${index}`)}
                        className="border-blue-400 text-blue-400"
                      />
                      <label
                        htmlFor={`task${index}`}
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

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-teal-400">Upload Picture</h3>
                <div className="flex items-center justify-start w-full">
                  <label
                    htmlFor="picture"
                    className="cursor-pointer px-4 py-2 bg-white text-black hover:bg-gray-100 hover:text-black rounded-md text-center w-[250px] transition-colors"
                  >
                    Choose a picture
                  </label>
                  <input id="picture" type="file" className="hidden" accept="image/*" onChange={handlePictureChange} />
                  {pictureName && <p className="text-white ml-4">{pictureName}</p>}
                </div>
              </div>

              <div className="mb-6">
                <Checkbox
                  checked={flagged}
                  onCheckedChange={(checked) => setFlagged(checked)}
                  className="border-blue-400 text-blue-400"
                />
                <span className="ml-3 text-white text-lg">Flagged</span>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-teal-400">Add Notes</h3>
                <Textarea
                  placeholder="Enter any important notes or defects"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 bg-gray-700 bg-opacity-50 border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-white text-black hover:bg-gray-100 hover:text-black"
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit}
                >
                  Submit & Move to Next Stage
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}
