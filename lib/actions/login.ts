"use server"

import { AuthError } from "next-auth"

import { signIn } from "@/auth"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/lib/data/two-factor-confirmation"
import {
  createTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "@/lib/data/two-factor-token"
import { createVerificationToken } from "@/lib/data/verification-token"
import { getUserByEmail } from "@/lib/data/user"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { loginSchema, type LoginSchema } from "@/lib/schemas"

export async function login(values: LoginSchema, callbackUrl: string | null) {
  const result = loginSchema.safeParse(values)

  if (!result.success) {
    return { error: "Invalid login values." }
  }

  const { email, password, code } = result.data

  const user = await getUserByEmail(email)

  if (!user || !user.email || !user.password) {
    return { error: "Email does not exist." }
  }

  if (!user.emailVerified) {
    const verificationToken = await createVerificationToken(user.email)

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    )

    return { success: "Confirmation email sent." }
  }

  if (user.isTwoFactorEnabled) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(user.email)

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code." }
      }

      const hasExpired = new Date(twoFactorToken.expiresAt) < new Date()

      if (hasExpired) {
        return { error: "Code has expired." }
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      })

      const confirmation = await getTwoFactorConfirmationByUserId(user.id)

      if (confirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: confirmation.id },
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: user.id,
        },
      })
    } else {
      const twoFactorToken = await createTwoFactorToken(user.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || "/settings",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "Something went wrong." }
      }
    }

    throw error
  }
}
