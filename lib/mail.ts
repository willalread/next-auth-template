import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${domain}/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: "Security <security@kratoform.com>",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${domain}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: "Security <security@kratoform.com>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
  })
}

export async function sendTwoFactorTokenEmail(email: string, code: string) {
  await resend.emails.send({
    from: "Security <security@kratoform.com>",
    to: email,
    subject: "MFA Code",
    html: `<p>Your code is: <strong>${code}</strong></p>`,
  })
}
