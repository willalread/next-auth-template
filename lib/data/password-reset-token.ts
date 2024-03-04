import { db } from "@/lib/db"

export async function createPasswordResetToken(email: string) {
  const existingToken = await getPasswordResetTokenByEmail(email)

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

  return passwordResetToken
}

export async function getPasswordResetTokenByEmail(email: string) {
  const passwordResetToken = await db.passwordResetToken.findUnique({
    where: { email },
  })

  return passwordResetToken
}

export async function getPasswordResetTokenByToken(token: string) {
  const passwordResetToken = await db.passwordResetToken.findUnique({
    where: { token },
  })

  return passwordResetToken
}
