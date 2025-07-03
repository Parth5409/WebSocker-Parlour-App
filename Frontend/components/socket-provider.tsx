"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useSocket } from "@/hooks/use-socket"

interface SocketContextType {
  socket: any
  isConnected: boolean
  messages: any[]
  sendMessage: (event: string, data: any) => void
  sendAttendanceUpdate: (data: any) => void
  sendEmployeeUpdate: (data: any) => void
  sendTaskUpdate: (data: any) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketData = useSocket()

  return <SocketContext.Provider value={socketData}>{children}</SocketContext.Provider>
}

export function useSocketContext() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider")
  }
  return context
}
