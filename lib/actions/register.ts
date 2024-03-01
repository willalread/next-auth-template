"use server"

import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/lib/data/user"
import { registerSchema, type RegisterSchema } from "@/lib/schemas"

export async function register(values: RegisterSchema) {
  const result = registerSchema.safeParse(values)

  if (!result.success) {
    return { error: "Invalid form values." }
  }

  const { name, email, password } = result.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in use." }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // TODO: Send confirmation email.

  return { success: "Confirmation email sent." }
}
