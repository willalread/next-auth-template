"use client"

import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

import { Button } from "@/components/ui/button"

export function SocialAuth() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  function handleSocialAuth(provider: "google" | "github") {
    signIn(provider, { callbackUrl: callbackUrl || "/user-info" })
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => handleSocialAuth("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => handleSocialAuth("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  )
}
