"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, LogIn, LogOut, ArrowLeft } from "lucide-react"
import { useSocketContext } from "@/components/socket-provider"
import { useToast } from "@/hooks/use-toast"

const baseURL = process.env.NEXT_PUBLIC_API_URL

interface Employee {
  _id: string;
  name: string;
  role: string;
  department: string;
  status: string;
}

interface AttendanceLog {
  _id: string;
  employeeId: string;
  employeeName: string;
  action: string;
  timestamp: string;
  status: string;
  createdAt?: Date;
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, boolean>>({})
  const { sendAttendanceUpdate, socket } = useSocketContext()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchEmployeesAndStatus = async () => {
      try {
        const employeesResponse = await axios.get(`${baseURL}/api/employees`, {
          withCredentials: true
        })
        setEmployees(employeesResponse.data.data || [])

        const initialStatus: Record<string, boolean> = {}
        employeesResponse.data.data.forEach((emp: Employee) => {
          const stored = localStorage.getItem(`attendance_${emp._id}`)
          initialStatus[emp._id] = stored ? JSON.parse(stored).status : false
        })
        setAttendanceStatus(initialStatus)

        const logsResponse = await axios.get(`${baseURL}/api/attendance/logs`, {
          withCredentials: true
        })

        logsResponse.data.data.forEach((log: AttendanceLog) => {
          const storedItem = localStorage.getItem(`attendance_${log.employeeId}`)
          const storedData = storedItem ? JSON.parse(storedItem) : null

          if (
            initialStatus[log.employeeId] === undefined ||
            new Date(log.timestamp) > new Date(storedData?.lastUpdated || 0)
          ) {
            initialStatus[log.employeeId] = log.status === "in"
            localStorage.setItem(
              `attendance_${log.employeeId}`,
              JSON.stringify({ status: log.status === "in", lastUpdated: log.timestamp })
            )
          }
        })

        setAttendanceStatus(initialStatus)
      } catch (error) {
        console.error("Initialization error:", error)
        toast({
          title: "Error",
          description: "Failed to initialize attendance data",
          variant: "destructive"
        })
      }
    }

    fetchEmployeesAndStatus()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("status_update", (data: { employeeId: string; status: boolean }) => {
        setAttendanceStatus(prev => ({ ...prev, [data.employeeId]: data.status }))
        localStorage.setItem(
          `attendance_${data.employeeId}`,
          JSON.stringify({ status: data.status, lastUpdated: new Date().toISOString() })
        )
      })

      return () => socket.off("status_update")
    }
  }, [socket])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/logs`, {
          withCredentials: true
        })

        const statusMap: Record<string, boolean> = {}
        response.data.data.forEach((log: AttendanceLog) => {
          if (!statusMap[log.employeeId]) {
            statusMap[log.employeeId] = log.status === "in"
          }
        })

        setAttendanceStatus(prev => ({ ...prev, ...statusMap }))
      } catch (error) {
        console.error("Status refresh error:", error)
      }
    }, 300000) // every 5 mins

    return () => clearInterval(interval)
  }, [])

  const handlePunchAction = async (employeeId: string, employeeName: string) => {
    const currentStatus = attendanceStatus[employeeId]
    const newStatus = !currentStatus
    const action = newStatus ? "Punch In" : "Punch Out"
    const timestamp = new Date().toISOString()
    const status = newStatus ? "in" : "out"

    try {
      setAttendanceStatus(prev => ({ ...prev, [employeeId]: newStatus }))
      localStorage.setItem(
        `attendance_${employeeId}`,
        JSON.stringify({ status: newStatus, lastUpdated: timestamp })
      )

      sendAttendanceUpdate({ employeeId, employeeName, action, timestamp, status })

      toast({
        title: `${action} Successful`,
        description: `${employeeName} has ${newStatus ? "punched in" : "punched out"}`,
        variant: "success"
      })
    } catch (error) {
      setAttendanceStatus(prev => ({ ...prev, [employeeId]: currentStatus }))
      toast({
        title: `${action} Failed`,
        description: `Failed to ${action.toLowerCase()}`,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent hover:text-purple-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              💅 Employee Attendance 💅
            </h1>
            <p className="text-purple-600">Click to punch in or out</p>
          </div>
          <div />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => {
            const isIn = attendanceStatus[employee._id] || false
            return (
              <Card
                key={employee._id}
                className="hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm border-purple-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-purple-900 font-semibold">{employee.name}</CardTitle>
                    <Badge
                      className={
                        isIn
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {isIn ? "In" : "Out"}
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-600 font-medium">{employee.role}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handlePunchAction(employee._id, employee.name)}
                    className={`w-full ${isIn
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                      } font-medium`}
                    size="lg"
                  >
                    {isIn ? (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Punch Out
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Punch In
                      </>
                    )}
                  </Button>
                  <div className="mt-3 flex items-center justify-center text-xs text-purple-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date().toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Card className="inline-block bg-white/95 backdrop-blur-sm border-purple-200">
            <CardContent className="p-4">
              <p className="text-sm text-purple-700">
                Total Employees: <span className="font-semibold text-purple-900">{employees.length}</span> |
                Currently In:{" "}
                <span className="font-semibold text-green-600">
                  {Object.values(attendanceStatus).filter(status => status).length}
                </span>{" "}
                | Currently Out:{" "}
                <span className="font-semibold text-red-600">
                  {Object.values(attendanceStatus).filter(status => !status).length}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
