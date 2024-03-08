import crypto from "crypto"
import { Resend } from "resend"

import { db } from "@/lib/db"

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXT_PUBLIC_APP_URL

export async function sendVerificationEmail(email: string) {
  const existingToken = await db.verificationToken.findUnique({
    where: { email },
  })

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  const link = `${domain}/auth/verify-email?token=${verificationToken.token}`

  await resend.emails.send({
    from: "Security <security@kratoform.com>",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
  })
}

export async function sendPasswordResetEmail(email: string) {
  const existingToken = await db.passwordResetToken.findUnique({
    where: { email },
  })

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  const link = `${domain}/auth/reset-password?token=${passwordResetToken.token}`

  await resend.emails.send({
    from: "Security <security@kratoform.com>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
  })
}

export async function sendTwoFactorTokenEmail(email: string) {
  const existingToken = await db.twoFactorToken.findUnique({
    where: { email },
  })

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 5) // 5 minutes

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  const code = twoFactorToken.token

  await resend.emails.send({
    from: "Security <security@kratoform.com>",
    to: email,
    subject: "MFA Code",
    html: `<p>Your code is: <strong>${code}</strong></p>`,
  })
}
