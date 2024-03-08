"use server"

import { sendPasswordResetEmail } from "@/lib/mail"
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/schemas"
import { getUserByEmail } from "@/lib/user"

export async function forgotPassword(values: ForgotPasswordSchema) {
  const result = forgotPasswordSchema.safeParse(values)
  if (!result.success) return { error: "Invalid email." }

  const { email } = result.data

  const user = await getUserByEmail(email)

  if (!user || !user.email || !user.password) {
    return { error: "Email does not exist." }
  }

  await sendPasswordResetEmail(user.email)

  return { success: "Password reset email sent." }
}
