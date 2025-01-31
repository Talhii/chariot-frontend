"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowUp, ArrowDown, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminDashboard() {

  const [dashboardData, setDashboardData] = useState({})
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/admin/dashboard`);
        const dashboardData = response.data.data;
        setDashboardData(dashboardData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        showErrorToast(`Error fetching orders ${error}`);
      }
    };
    fetchData();
  }, [dataChanged])

  const chartConfig = {
    piece: {
      label: "piece",
      color: "blue",
    },
  }

  const generateReport = () => {
    console.log("Report Generated")
  }

  const resolveFlaggedPiece = async (pieceId) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      await axios.put(`${apiBaseUrl}/admin/piece/flagged/${pieceId}/resolved`);
      showSuccessToast("Piece resolved Successfully")
    } catch (error) {
      console.error("Error resolving piece", error);
      showErrorToast(`Error resolving piece ${error}`);
    }

    setDataChanged(true);
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

      {/* Chart and Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className={`lg:col-span-2 ${cardStyle}`}>
          <CardHeader>
            <CardTitle className="text-gray-50">Daily Production</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={dashboardData?.chartData?.length > 0 && dashboardData.chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    dataKey="piece"
                    type="natural"
                    fill="var(--color-piece)"
                    fillOpacity={0.4}
                    stroke="var(--color-piece)"
                  />
                </AreaChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className={cardStyle}>
          <CardHeader>
            <CardTitle className="text-gray-50">Sections Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.sections?.length > 0 && dashboardData.sections.map((section) => (
              <div key={section._id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">{section.name}</span>
                  <span className="text-sm font-medium text-gray-50">{section.pieceCount} pieces</span>
                </div>
                <Progress value={(section.pieceCount / section.totalPieces) * 100} className="h-2 bg-gray-600" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Workers and Orders */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card className={cardStyle}>
          <CardHeader>
            <CardTitle className="text-gray-50">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-50">Order ID</TableHead>
                  <TableHead className="text-gray-50">Project Name</TableHead>
                  <TableHead className="text-gray-50">Customer Name</TableHead>
                  <TableHead className="text-gray-50">Due Date</TableHead>
                  <TableHead className="text-gray-50">Status</TableHead>
                  <TableHead className="text-gray-50">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.orders?.length > 0 && dashboardData.orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="text-gray-50">{order._id}</TableCell>
                    <TableCell className="text-gray-50">{order.projectName}</TableCell>
                    <TableCell className="text-gray-50">{order.customerName}</TableCell>
                    <TableCell className="text-gray-50">{new Date(order.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Completed"
                          ? "bg-green-700 text-green-100"
                          : order.status === "InProgress"
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
              {!dashboardData?.flaggedPieces?.length > 0 ? (
                <p className="text-gray-300">No flagged pieces to resolve.</p>
              ) : (
                <div className="space-y-4">
                  {dashboardData?.flaggedPieces?.length > 0 && dashboardData.flaggedPieces.map((piece, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow">
                      <div>
                        <p className="font-medium text-gray-50">Piece ID: {piece._id}</p>
                        <p className="text-sm text-gray-300">Issue: {piece.issue}</p>
                        <p className="text-sm text-gray-300">Worker: {piece.worker}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="bg-white text-black hover:bg-gray-200"
                        onClick={() => {
                          setDataChanged(false);
                          resolveFlaggedPiece(piece._id)
                        }}
                      >
                        Resolve
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-50">Assign Workers to Sections</h4>
              <div className="space-y-4">
                <Select className="bg-gray-700 text-white">
                  <SelectTrigger className="bg-gray-700">
                    <SelectValue placeholder="Select Worker" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {dashboardData?.workers?.length > 0 && dashboardData.workers.map((worker) => (
                      <SelectItem key={worker.fullName} value={worker.fullName} className="text-white hover:text-white"
                      >
                        {worker.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select className="bg-gray-700 text-white">
                  <SelectTrigger className="bg-gray-700 text-white">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {dashboardData?.sections?.length > 0 && dashboardData.sections.map((section) => (
                      <SelectItem
                        key={section._id}
                        value={section._id}
                        className="text-white hover:text-white"
                      >
                        {section.name}
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
      <ToastContainer />
    </div>
  )
}
