"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const baseURL = process.env.NEXT_PUBLIC_API_URL

interface Employee {
  _id: string
  name: string
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: any
  onSave: (data: any) => void
}

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  })

  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assignedTo: task.assignedTo || "",
        priority: task.priority || "Medium",
        status: task.status || "Pending",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        status: "Pending",
        dueDate: "",
      })
    }
  }, [task, open])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${baseURL}/api/employees`, {
          withCredentials: true // ✅ use cookie auth
        })
        setEmployees(response.data.data || [])
      } catch (error) {
        console.error("Failed to fetch employees:", error)
        toast({
          title: "Error",
          description: "Failed to load employee list",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchEmployees()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      const formattedDueDate = formData.dueDate
        ? new Date(formData.dueDate).toISOString().split('T')[0]
        : ''

      const taskData = {
        ...formData,
        dueDate: formattedDueDate
      }

      onSave(taskData)
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "Failed to process task data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] dialog-content">
        <DialogHeader>
          <DialogTitle className="text-purple-800">
            {task ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            {task ? "Update task information" : "Create a new task assignment"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right form-label">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="col-span-3 form-input"
                style={{ backgroundColor: "white", color: "rgb(88 28 135)" }}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right form-label">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="col-span-3 form-textarea"
                style={{ backgroundColor: "white", color: "rgb(88 28 135)" }}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right form-label">
                Assign To
              </Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, assignedTo: value }))}
                disabled={loading}
              >
                <SelectTrigger className="col-span-3 select-trigger">
                  <SelectValue placeholder={loading ? "Loading employees..." : "Select employee"} />
                </SelectTrigger>
                <SelectContent className="select-content">
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id} className="select-item">
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right form-label">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="col-span-3 select-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="High" className="select-item">High</SelectItem>
                  <SelectItem value="Medium" className="select-item">Medium</SelectItem>
                  <SelectItem value="Low" className="select-item">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right form-label">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="col-span-3 select-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="Pending" className="select-item">Pending</SelectItem>
                  <SelectItem value="In Progress" className="select-item">In Progress</SelectItem>
                  <SelectItem value="Completed" className="select-item">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right form-label">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="col-span-3 form-input"
                style={{ backgroundColor: "white", color: "rgb(88 28 135)" }}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="parlour-button-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
