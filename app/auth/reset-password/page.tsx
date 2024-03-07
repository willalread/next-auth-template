import { CardWrapper } from "@/components/auth/card-wrapper"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <CardWrapper
      description="Reset your password"
      backButton={{
        href: "/auth/login",
        label: "Back to login",
      }}
    >
      <ResetPasswordForm />
    </CardWrapper>
  )
}
