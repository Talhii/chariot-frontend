"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer } from "react-toastify"
import { showSuccessToast, showErrorToast } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function EditPiece({ params }) {
  const pieceId = use(params)?.id
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
  const [sections, setSections] = useState([])
  const [formData, setFormData] = useState({
    number: "",
    currentSectionId: "",
    status: "InProgress",
    history: [],
  })
  const token = localStorage.getItem('token');
  const router = useRouter()

  useEffect(() => {
    const fetchPieceData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/admin/piece/${pieceId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setFormData(response.data.data)
      } catch (error) {
        console.error("Error fetching piece data:", error)
        showErrorToast(`Error fetching piece data: ${error}`)
      }
    }

    const fetchSections = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/admin/section`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSections(response.data.data)
      } catch (error) {
        console.error("Error fetching sections:", error)
        showErrorToast(`Error fetching sections: ${error}`)
      }
    }

    if (pieceId) {
      fetchPieceData()
      fetchSections()
    }
  }, [pieceId, apiBaseUrl])

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${apiBaseUrl}/admin/piece/${pieceId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showSuccessToast("Piece Updated Successfully")
      router.push("/admin/piece")
    } catch (error) {
      console.error("Error updating piece:", error)
      showErrorToast(`Error updating piece: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <h2 className="text-3xl font-semibold mb-8">Edit Piece</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Piece Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Piece Number</label>
                <Input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  className="bg-gray-800 text-white border-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Section</label>
                <Select
                  name="currentSectionId"
                  value={formData.currentSectionId._id}
                  onValueChange={(value) => handleChange("currentSectionId", value)}
                >
                  <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    {sections.map((section) => (
                      <SelectItem key={section._id} value={section._id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Status</label>
                <Select name="status" value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="InProgress">InProgress</SelectItem>
                    <SelectItem value="Flagged">Flagged</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Piece History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </div>
  )
}