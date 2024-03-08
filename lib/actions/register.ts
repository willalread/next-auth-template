"use server"

import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { registerSchema, type RegisterSchema } from "@/lib/schemas"

export async function register(values: RegisterSchema) {
  const result = registerSchema.safeParse(values)
  if (!result.success) return { error: "Invalid register values." }

  const { name, email, password } = result.data

  const existingUser = await db.user.findUnique({ where: { email } })

  if (existingUser) return { error: "Email already in use." }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  await sendVerificationEmail(email)

  return { success: "Verification email sent." }
}
