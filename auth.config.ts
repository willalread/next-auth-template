import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { getUserByEmail } from "@/lib/data/user"
import { loginSchema } from "@/lib/schemas"

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials)

        if (result.success) {
          const { email, password } = result.data

          const user = await getUserByEmail(email)

          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) return user
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
