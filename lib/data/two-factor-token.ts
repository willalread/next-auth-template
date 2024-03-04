import crypto from "crypto"

import { db } from "@/lib/db"

export async function createTwoFactorToken(email: string) {
  const existingToken = await getTwoFactorTokenByEmail(email)

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

  return twoFactorToken
}

export async function getTwoFactorTokenByEmail(email: string) {
  const twoFactorToken = await db.twoFactorToken.findUnique({
    where: { email },
  })

  return twoFactorToken
}
