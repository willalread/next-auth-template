"use server"

import { AuthError } from "next-auth"

import { signIn } from "@/auth"
import { createVerificationToken } from "@/lib/data/verification-token"
import { getUserByEmail } from "@/lib/data/user"
import { sendVerificationEmail } from "@/lib/mail"
import { loginSchema, type LoginSchema } from "@/lib/schemas"

export async function login(values: LoginSchema, callbackUrl: string | null) {
  const result = loginSchema.safeParse(values)

  if (!result.success) {
    return { error: "Invalid form values." }
  }

  const { email, password } = result.data

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
