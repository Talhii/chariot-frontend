"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer } from "react-toastify"
import { showErrorToast, showSuccessToast } from "@/lib/utils"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarIcon, FileIcon, Loader2, Save } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function EditOrder({ params }) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const orderId = use(params)?.id
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    projectName: "",
    customerName: "",
    dueDate: "",
    drawings: null,
    cuttingSheet: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/admin/order/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const order = response.data.data

        setFormData({
          projectName: order.projectName,
          customerName: order.customerName,
          dueDate: new Date(order.dueDate).toISOString(),
          drawings: null,
          cuttingSheet: null,
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching order:", error)
        showErrorToast(`Error fetching order: ${error}`)
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, apiBaseUrl])

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const uploadData = new FormData()
    uploadData.append("projectName", formData.projectName)
    uploadData.append("customerName", formData.customerName)
    uploadData.append("dueDate", formData.dueDate)
    if (formData.drawings) uploadData.append("files", formData.drawings)
    if (formData.cuttingSheet) uploadData.append("files", formData.cuttingSheet)

    try {
      await axios.put(`${apiBaseUrl}/admin/order/${orderId}`, uploadData, {
        headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      })
      showSuccessToast("Order Updated Successfully")
      router.push("/admin/order")
    } catch (error) {
      console.error("Error updating order:", error)
      showErrorToast(`Error updating order: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <h2 className="text-3xl font-semibold mb-8">Edit Order</h2>
      <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-white space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="bg-gray-800 text-white border-gray-700"
                  required
                />
              </div>

              <div className="text-white space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="bg-gray-800 text-white border-gray-700"
                  required
                />
              </div>

              <div className="text-white space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-800 text-white border-gray-700",
                        !formData.dueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                      onSelect={(date) => setFormData({ ...formData, dueDate: date ? date.toISOString() : "" })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="text-white space-y-2">
                <Label htmlFor="drawings">Drawings (PDF Only)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="drawings"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, "drawings")}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                  {formData.drawings && <FileIcon className="h-5 w-5 text-green-500" />}
                </div>
              </div>

              <div className="text-white space-y-2">
                <Label htmlFor="cuttingSheet">Cutting Sheet (PDF Only)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="cuttingSheet"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, "cuttingSheet")}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                  {formData.cuttingSheet && <FileIcon className="h-5 w-5 text-green-500" />}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Update Order
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}