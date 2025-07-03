"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { TaskDialog } from "./task-dialog"
import { useToast } from "@/hooks/use-toast"

const baseURL = process.env.NEXT_PUBLIC_API_URL

interface Task {
  _id: string
  title: string
  description: string
  assignedTo: string
  assignedToName?: string
  priority: string
  status: string
  dueDate: string
}

interface Employee {
  _id: string
  name: string
}

interface TasksSectionProps {
  userRole: string
}

export function TasksSection({ userRole }: TasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const isSuperAdmin = userRole === "Super Admin"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [tasksRes, employeesRes] = await Promise.all([
          axios.get(`${baseURL}/api/tasks`, { withCredentials: true }),
          axios.get(`${baseURL}/api/employees`, { withCredentials: true }),
        ])

        setEmployees(employeesRes.data.data || [])

        const tasksWithNames = tasksRes.data.data.map((task: Task) => ({
          ...task,
          assignedToName:
            employeesRes.data.data.find((e: Employee) => e._id === task.assignedTo)?.name || task.assignedTo,
        }))

        setTasks(tasksWithNames)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddTask = () => {
    setEditingTask(null)
    setDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${baseURL}/api/tasks/${taskId}`, {
        withCredentials: true,
      })
      setTasks((prev) => prev.filter((task) => task._id !== taskId))
      toast({
        title: "Success",
        description: "Task deleted successfully",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to delete task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleSaveTask = async (taskData: any) => {
    try {
      setLoading(true)
      let response: any

      if (editingTask) {
        response = await axios.put(
          `${baseURL}/api/tasks/${editingTask._id}`,
          taskData,
          { withCredentials: true }
        )

        setTasks((prev) =>
          prev.map((task) =>
            task._id === editingTask._id
              ? {
                  ...response.data.data,
                  assignedToName:
                    employees.find((e) => e._id === response.data.data.assignedTo)?.name ||
                    response.data.data.assignedTo,
                }
              : task
          )
        )
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, taskData, {
          withCredentials: true,
        })

        setTasks((prev) => [
          ...prev,
          {
            ...response.data.data,
            assignedToName:
              employees.find((e) => e._id === response.data.data.assignedTo)?.name ||
              response.data.data.assignedTo,
          },
        ])
      }

      toast({
        title: "Success",
        description: `Task ${editingTask ? "updated" : "created"} successfully`,
        variant: "success",
      })
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to save task:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingTask ? "update" : "create"} task`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="parlour-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-purple-800">Tasks</CardTitle>
            <CardDescription className="text-purple-600">
              Manage employee tasks and assignments {!isSuperAdmin && "(View Only)"}
            </CardDescription>
          </div>
          {isSuperAdmin && (
            <Button onClick={handleAddTask} className="parlour-button-primary" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && !tasks.length ? (
          <div className="text-center py-8">Loading tasks...</div>
        ) : (
          <div className="parlour-table">
            <Table>
              <TableHeader className="parlour-table-header">
                <TableRow>
                  <TableHead className="text-purple-800 font-semibold">Task</TableHead>
                  <TableHead className="text-purple-800 font-semibold">Assigned To</TableHead>
                  <TableHead className="text-purple-800 font-semibold">Priority</TableHead>
                  <TableHead className="text-purple-800 font-semibold">Status</TableHead>
                  <TableHead className="text-purple-800 font-semibold">Due Date</TableHead>
                  {isSuperAdmin && (
                    <TableHead className="text-purple-800 font-semibold">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id} className="parlour-table-row">
                    <TableCell className="font-medium text-purple-900">{task.title}</TableCell>
                    <TableCell className="text-purple-700">{task.assignedToName}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeClass(task.priority)}>{task.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(task.status)}>{task.status}</Badge>
                    </TableCell>
                    <TableCell className="text-purple-700">{formatDate(task.dueDate)}</TableCell>
                    {isSuperAdmin && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            className="parlour-button-outline"
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTask(task._id)}
                            className="parlour-button-danger"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editingTask} onSave={handleSaveTask} />
    </Card>
  )
}

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Pending":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
