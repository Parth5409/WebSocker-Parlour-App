import { Response } from "express"
import Employee from "../models/Employee"
import { AuthRequest } from "../middleware/auth"

export const getAllEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const employees = await Employee.find().lean()

    res.json({
      success: true,
      data: employees.map(emp => ({
        _id: emp._id,
        name: emp.name,
        role: emp.role,
        department: emp.department,
        status: emp.status
      }))
    })
  } catch (error) {
    console.error("Get employees error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve employees"
    })
  }
}

export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, role, department, status } = req.body

    if (!name || !role || !department) {
      res.status(400).json({
        success: false,
        message: "Name, role, and department are required"
      })
      return
    }

    const employee = new Employee({
      name,
      role,
      department,
      status: status || "Active"
    })

    await employee.save()

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee
    })
  } catch (error) {
    console.error("Create employee error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create employee"
    })
  }
}

export const updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, role, department, status } = req.body

    const employee = await Employee.findByIdAndUpdate(
      id,
      { name, role, department, status },
      { new: true, runValidators: true }
    )

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found"
      })
      return
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: employee
    })
  } catch (error) {
    console.error("Update employee error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update employee"
    })
  }
}

export const deleteEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const employee = await Employee.findByIdAndDelete(id)

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found"
      })
      return
    }

    res.json({
      success: true,
      message: "Employee deleted successfully"
    })
  } catch (error) {
    console.error("Delete employee error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete employee"
    })
  }
}
