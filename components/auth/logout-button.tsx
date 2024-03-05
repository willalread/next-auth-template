"use client"

import { logout } from "@/lib/actions/logout"

export function LogoutButton({ children }: { children: React.ReactNode }) {
  return (
    <span onClick={() => logout()} className="cursor-pointer">
      {children}
    </span>
  )
}
