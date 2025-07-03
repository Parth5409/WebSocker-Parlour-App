"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useSocketContext } from "@/components/socket-provider"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const baseURL = process.env.NEXT_PUBLIC_API_URL

interface AttendanceLog {
  _id: string
  employeeId: string
  employeeName: string
  action: string
  timestamp: string
  status: string
  createdAt?: Date
}

export function AttendanceSection() {
  const router = useRouter()
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])
  const { messages } = useSocketContext()

  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/attendance/logs`, {
          withCredentials: true // ✅ send cookies (token is httpOnly)
        })
        setAttendanceLogs(response.data.data || [])
      } catch (error) {
        console.error("Failed to fetch attendance logs:", error)
      }
    }

    fetchAttendanceLogs()
  }, [])

  useEffect(() => {
    const latestMessage = messages[messages.length - 1]
    if (latestMessage && latestMessage.type === "attendance_update") {
      const newLog: AttendanceLog = {
        _id: latestMessage.data._id || Date.now().toString(),
        employeeId: latestMessage.data.employeeId,
        employeeName: latestMessage.data.employeeName,
        action: latestMessage.data.action,
        timestamp:
          latestMessage.data.timestamp && !isNaN(new Date(latestMessage.data.timestamp).getTime())
            ? new Date(latestMessage.data.timestamp).toISOString()
            : new Date().toISOString(),
        status: latestMessage.data.status,
        createdAt: latestMessage.data.createdAt ? new Date(latestMessage.data.createdAt) : new Date()
      }

      setAttendanceLogs((prev) => [newLog, ...prev].slice(0, 50))
    }
  }, [messages])

  return (
    <Card className="parlour-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-purple-800">Live Attendance Tracking</CardTitle>
            <CardDescription className="text-purple-600">
              Real-time punch in/out logs from the attendance terminal
            </CardDescription>
          </div>
          <Button
            onClick={() => router.push("/attendance")}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent hover:text-purple-900"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Attendance Page
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {attendanceLogs.length === 0 ? (
          <div className="text-center py-8 text-purple-600">
            <p>No attendance logs yet.</p>
            <p className="text-sm mt-2">
              Visit the{" "}
              <a href="/attendance" className="text-pink-600 hover:underline font-medium">
                attendance page
              </a>{" "}
              to start tracking.
            </p>
          </div>
        ) : (
          <div className="parlour-table">
            <Table>
              <TableHeader className="parlour-table-header">
                <TableRow>
                  <TableHead className="text-purple-800 font-semibold">Employee</TableHead>
                  <TableHead className="text-purple-800 font-semibold">Action</TableHead>
                  <TableHead className="text-purple-800 font-semibold">Status</TableHead>
                  <TableHead className="text-purple-800 font-semibold">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceLogs.map((log, index) => (
                  <TableRow key={`${log._id}-${log.timestamp}-${index}`} className="parlour-table-row">
                    <TableCell className="font-medium text-purple-900">{log.employeeName}</TableCell>
                    <TableCell className="text-purple-700">{log.action}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          log.status === "in"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {log.status === "in" ? "In" : "Out"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-purple-700">
                      {new Date(log.timestamp).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
