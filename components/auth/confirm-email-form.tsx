"use client"

import { useSearchParams } from "next/navigation"
import { BeatLoader } from "react-spinners"

import { CardWrapper } from "@/components/auth/card-wrapper"

export function ConfirmEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  return (
    <CardWrapper
      description="Confirming your email"
      backButton={{
        href: "/auth/login",
        label: "Back to login",
      }}
    >
      <div className="flex items-center justify-center">
        <BeatLoader />
      </div>
    </CardWrapper>
  )
}
