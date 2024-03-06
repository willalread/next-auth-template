"use server"

import bcrypt from "bcryptjs"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { settingsSchema, type SettingsSchema } from "@/lib/schemas"
import { getUserById, getUserByEmail } from "@/lib/data/user"
import { createVerificationToken } from "@/lib/data/verification-token"

export async function settings(values: SettingsSchema) {
  const result = settingsSchema.safeParse(values)

  if (!result.success) {
    return { error: "Invalid settings values." }
  }

  let { role, name, email, password, newPassword, isTwoFactorEnabled } =
    result.data

  const authUser = await currentUser()

  if (!authUser) {
    return { error: "Unauthorized" }
  }

  const user = await getUserById(authUser.id)

  if (!user) {
    return { error: "Unauthorized" }
  }

  let success = "Settings updated."

  if (authUser.isOAuth) {
    await db.user.update({
      where: { id: user.id },
      data: {
        role,
        name,
      },
    })

    return { success }
  }

  if (email !== user.email) {
    const existingUser = await getUserByEmail(email)

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use." }
    }

    const verificationToken = await createVerificationToken(email)

    await sendVerificationEmail(email, verificationToken.token)

    success = "Verification email set."
  }

  if (password && newPassword && user.password) {
    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (!passwordsMatch) {
      return { error: "Invalid password." }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    password = hashedPassword
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      role,
      name,
      email,
      password,
      isTwoFactorEnabled,
    },
  })

  return { success }
}
