"use server"

import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { registerSchema, type RegisterSchema } from "@/lib/schemas"
import { createVerificationToken } from "@/lib/data/verification-token"
import { getUserByEmail } from "@/lib/data/user"

export async function register(values: RegisterSchema) {
  const result = registerSchema.safeParse(values)

  if (!result.success) {
    return { error: "Invalid register values." }
  }

  const { name, email, password } = result.data

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in use." }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  const verificationToken = await createVerificationToken(email)

  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: "Verification email sent." }
}
