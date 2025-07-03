import { Response, NextFunction } from "express"
import { AuthRequest } from "./auth"

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Token missing or invalid."
    })
    return
  }

  if (req.user.role !== "Super Admin") {
    res.status(403).json({
      success: false,
      message: "Access denied. Super Admin role required."
    })
    return
  }

  next()
}

export const requireAdminOrSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Token missing or invalid."
    })
    return
  }

  if (req.user.role !== "Admin" && req.user.role !== "Super Admin") {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin or Super Admin role required."
    })
    return
  }

  next()
}
