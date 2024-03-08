"use server"

import { db } from "@/lib/db"

export async function verifyEmail(token: string) {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) return { error: "Token does not exist." }

  const hasExpired = new Date(verificationToken.expiresAt) < new Date()
  if (hasExpired) return { error: "Token has expired." }

  const user = await db.user.findUnique({
    where: { email: verificationToken.email },
  })

  if (!user) return { error: "Email does not exist." }

  await db.user.update({
    where: { id: user.id },
    data: {
      email: verificationToken.email,
      emailVerified: new Date(),
    },
  })

  await db.verificationToken.delete({
    where: { id: verificationToken.id },
  })

  return { success: "Email verified." }
}
