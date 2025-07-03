"use client"

import { Badge } from "@/components/ui/badge"
import { useSocketContext } from "@/components/socket-provider"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const { isConnected } = useSocketContext()

  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <Wifi className="w-4 h-4 text-green-600" />
          <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">Live Connected</Badge>
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <WifiOff className="w-4 h-4 text-red-600" />
          <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">Disconnected</Badge>
        </>
      )}
    </div>
  )
}
