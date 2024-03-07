import { CardWrapper } from "@/components/auth/card-wrapper"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <CardWrapper
      description="Forgot your password?"
      backButton={{
        href: "/auth/login",
        label: "Back to login",
      }}
    >
      <ForgotPasswordForm />
    </CardWrapper>
  )
}
