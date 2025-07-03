"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { EmployeeDialog } from "./employee-dialog"
import { useToast } from "@/hooks/use-toast"

const baseURL = process.env.NEXT_PUBLIC_API_URL

interface Employee {
  _id: string
  name: string
  role: string
  department: string
  status: string
}

interface EmployeesSectionProps {
  userRole: string
}

export function EmployeesSection({ userRole }: EmployeesSectionProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const { toast } = useToast()

  const isSuperAdmin = userRole === "Super Admin"

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/employees`, {
          withCredentials: true // ✅ use cookie
        })
        setEmployees(response.data.data || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch employees",
          variant: "destructive"
        })
      }
    }

    fetchEmployees()
  }, [])

  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setDialogOpen(true)
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await axios.delete(`${baseURL}/api/employees/${employeeId}`, {
        withCredentials: true
      })
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId))
      toast({
        title: "Success",
        description: "Employee deleted successfully",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive"
      })
    }
  }

  const handleSaveEmployee = async (employeeData: any) => {
    try {
      if (editingEmployee) {
        const response = await axios.put(
          `${baseURL}/api/employees/${editingEmployee._id}`,
          employeeData,
          { withCredentials: true }
        )
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === editingEmployee._id ? response.data.data : emp))
        )
      } else {
        const response = await axios.post(
          `${baseURL}/api/employees`,
          employeeData,
          { withCredentials: true }
        )
        setEmployees((prev) => [...prev, response.data.data])
      }

      setDialogOpen(false)
      toast({
        title: "Success",
        description: `Employee ${editingEmployee ? "updated" : "added"} successfully`,
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingEmployee ? "update" : "add"} employee`,
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="parlour-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-purple-800">Employees</CardTitle>
            <CardDescription className="text-purple-600">
              Manage your parlour staff {!isSuperAdmin && "(View Only)"}
            </CardDescription>
          </div>
          {isSuperAdmin && (
            <Button onClick={handleAddEmployee} className="parlour-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="parlour-table">
          <Table>
            <TableHeader className="parlour-table-header">
              <TableRow>
                <TableHead className="text-purple-800 font-semibold">Name</TableHead>
                <TableHead className="text-purple-800 font-semibold">Role</TableHead>
                <TableHead className="text-purple-800 font-semibold">Department</TableHead>
                <TableHead className="text-purple-800 font-semibold">Status</TableHead>
                {isSuperAdmin && <TableHead className="text-purple-800 font-semibold">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee._id} className="parlour-table-row">
                  <TableCell className="font-medium text-purple-900">{employee.name}</TableCell>
                  <TableCell className="text-purple-700">{employee.role}</TableCell>
                  <TableCell className="text-purple-700">{employee.department}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                          className="parlour-button-outline"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee._id)}
                          className="parlour-button-danger"
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
      </CardContent>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />
    </Card>
  )
}
