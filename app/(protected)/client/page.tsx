"use client"

import { useCurrentUser } from "@/lib/hooks/auth"
import { UserInfo } from "@/components/user-info"

export default function ClientPage() {
  const user = useCurrentUser()

  return <UserInfo label="Client Component" user={user} />
}
