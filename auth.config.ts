import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { loginSchema } from "@/lib/schemas"
import { getUserByEmail } from "@/lib/data/user"

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials)

        if (result.success) {
          const { email, password } = result.data

          const user = await getUserByEmail(email)
          if (!user?.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
        }

        return null
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
} satisfies NextAuthConfig
