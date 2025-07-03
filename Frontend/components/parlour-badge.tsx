"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ParlourBadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "success" | "warning" | "danger"
  className?: string
}

export function ParlourBadge({ children, variant = "default", className }: ParlourBadgeProps) {
  const variants = {
    default: "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200",
    secondary: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200",
    success: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200",
    warning: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200",
    danger: "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-rose-200",
  }

  return <Badge className={cn(variants[variant], className)}>{children}</Badge>
}
