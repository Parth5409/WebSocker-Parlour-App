"use client"

import { useState, useEffect, useCallback } from "react"

interface WebSocketMessage {
  type: string
  data: any
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true)

    // Simulate connection status changes
    const interval = setInterval(() => {
      setIsConnected((prev) => {
        // Occasionally simulate disconnection/reconnection
        if (Math.random() < 0.05) {
          return !prev
        }
        return prev
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    // Simulate sending message and receiving confirmation
    setMessages((prev) => [...prev, message])

    // Simulate network delay
    setTimeout(() => {
      console.log("WebSocket message sent:", message)
    }, 100)
  }, [])

  return {
    isConnected,
    messages,
    sendMessage,
  }
}
