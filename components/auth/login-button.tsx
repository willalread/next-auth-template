"use client"

import { useRouter } from "next/navigation"

interface LoginButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
}

export function LoginButton({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) {
  const router = useRouter()

  function handleLogin() {
    router.push("/auth/login")
  }

  if (mode === "modal") {
    return <span>TODO: Implement modal</span>
  }

  return (
    <span onClick={handleLogin} className="cursor-pointer">
      {children}
    </span>
  )
}
