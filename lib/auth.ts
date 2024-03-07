import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function currentUser() {
  const session = await auth()
  const id = session?.user?.id

  if (!id) redirect("/auth/login")

  const user = await db.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          accounts: true,
        },
      },
    },
  })

  if (!user) redirect("/auth/login")

  return user
}

export type User = Awaited<ReturnType<typeof currentUser>>
