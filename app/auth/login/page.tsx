import { CardWrapper } from "@/components/auth/card-wrapper"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <CardWrapper
      description="Welcome back"
      backButton={{
        href: "/auth/register",
        label: "Don't have an account?",
      }}
      showSocials
    >
      <LoginForm />
    </CardWrapper>
  )
}
