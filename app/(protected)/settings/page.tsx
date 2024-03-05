"use client"

import { useCurrentUser } from "@/lib/hooks/auth"

export default function SettingsPage() {
  const user = useCurrentUser()

  return (
    <div>
      <p>{user?.name}</p>
    </div>
  )
}
