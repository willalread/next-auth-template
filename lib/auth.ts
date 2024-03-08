import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { db } from "@/lib/db"
import { loginSchema } from "@/lib/schemas"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      return session
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  pages: {
    error: "/auth/error",
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (credentials.code === "undefined") credentials.code = undefined

        const result = loginSchema.safeParse(credentials)
        if (!result.success) return null

        const { email, password, code } = result.data

        const user = await db.user.findUnique({ where: { email } })

        if (!user || !user.email || !user.emailVerified || !user.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) return null

        if (user.twoFactorEnabled) {
          const twoFactorToken = await db.twoFactorToken.findUnique({
            where: { email: user.email },
          })

          if (!twoFactorToken || twoFactorToken.token !== code) return null

          const hasExpired = new Date(twoFactorToken.expiresAt) < new Date()
          if (hasExpired) return null

          await db.twoFactorToken.delete({
            where: { id: twoFactorToken.id },
          })
        }

        return user
      },
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
