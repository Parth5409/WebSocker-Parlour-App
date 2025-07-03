"use client"

import Cookies from "js-cookie"

const USER_ROLE_KEY = "role" // must match backend cookie key

// Only role is accessible from frontend (token is HTTP-only)
export function setUserRole(role: string) {
  Cookies.set(USER_ROLE_KEY, role, {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: 7 // days
  })
}

export function getUserRole(): string | undefined {
  return Cookies.get(USER_ROLE_KEY)
}

export function clearAuth() {
  Cookies.remove(USER_ROLE_KEY)
}

export function isAuthenticated(): boolean {
  // Cannot check token (it's HTTP-only), so fallback to presence of role cookie
  return !!Cookies.get(USER_ROLE_KEY)
}
