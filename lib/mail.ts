import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/confirm-email?token=${token}`

  await resend.emails.send({
    from: "mail@kratoform.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: "mail@kratoform.com",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  })
}
