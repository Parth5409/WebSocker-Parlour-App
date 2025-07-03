import { Request, Response } from "express"
import { generateToken } from "../utils/jwt"
import dotenv from "dotenv"
import { JwtPayload } from "../types"

dotenv.config()

const validRoles: JwtPayload["role"][] = ["Super Admin", "Admin"]

const getValidRole = (role: string | undefined, fallback: JwtPayload["role"]): JwtPayload["role"] => {
  return validRoles.includes(role as JwtPayload["role"]) ? (role as JwtPayload["role"]) : fallback
}

const mockUsers = [
  {
    id: "1",
    email: process.env.SUPERADMIN_EMAIL || "",
    password: process.env.SUPERADMIN_PASSWORD || "",
    role: getValidRole(process.env.SUPERADMIN_ROLE, "Super Admin")
  },
  {
    id: "2",
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
    role: getValidRole(process.env.ADMIN_ROLE, "Admin")
  }
]

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      })
      return
    }

    // Find user in mock data
    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      })
      return
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Send token as HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ensure HTTPS in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .cookie("role", user.role, {
        httpOnly: false, // accessible to frontend
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        }
      })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
