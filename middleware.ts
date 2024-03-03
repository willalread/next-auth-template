import NextAuth from "next-auth"

import authConfig from "@/auth.config"

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  if (nextUrl.pathname.startsWith("/api/auth")) {
    return
  }

  const isAuthRoute = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/forgot-password",
    "/auth/reset-password",
  ].includes(nextUrl.pathname)

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/settings", nextUrl))
    }
    return
  }

  const isPublicRoute = ["/", "/auth/confirm-email"].includes(nextUrl.pathname)

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl))
  }

  return
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
