"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ToastContainer } from "react-toastify"
import { showErrorToast, showSuccessToast } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User } from "lucide-react"

const roles = ["Admin", "Manager", "Worker"]

export default function AddUser() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    username: "",
    password: "",
    accessCode: "",
    section: "",
  })
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sections, setSections] = useState([])
  const token = localStorage.getItem('token');

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
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

    fetchSections()
  }, [])

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

    const newUser = {
      fullName: formData.fullName,
      role: formData.role,
      username: formData.role === "Worker" ? undefined : formData.username,
      password: formData.role === "Worker" ? undefined : formData.password,
      accessCode: formData.role === "Worker" ? formData.accessCode : undefined,
      section: formData.role === "Worker" ? formData.section : undefined,
    }

    const formDataToSend = new FormData()
    Object.entries(newUser).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value)
    })

    if (image) {
      const imageFile = await fetch(image).then((res) => res.blob())
      formDataToSend.append("file", imageFile, "profile.jpg")
    }

    try {
      setIsLoading(true)
      await axios.post(`${apiBaseUrl}/admin/user`, formDataToSend, {
        headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      })
      showSuccessToast("User Created Successfully")
      router.push("/admin/user")
    } catch (error) {
      console.error("Error creating user:", error)
      showErrorToast(`Error creating user: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <h2 className="text-3xl font-semibold mb-8">Add New User</h2>
      <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-6">
                <div className="text-white space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="e.g., John Doe"
                    className="bg-gray-800 text-white border-gray-700"
                    required
                  />
                </div>

                <div className="text-white space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(formData.role === "Admin" || formData.role === "Manager") && (
                  <>
                    <div className="text-white space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        placeholder="e.g., johndoe"
                        className="bg-gray-800 text-white border-gray-700"
                        required
                      />
                    </div>

                    <div className="text-white space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="Password"
                        className="bg-gray-800 text-white border-gray-700"
                        required
                      />
                    </div>
                  </>
                )}

                {formData.role === "Worker" && (
                  <>
                    <div className="text-white space-y-2">
                      <Label htmlFor="accessCode">Access Code</Label>
                      <Input
                        id="accessCode"
                        value={formData.accessCode}
                        onChange={(e) => handleChange("accessCode", e.target.value)}
                        placeholder="Access Code"
                        className="bg-gray-800 text-white border-gray-700"
                        required
                      />
                    </div>
                    <div className="text-white space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select value={formData.section} onValueChange={(value) => handleChange("section", value)}>
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
                  </>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div className="text-white space-y-2">
                  <Label htmlFor="image">Profile Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>

                <div className="flex justify-center">
                  <Avatar className="w-40 h-40">
                    <AvatarImage src={image || undefined} alt="Profile Preview" />
                    <AvatarFallback className="bg-gray-600">
                      <User className="w-20 h-20 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save User"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}