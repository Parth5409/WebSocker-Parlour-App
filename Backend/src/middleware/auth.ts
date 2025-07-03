import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import { JwtPayload } from "../types"

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      })
      return
    }

    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    })
  }
}
