"use server"

import { registerSchema, type RegisterSchema } from "@/lib/schemas"

export async function register(values: RegisterSchema) {
  const data = registerSchema.safeParse(values)

  if (!data.success) {
    return { error: "Invalid form data." }
  }

  return { success: "Email sent." }
}
