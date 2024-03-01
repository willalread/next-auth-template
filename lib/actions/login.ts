"use server"

import { loginSchema, type LoginSchema } from "@/lib/schemas"

export async function login(values: LoginSchema, callbackUrl: string | null) {
  const data = loginSchema.safeParse(values)

  if (!data.success) {
    return { error: "Invalid form data." }
  }

  return { success: "Email sent." }
}
