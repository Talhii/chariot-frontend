"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ToastContainer } from "react-toastify"
import { showErrorToast, showSuccessToast } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Save, Plus, X } from "lucide-react"

export default function AddSection() {
  const router = useRouter()
  const [sections, setSections] = useState([])

  const [sectionNumber, setSectionNumber] = useState(sections.length + 1)
  const [sectionName, setSectionName] = useState("")
  const [checklist, setChecklist] = useState([])
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [isMandatory, setIsMandatory] = useState(false)

  const handleSectionNumberChange = (e) => {
    setSectionNumber(Number(e.target.value))
  }

  const handleSectionNameChange = (e) => {
    setSectionName(e.target.value)
  }

  const handleNewTaskDescriptionChange = (e) => {
    setNewTaskDescription(e.target.value)
  }

  const handleIsMandatoryChange = (checked) => {
    setIsMandatory(checked)
  }

  const handleAddTask = () => {
    if (newTaskDescription.trim() === "") return

    const newTask = {
      description: newTaskDescription,
      isMandatory: isMandatory,
    }

    setChecklist((prevChecklist) => [...prevChecklist, newTask])
    setNewTaskDescription("")
    setIsMandatory(false)
  }

  const handleRemoveTask = (task) => {
    setChecklist((prevChecklist) => prevChecklist.filter((item) => item.description !== task.description))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

    try {
      await axios.post(`${apiBaseUrl}/admin/section`, {
        number: sectionNumber,
        name: sectionName,
        checklist: checklist,
      })
      showSuccessToast("Section created successfully")
      router.push("/admin/section")
    } catch (error) {
      console.error("Error creating section:", error)
      showErrorToast(`Error creating section: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <h2 className="text-3xl font-semibold mb-8">Add New Section</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Section Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sectionNumber" className="text-sm font-medium text-gray-400">
                  Section Number
                </Label>
                <Input
                  id="sectionNumber"
                  type="number"
                  value={sectionNumber}
                  onChange={handleSectionNumberChange}
                  className="bg-gray-800 text-white border-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectionName" className="text-sm font-medium text-gray-400">
                  Section Name
                </Label>
                <Input
                  id="sectionName"
                  type="text"
                  value={sectionName}
                  onChange={handleSectionNameChange}
                  placeholder="e.g., Cutting"
                  className="bg-gray-800 text-white border-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newTask" className="text-sm font-medium text-gray-400">
                  New Task
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="newTask"
                    type="text"
                    value={newTaskDescription}
                    onChange={handleNewTaskDescriptionChange}
                    placeholder="Enter new task description"
                    className="bg-gray-800 text-white border-gray-700 flex-grow"
                  />
                  <Button type="button" onClick={handleAddTask} className="bg-white text-black hover:bg-gray-200">
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox className="border-blue-400 text-blue-400" id="isMandatory" checked={isMandatory} onCheckedChange={handleIsMandatoryChange} />
                  <Label htmlFor="isMandatory" className="text-sm text-gray-400">
                    Mandatory
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                <Save className="mr-2 h-4 w-4" /> Save Section
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              {checklist.length > 0 ? (
                <div className="space-y-2">
                  {checklist.map((task, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                      <div>
                        <span className="text-white">{task.description}</span>
                        <span className="ml-2 text-sm text-gray-400">
                          {task.isMandatory ? "(Mandatory)" : "(Optional)"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleRemoveTask(task)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No tasks added yet.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </div>
  )
}

