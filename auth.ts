import NextAuth from "next-auth"
import "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"

import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/lib/data/two-factor-confirmation"
import { getUserById } from "@/lib/data/user"

declare module "next-auth" {
  interface User {
    role: UserRole
    isTwoFactorEnabled: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    isTwoFactorEnabled: boolean
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true

      if (!user.id) return false

      const currentUser = await getUserById(user.id)

      // Prevent sign in without email verification
      if (!currentUser?.emailVerified) return false

      // Prevent sign in without 2FA verification
      if (currentUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          currentUser.id,
        )

        if (!twoFactorConfirmation) return false

        // Delete 2FA confirmation after successful sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
      }

      return session
    },
    async jwt({ token }) {
      if (token.sub) {
        const currentUser = await getUserById(token.sub)

        if (currentUser) {
          token.role = currentUser.role
          token.isTwoFactorEnabled = currentUser.isTwoFactorEnabled
        }
      }

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
