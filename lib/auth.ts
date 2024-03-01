import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { authConfig } from "@/lib/config/auth"
import { db } from "@/lib/db"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
