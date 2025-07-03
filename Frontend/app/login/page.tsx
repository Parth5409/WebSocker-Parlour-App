"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // Important: allows server to set cookie
      )

      if (response.data.success) {
        const { user } = response.data.data

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.role}!`,
          variant: "success",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: response.data.message || "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      let errorMessage = "An error occurred during login"

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <Card className="w-full max-w-md parlour-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ Parlour Admin ✨
          </CardTitle>
          <CardDescription className="text-center text-purple-600">
            Sign in to your admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="form-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@parlour.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                style={{ backgroundColor: "white", color: "rgb(88 28 135)" }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="form-label">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                style={{ backgroundColor: "white", color: "rgb(88 28 135)" }}
              />
            </div>
            <Button type="submit" className="w-full parlour-button-primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
