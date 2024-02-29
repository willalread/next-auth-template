import { LoginButton } from "@/components/auth/login-button"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-6xl font-semibold text-white drop-shadow-md">
        🔐 Auth
      </h1>
      <div>
        <LoginButton asChild>
          <Button variant="secondary" size="lg">
            Sign in
          </Button>
        </LoginButton>
      </div>
    </div>
  )
}
