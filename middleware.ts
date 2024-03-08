import { auth as middleware } from "@/lib/auth"

const authRoutes = [
  "/auth/error",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
]

const publicRoutes = ["/", "/auth/verify-email"]

export default middleware((request) => {
  const { auth, nextUrl } = request
  const { pathname } = nextUrl

  if (pathname.startsWith("/api/auth")) return

  if (authRoutes.includes(pathname)) {
    if (!!auth) {
      return Response.redirect(new URL("/user-info", nextUrl))
    }
    return
  }

  if (!auth && !publicRoutes.includes(pathname)) {
    const url = new URL("/auth/login", nextUrl)
    url.searchParams.set("callbackUrl", pathname)

    return Response.redirect(url)
  }

  return
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
