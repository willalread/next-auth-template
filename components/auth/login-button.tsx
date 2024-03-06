"use client"

import { useRouter } from "next/navigation"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"

interface LoginButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
}

export function LoginButton({ children, mode = "redirect" }: LoginButtonProps) {
  const router = useRouter()

  function handleLogin() {
    router.push("/auth/login")
  }

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[400px] border-none bg-transparent p-0">
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span onClick={handleLogin} className="cursor-pointer">
      {children}
    </span>
  )
}
