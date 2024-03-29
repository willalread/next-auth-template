"use server"

import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/schemas"

export async function resetPassword(
  values: ResetPasswordSchema,
  token: string | null,
) {
  const result = resetPasswordSchema.safeParse(values)
  if (!result.success) return { error: "Invalid password." }

  const { password } = result.data

  if (!token) return { error: "Missing token." }

  const passwordResetToken = await db.passwordResetToken.findUnique({
    where: { token },
  })

  if (!passwordResetToken) return { error: "Token does not exist." }

  const hasExpired = new Date(passwordResetToken.expiresAt) < new Date()
  if (hasExpired) return { error: "Token has expired." }

  const user = await db.user.findUnique({
    where: { email: passwordResetToken.email },
  })

  if (!user) return { error: "Email does not exist." }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  })

  await db.passwordResetToken.delete({
    where: { id: passwordResetToken.id },
  })

  return { success: "Password reset." }
}
