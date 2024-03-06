import { db } from "@/lib/db"

export async function getAccountByUserId(userId: string) {
  const account = await db.account.findFirst({
    where: { userId },
  })

  return account
}
