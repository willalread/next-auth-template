"use client"

import { CardWrapper } from "@/components/auth/card-wrapper"

export function LoginForm() {
  return (
    <CardWrapper
      description="Welcome back"
      backButton={{
        href: "/auth/register",
        label: "Don't have an account?",
      }}
      showSocials
    >
      <h1>Login Form</h1>
    </CardWrapper>
  )
}
