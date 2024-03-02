"use server"

import { AuthError } from "next-auth"

import { signIn } from "@/auth"
import { loginSchema, type LoginSchema } from "@/lib/schemas"

export async function login(values: LoginSchema, callbackUrl: string | null) {
  const result = loginSchema.safeParse(values)

  if (!result.success) {
    return { error: "Invalid form values." }
  }

  const { email, password } = result.data

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

  return { success: "Email sent." }
}
