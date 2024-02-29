import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().trim().min(1, {
    message: "Password is required.",
  }),
  code: z.string().optional(),
})

export type LoginSchema = z.infer<typeof loginSchema>
