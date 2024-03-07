import { CardWrapper } from "@/components/auth/card-wrapper"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <CardWrapper
      description="Create an account"
      backButton={{
        href: "/auth/login",
        label: "Already have an account?",
      }}
      showSocials
    >
      <RegisterForm />
    </CardWrapper>
  )
}
