"use server"

import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

import { signIn } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { loginSchema, type LoginSchema } from "@/lib/schemas"

export async function login(values: LoginSchema, callbackUrl: string | null) {
  const result = loginSchema.safeParse(values)
  if (!result.success) return { error: "Invalid login values." }

  const { email, password, code } = result.data

  const user = await db.user.findUnique({ where: { email } })

  if (!user || !user.email || !user.password) {
    return { error: "Email does not exist." }
  }

  if (!user.emailVerified) {
    await sendVerificationEmail(user.email)
    return { success: "Verification email sent." }
  }

  const passwordsMatch = await bcrypt.compare(password, user.password)
  if (!passwordsMatch) return { error: "Invalid password." }

  if (user.twoFactorEnabled) {
    if (!code) {
      await sendTwoFactorTokenEmail(user.email)
      return { twoFactor: true }
    }

    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { email: user.email },
    })

    if (!twoFactorToken || twoFactorToken.token !== code) {
      return { error: "Invalid code." }
    }

    const hasExpired = new Date(twoFactorToken.expiresAt) < new Date()
    if (hasExpired) return { error: "Code has expired." }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      code,
      redirectTo: callbackUrl || "/user-info",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }

    throw error
  }
}
