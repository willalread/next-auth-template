"use client"

import { logout } from "@/lib/actions/logout"

export function LogoutButton() {
  async function handleLogout() {
    await logout()
  }

  return (
    <form action={handleLogout}>
      <button type="submit">Logout</button>
    </form>
  )
}
