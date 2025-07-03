import { Response } from "express"
import AttendanceLog from "../models/AttendanceLog"
import { AuthRequest } from "../middleware/auth"

export const createAttendanceLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, employeeName, action, status } = req.body

    if (!employeeId || !employeeName || !action || !status) {
      res.status(400).json({
        success: false,
        message: "All fields are required"
      })
      return
    }

    // Optional: Use authenticated user info for tracking/logging
    const createdBy = req.user?.email || "Unknown"

    const newLog = new AttendanceLog({
      employeeId,
      employeeName,
      action,
      status,
      timestamp: new Date().toISOString(),
      // createdBy, // ← You can store this if schema supports it
    })

    await newLog.save()

    res.status(201).json({
      success: true,
      message: "Attendance log created successfully",
      data: newLog
    })
  } catch (error) {
    console.error("Create attendance log error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create attendance log"
    })
  }
}

export const getAttendanceLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50

    const logs = await AttendanceLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)

    res.json({
      success: true,
      message: "Attendance logs retrieved successfully",
      data: logs
    })
  } catch (error) {
    console.error("Get attendance logs error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance logs"
    })
  }
}
