import { Suspense } from "react"
import Link from "next/link"
import { BsShieldLockFill } from "react-icons/bs"

import { SocialAuth } from "@/components/auth/social-auth"
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
        <Suspense>
          {children}
          {showSocials && <SocialAuth />}
        </Suspense>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" size="sm" asChild className="font-normal">
          <Link href={backButton.href}>{backButton.label}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
