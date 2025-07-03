"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: any
  onSave: (data: any) => void
}

export function EmployeeDialog({ open, onOpenChange, employee, onSave }: EmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    status: "Active",
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        role: employee.role || "",
        department: employee.department || "",
        status: employee.status || "Active",
      })
    } else {
      setFormData({
        name: "",
        role: "",
        department: "",
        status: "Active",
      })
    }
  }, [employee, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dialog-content">
        <DialogHeader>
          <DialogTitle className="text-purple-800">{employee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription className="text-purple-600">
            {employee ? "Update employee information" : "Add a new employee to your team"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right form-label">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="col-span-3 form-input"
                style={{ backgroundColor: "white", color: "rgb(88 28 135)" }}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right form-label">
                Role
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                className="col-span-3 form-input"
                style={{ backgroundColor: "white", color: "rgb(88 28 135)" }}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right form-label">
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
              >
                <SelectTrigger className="col-span-3 select-trigger">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="Hair Styling" className="select-item">
                    Hair Styling
                  </SelectItem>
                  <SelectItem value="Nail Care" className="select-item">
                    Nail Care
                  </SelectItem>
                  <SelectItem value="Skin Care" className="select-item">
                    Skin Care
                  </SelectItem>
                  <SelectItem value="Massage" className="select-item">
                    Massage
                  </SelectItem>
                  <SelectItem value="Reception" className="select-item">
                    Reception
                  </SelectItem>
                  <SelectItem value="Management" className="select-item">
                    Management
                  </SelectItem>
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
                  <SelectItem value="Active" className="select-item">
                    Active
                  </SelectItem>
                  <SelectItem value="Inactive" className="select-item">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="parlour-button-primary">
              Save Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
