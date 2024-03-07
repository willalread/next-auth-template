"use server"

import { UserRole } from "@prisma/client"
import { currentUser } from "@/lib/auth"

export async function admin() {
  const { role } = await currentUser()

  if (role === UserRole.ADMIN) {
    return { success: "Allowed Server Action" }
  }

  return { error: "Forbidden Server Action" }
}
