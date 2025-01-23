"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowUp, ArrowDown, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <div className="bg-gradient-to-br from-gray-950 to-black flex h-screen w-full bg-gray-900 text-white">
        <AppSidebar className="dark hidden md:block" />
        <SidebarInset className="bg-gradient-to-br from-gray-950 to-black flex-1 overflow-auto text-white w-full">
          <Component />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

const Component = () => {
  const [flaggedPieces, setFlaggedPieces] = useState([
    { id: "101", issue: "Crack on piece", worker: "John Doe" },
    { id: "102", issue: "Incorrect dimension", worker: "Jane Smith" },
  ])

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "blue",
    },
  }

  // Dummy data for the dashboard
  const workers = [
    { name: "John Doe", processed: 50, piecesPerHour: 10, flagged: 1 },
    { name: "Jane Smith", processed: 45, piecesPerHour: 9, flagged: 0 },
    { name: "Bob Johnson", processed: 55, piecesPerHour: 11, flagged: 2 },
    { name: "Alice Brown", processed: 48, piecesPerHour: 9.5, flagged: 1 },
  ]

  const stages = [
    { id: "stage1", name: "Stage 1", status: "Completed", pieces: 10 },
    { id: "stage2", name: "Stage 2", status: "In Progress", pieces: 8 },
    { id: "stage3", name: "Stage 3", status: "Pending", pieces: 5 },
    { id: "stage4", name: "Stage 4", status: "Pending", pieces: 7 },
    { id: "stage5", name: "Stage 5", status: "Pending", pieces: 6 },
  ]

  const orders = [
    { id: "#12345", status: "In Progress", flagged: false },
    { id: "#67890", status: "Pending", flagged: false },
    { id: "#54321", status: "Flagged", flagged: true },
    { id: "#98765", status: "Completed", flagged: false },
    { id: "#24680", status: "In Progress", flagged: false },
  ]

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ]

  const generateReport = () => {
    console.log("Report Generated")
  }

  const cardStyle = "bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white"
  const buttonStyle =
    "bg-white text-black hover:bg-gray-200 focus:ring focus:ring-gray-400 transition-colors duration-200"

  return (
    <div className="p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-50">Admin Dashboard</h1>
        <Button className={buttonStyle} onClick={generateReport}>
          Generate Report
        </Button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className={cardStyle}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-300">Total Pieces</p>
              <p className="text-2xl font-bold text-gray-50">1,234</p>
            </div>
            <div className="bg-green-700 p-3 rounded-full">
              <ArrowUp className="h-6 w-6 text-green-300" />
            </div>
          </CardContent>
        </Card>
        <Card className={cardStyle}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-300">Flagged Pieces</p>
              <p className="text-2xl font-bold text-gray-50">23</p>
            </div>
            <div className="bg-red-700 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-300" />
            </div>
          </CardContent>
        </Card>
        <Card className={cardStyle}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-300">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-50">89</p>
            </div>
            <div className="bg-blue-700 p-3 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-blue-300" />
            </div>
          </CardContent>
        </Card>
        <Card className={cardStyle}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-300">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-50">15</p>
            </div>
            <div className="bg-yellow-700 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className={`lg:col-span-2 ${cardStyle}`}>
          <CardHeader>
            <CardTitle className="text-gray-50">Weekly Production</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                  />
                </AreaChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className={cardStyle}>
          <CardHeader>
            <CardTitle className="text-gray-50">Stages Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {stages.map((stage) => (
              <div key={stage.id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">{stage.name}</span>
                  <span className="text-sm font-medium text-gray-50">{stage.pieces} pieces</span>
                </div>
                <Progress value={(stage.pieces / 20) * 100} className="h-2 bg-gray-600" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Workers and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className={cardStyle}>
          <CardHeader>
            <CardTitle className="text-gray-50">Top Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-50">Name</TableHead>
                  <TableHead className="text-gray-50">Processed</TableHead>
                  <TableHead className="text-gray-50">Pieces/Hour</TableHead>
                  <TableHead className="text-gray-50">Flagged</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.name}>
                    <TableCell className="text-gray-50">{worker.name}</TableCell>
                    <TableCell className="text-gray-50">{worker.processed}</TableCell>
                    <TableCell className="text-gray-50">{worker.piecesPerHour}</TableCell>
                    <TableCell className="text-gray-50">{worker.flagged}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className={cardStyle}>
          <CardHeader>
            <CardTitle className="text-gray-50">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-50">Order ID</TableHead>
                  <TableHead className="text-gray-50">Status</TableHead>
                  <TableHead className="text-gray-50">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-gray-50">{order.id}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Completed"
                          ? "bg-green-700 text-green-100"
                          : order.status === "In Progress"
                            ? "bg-blue-700 text-blue-100"
                            : order.status === "Pending"
                              ? "bg-yellow-700 text-yellow-100"
                              : "bg-red-700 text-red-100"
                          }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Action Center */}
      <Card className={cardStyle}>
        <CardHeader>
          <CardTitle className="text-gray-50">Action Center</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-50">Resolve Flagged Pieces</h4>
              {flaggedPieces.length === 0 ? (
                <p className="text-gray-300">No flagged pieces to resolve.</p>
              ) : (
                <div className="space-y-4">
                  {flaggedPieces.map((piece, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow">
                      <div>
                        <p className="font-medium text-gray-50">Piece ID: {piece.id}</p>
                        <p className="text-sm text-gray-300">Issue: {piece.issue}</p>
                        <p className="text-sm text-gray-300">Worker: {piece.worker}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="bg-white text-black hover:bg-gray-200"
                        onClick={() => setFlaggedPieces((prev) => prev.filter((_, i) => i !== index))}
                      >
                        Resolve
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-50">Assign Workers to Stages</h4>
              <div className="space-y-4">
                <Select className="bg-gray-700 text-white">
                  <SelectTrigger className="bg-gray-700">
                    <SelectValue placeholder="Select Worker" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {workers.map((worker) => (
                      <SelectItem key={worker.name} value={worker.name}>
                        {worker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select className="bg-gray-700 text-white">
                  <SelectTrigger className="bg-gray-700">
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="w-full bg-white text-black hover:bg-gray-200">Assign</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
