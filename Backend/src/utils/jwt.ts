import jwt from "jsonwebtoken"
import { JwtPayload } from "../types"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key"

/**
 * Generates a JWT token from a given payload
 * @param payload - user info to embed in token (userId, email, role)
 * @returns signed JWT token string
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token - JWT token string
 * @returns decoded JwtPayload object
 * @throws if the token is invalid or expired
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}
