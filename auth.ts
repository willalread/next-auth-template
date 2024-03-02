import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"

import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { getUserById } from "@/lib/data/user"

declare module "next-auth" {
  interface User {
    role: UserRole
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ account, user }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true

      if (!user.id) return false

      const currentUser = await getUserById(user.id)

      // Prevent sign in without email verification
      if (!currentUser?.emailVerified) return false

      return true
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub
        if (token.role) session.user.role = token.role as UserRole
      }

      return session
    },
    async jwt({ token }) {
      if (token.sub) {
        const currentUser = await getUserById(token.sub)
        if (currentUser) token.role = currentUser.role
      }

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
