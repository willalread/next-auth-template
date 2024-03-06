"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { BsShieldLockFill } from "react-icons/bs"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card"

interface CardWrapperProps {
  description: string
  backButton: {
    href: string
    label: string
  }
  showSocials?: boolean
  children: React.ReactNode
}

export function CardWrapper({
  description,
  backButton,
  showSocials,
  children,
}: CardWrapperProps) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  function handleSocialAuth(provider: "google" | "github") {
    signIn(provider, { callbackUrl: callbackUrl || "/server" })
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <Link href="/" className="flex items-center gap-2">
          <BsShieldLockFill size={30} />
          <h1 className="text-3xl font-semibold">Auth</h1>
        </Link>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        {showSocials && (
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
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" size="sm" asChild className="font-normal">
          <Link href={backButton.href}>{backButton.label}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
