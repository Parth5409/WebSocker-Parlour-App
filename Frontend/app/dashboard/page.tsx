"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut, Users, ClipboardList, Clock } from "lucide-react"
import { EmployeesSection } from "@/components/employees-section"
import { TasksSection } from "@/components/tasks-section"
import { AttendanceSection } from "@/components/attendance-section"
import { getUserRole, clearAuth } from "@/lib/auth"
import { useSocketContext } from "@/components/socket-provider"
import { ConnectionStatus } from "@/components/connection-status"


export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const { isConnected } = useSocketContext()

  useEffect(() => {
    const role = getUserRole()
    if (!role) {
      router.push("/login")
      return
    }
    setUserRole(role)
  }, [router])

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="parlour-header shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Parlour Dashboard
              </h1>
              <div className="parlour-badge-role">{userRole}</div>
              <ConnectionStatus />
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent hover:text-purple-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList className="parlour-tabs grid w-full grid-cols-3">
            <TabsTrigger value="employees" className="parlour-tab-trigger flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Employees</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="parlour-tab-trigger flex items-center space-x-2">
              <ClipboardList className="w-4 h-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="parlour-tab-trigger flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Attendance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <EmployeesSection userRole={userRole} />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksSection userRole={userRole} />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
