"use server"

import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { currentUser } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/mail"
import { settingsSchema, type SettingsSchema } from "@/lib/schemas"
import { getUserByEmail } from "@/lib/user"

export async function settings(values: SettingsSchema) {
  const result = settingsSchema.safeParse(values)
  if (!result.success) return { error: "Invalid settings values." }

  let { role, name, email, password, newPassword, twoFactorEnabled } =
    result.data

  const user = await currentUser()

  let emailVerified = user.emailVerified
  let success = "Settings updated."

  if (user._count.accounts >= 1) {
    await db.user.update({
      where: { id: user.id },
      data: {
        role,
        name,
      },
    })

    return { success }
  }

  if (password && newPassword && user.password) {
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) return { error: "Invalid password." }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    password = hashedPassword
  }

  if (email !== user.email) {
    const existingUser = await getUserByEmail(email)

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use." }
    }

    await sendVerificationEmail(email)

    emailVerified = null
    success = "Verification email set."
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      role,
      name,
      email,
      emailVerified,
      password,
      twoFactorEnabled,
    },
  })

  return { success }
}
