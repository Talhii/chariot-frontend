"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QrReader } from "react-qr-reader";
import { HiChevronDown, HiChevronUp } from "react-icons/hi"; // For expand/collapse icons

export default function WorkerDashboard() {
  const [checkedStates, setCheckedStates] = useState({
    task1: false,
    task2: false,
    task3: false,
  });

  const handleCheckboxChange = (task) => {
    setCheckedStates((prevState) => ({
      ...prevState,
      [task]: !prevState[task],
    }));
  };

  const [notes, setNotes] = useState("");
  const [scannedData, setScannedData] = useState("");
  const [scanned, setScanned] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pictureSelected, setPictureSelected] = useState(false);
  const [pictureName, setPictureName] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
      setScanned(true);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handlePictureChange = (e) => {
    if (e.target.files.length > 0) {
      setPictureName(e.target.files[0].name);
      setPictureSelected(true);
    } else {
      setPictureSelected(false);
      setPictureName("");
    }
  };

  const isSubmitDisabled = !pictureSelected ||
    !Object.values(checkedStates).includes(true) ||
    notes.trim() === "";

  return (
    <div className="relative min-h-screen bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex justify-between items-center py-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Worker Dashboard</h2>
          </div>
          <div className="flex items-center gap-8">
            <Button onClick={() => setScanned(false)} className="bg-green-600 hover:bg-green-700">Reset</Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-600"></div>
              <span className="text-white">John Doe</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Assigned Stage</h3>
            <p className="text-lg text-gray-400">Processing - Stage 3</p>
          </div>

          <div className="flex justify-between items-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Scan QR Code</h3>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setScanned(true)}
            >
              {scanned ? "Rescan" : "Scan"}
            </Button>
          </div>
        </div>

        {scanned && (
          <div className="bg-gray-800 mt-8 p-6 rounded-lg shadow-lg">
            <div
              onClick={() => setExpanded(!expanded)}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-4">Piece Details</h3>
              {expanded ? (
                <HiChevronUp className="text-white text-xl" />
              ) : (
                <HiChevronDown className="text-white text-xl" />
              )}
            </div>
            {expanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400">Piece ID</p>
                  <p className="text-white">12345</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400">Reference</p>
                  <p className="text-white">ABC-123</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400">Dimensions</p>
                  <p className="text-white">2.0 x 3.5 x 1.5</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400">Drawing</p>
                  <a href="#" className="text-blue-500">View Drawing</a>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400">Status</p>
                  <p className="text-green-400">In Progress</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-400">History</p>
                  <p className="text-white">Completed Stage 2</p>
                </div>
              </div>
            )}
          </div>
        )}

        {scanned && (
          <div className="bg-gray-800 mt-8 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Action Panel</h3>

            <div className="flex flex-col gap-8">
              <p className="text-gray-400">Inspection List</p>

              <div className="flex items-center gap-6">
                <Checkbox
                  checked={checkedStates.task1}
                  onCheckedChange={() => handleCheckboxChange("task1")}
                  className="scale-150"
                />
                <p className="text-white">QA Task 1: Inspect surface quality</p>
              </div>

              <div className="flex items-center gap-6">
                <Checkbox
                  checked={checkedStates.task2}
                  onCheckedChange={() => handleCheckboxChange("task2")}
                  className="scale-150"
                />
                <p className="text-white">QA Task 2: Check dimensions</p>
              </div>

              <div className="flex items-center gap-6">
                <Checkbox
                  checked={checkedStates.task3}
                  onCheckedChange={() => handleCheckboxChange("task3")}
                  className="scale-150"
                />
                <p className="text-white">QA Task 3: Test functionality</p>
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
              <p className="text-gray-400">Picture</p>

              <div className="flex items-center justify-start w-full">
                <label
                  htmlFor="picture"
                  className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-center w-[250px]"
                >
                  Choose a picture
                </label>
                <input
                  id="picture"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePictureChange}
                />
                {pictureName && (
                  <p className="text-white ml-4">{pictureName}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-400 mb-3">Add Notes</p>
              <Textarea
                placeholder="Enter any important notes or defects"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-4 border-white text-white bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitDisabled}
              >
                Submit & Move to Next Stage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
