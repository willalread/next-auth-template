"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { BeatLoader } from "react-spinners"

import { confirmEmail } from "@/lib/actions/confirm-email"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-status"

export function ConfirmEmailForm() {
  const [error, setError] = useState<string | undefined>()

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleConfirmEmail = useCallback(() => {
    if (!token) {
      setError("Missing token.")
      return
    }

    confirmEmail(token)
      .then((result) => {
        if (result.success) {
          router.push("/auth/login")
        } else {
          setError(result.error)
        }
      })
      .catch(() => {
        setError("Something went wrong.")
      })
  }, [token, router])

  useEffect(() => {
    handleConfirmEmail()
  }, [handleConfirmEmail])

  return (
    <CardWrapper
      description="Confirming your email"
      backButton={{
        href: "/auth/login",
        label: "Back to login",
      }}
    >
      <div className="flex justify-center">
        {error ? <FormError message={error} /> : <BeatLoader />}
      </div>
    </CardWrapper>
  )
}
