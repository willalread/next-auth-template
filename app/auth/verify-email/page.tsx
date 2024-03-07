import { CardWrapper } from "@/components/auth/card-wrapper"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"

export default function VerifyEmailPage() {
  return (
    <CardWrapper
      description="Verifying your email"
      backButton={{
        href: "/auth/login",
        label: "Back to login",
      }}
    >
      <VerifyEmailForm />
    </CardWrapper>
  )
}
