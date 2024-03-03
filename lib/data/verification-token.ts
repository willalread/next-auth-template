import { db } from "@/lib/db"

export async function createVerificationToken(email: string) {
  const existingToken = await getVerificationTokenByEmail(email)

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

  return verificationToken
}

export async function getVerificationTokenByEmail(email: string) {
  const verificationToken = await db.verificationToken.findUnique({
    where: { email },
  })

  return verificationToken
}

export async function getVerificationTokenByToken(token: string) {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  })

  return verificationToken
}
