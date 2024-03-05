"use client"

import { useCurrentUser } from "@/lib/hooks/use-current-user"

export default function SettingsPage() {
  const user = useCurrentUser()

  return (
    <div>
      <p>{user?.name}</p>
    </div>
  )
}
