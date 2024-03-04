import { db } from "@/lib/db"

export async function getTwoFactorConfirmationByUserId(userId: string) {
  const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
    where: { userId },
  })

  return twoFactorConfirmation
}
