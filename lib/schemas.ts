import { UserRole } from "@prisma/client"
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().trim().min(1, {
    message: "Password is required.",
  }),
  code: z
    .string()
    .trim()
    .length(6, {
      message: "Code must be 6 characters.",
    })
    .optional(),
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

export const resetPasswordSchema = z.object({
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export const settingsSchema = z
  .object({
    role: z.nativeEnum(UserRole),
    name: z.string().trim().min(1, {
      message: "Name is required.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z
      .string()
      .trim()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .optional(),
    newPassword: z
      .string()
      .trim()
      .min(8, {
        message: "New password must be at least 8 characters.",
      })
      .optional(),
    twoFactorEnabled: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false
      }

      return true
    },
    {
      message: "Password is required.",
      path: ["password"],
    },
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: "New password is required.",
      path: ["newPassword"],
    },
  )

export type SettingsSchema = z.infer<typeof settingsSchema>
