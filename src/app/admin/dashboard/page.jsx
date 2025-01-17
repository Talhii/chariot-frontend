"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data for the dashboard
const workers = [
  { name: "John Doe", processed: 50, avgTime: "5 min/piece", flagged: 1 },
  { name: "Jane Smith", processed: 45, avgTime: "6 min/piece", flagged: 0 }
];

const stages = [
  { id: "stage1", name: "Stage 1", status: "Completed", pieces: 10 },
  { id: "stage2", name: "Stage 2", status: "In Progress", pieces: 8 },
  { id: "stage3", name: "Stage 3", status: "Pending", pieces: 5 },
  { id: "stage4", name: "Stage 4", status: "Pending", pieces: 7 },
  { id: "stage5", name: "Stage 5", status: "Pending", pieces: 6 }
];

const orders = [
  { id: "#12345", status: "In Progress", flagged: false },
  { id: "#67890", status: "Pending", flagged: false },
  { id: "#54321", status: "Flagged", flagged: true }
];

export default function AdminDashboard() {
  const [flaggedPieces, setFlaggedPieces] = useState([
    { id: "101", issue: "Crack on piece", worker: "John Doe" },
    { id: "102", issue: "Incorrect dimension", worker: "Jane Smith" }
  ]);

  // Function to simulate report generation
  const generateReport = () => {
    console.log("Report Generated");
    // Logic for generating CSV or PDF reports
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center py-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          <Button className="bg-blue-600 hover:bg-blue-700 text-sm" onClick={generateReport}>Generate Report</Button>
        </header>

        {/* Live Overview */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Live Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stage Overview */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-2">
              <h4 className="text-lg font-medium mb-2">Stages Overview</h4>
              {stages.map((stage) => (
                <div key={stage.id} className="flex justify-between mb-4 p-4 bg-gray-700 rounded-lg">
                  <div className="w-1/3">
                    <p className="text-sm text-gray-400">{stage.name}</p>
                    <Progress value={(stage.pieces / 20) * 100} className="mb-2" />
                    <p className={`text-sm ${stage.status === "Completed" ? "text-green-400" : stage.status === "In Progress" ? "text-yellow-400" : "text-red-400"}`}>
                      {stage.status}
                    </p>
                  </div>
                  <div className="w-1/3">
                    <p className="text-sm text-white">Pieces: {stage.pieces}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Worker Performance */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h4 className="text-lg font-medium mb-2">Worker Performance</h4>
              {workers.map((worker) => (
                <div key={worker.name} className="mb-4">
                  <p className="text-lg font-medium">{worker.name}</p>
                  <p className="text-sm text-gray-400">Processed: {worker.processed} pieces</p>
                  <p className="text-sm text-gray-400">Avg time: {worker.avgTime}</p>
                  <p className="text-sm text-yellow-400">{worker.flagged} flagged piece(s)</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Overview */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Order Overview</h3>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Order ID</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-700">
                    <TableCell>{order.id}</TableCell>
                    <TableCell className={order.flagged ? "text-red-400" : "text-green-400"}>
                      {order.status}
                    </TableCell>
                    <TableCell>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Action Center */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Action Center</h3>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-medium mb-4">Resolve Flagged Pieces</h4>
            <div className="grid gap-4">
              {flaggedPieces.length === 0 ? (
                <p className="text-gray-400">No flagged pieces to resolve.</p>
              ) : (
                flaggedPieces.map((piece, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm text-white">Piece ID: {piece.id}</p>
                      <p className="text-sm text-gray-400">Issue: {piece.issue}</p>
                    </div>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-sm"
                      onClick={() =>
                        setFlaggedPieces((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Resolve
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4">Assign Workers to Stages</h4>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Select>
                  <SelectTrigger className="w-40 border-2 border-white text-white bg-transparent rounded-md">
                    <SelectValue placeholder="Select Worker" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800">
                    <SelectItem value="worker1" className="text-white">John Doe</SelectItem>
                    <SelectItem value="worker2" className="text-white">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-40 border-2 border-white text-white bg-transparent rounded-md">
                    <SelectValue placeholder="Select Stage" className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800">
                    <SelectItem value="stage1" className="text-white">Stage 1</SelectItem>
                    <SelectItem value="stage2" className="text-white">Stage 2</SelectItem>
                    <SelectItem value="stage3" className="text-white">Stage 3</SelectItem>
                    <SelectItem value="stage4" className="text-white">Stage 4</SelectItem>
                    <SelectItem value="stage5" className="text-white">Stage 5</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-blue-600 hover:bg-blue-700 text-sm text-white">
                  Assign
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
