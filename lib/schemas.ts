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

export const registerSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
