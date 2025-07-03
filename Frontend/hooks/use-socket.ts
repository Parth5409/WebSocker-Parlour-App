"use client"

import { useEffect, useState, useCallback } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketMessage {
  type: string
  data: any
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<SocketMessage[]>([])

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
      timeout: 20000,
    })

    setSocket(socketInstance)

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server")
      setIsConnected(false)
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error)
      setIsConnected(false)
    })

    // Listen for attendance updates
    socketInstance.on("attendance_update", (data) => {
      console.log("Received attendance update:", data)
      setMessages((prev) => [
        ...prev,
        {
          type: "attendance_update",
          data,
        },
      ])
    })

    // Listen for employee updates
    socketInstance.on("employee_update", (data) => {
      console.log("Received employee update:", data)
      setMessages((prev) => [
        ...prev,
        {
          type: "employee_update",
          data,
        },
      ])
    })

    // Listen for task updates
    socketInstance.on("task_update", (data) => {
      console.log("Received task update:", data)
      setMessages((prev) => [
        ...prev,
        {
          type: "task_update",
          data,
        },
      ])
    })

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const sendMessage = useCallback(
    (event: string, data: any) => {
      if (socket && isConnected) {
        socket.emit(event, data)
        console.log(`Sent ${event}:`, data)
      } else {
        console.warn("Socket not connected, cannot send message")
      }
    },
    [socket, isConnected],
  )

  const sendAttendanceUpdate = useCallback(
    (attendanceData: any) => {
      sendMessage("attendance_update", attendanceData)
    },
    [sendMessage],
  )

  const sendEmployeeUpdate = useCallback(
    (employeeData: any) => {
      sendMessage("employee_update", employeeData)
    },
    [sendMessage],
  )

  const sendTaskUpdate = useCallback(
    (taskData: any) => {
      sendMessage("task_update", taskData)
    },
    [sendMessage],
  )

  return {
    socket,
    isConnected,
    messages,
    sendMessage,
    sendAttendanceUpdate,
    sendEmployeeUpdate,
    sendTaskUpdate,
  }
}
