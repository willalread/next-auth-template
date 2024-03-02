import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import { CardWrapper } from "@/components/auth/card-wrapper"

export default function AuthErrorPage() {
  return (
    <CardWrapper
      description="Oops! Something went wrong."
      backButton={{ href: "/auth/login", label: "Back to login" }}
    >
      <div className="flex justify-center">
        <ExclamationTriangleIcon className="h-8 w-8 text-destructive" />
      </div>
    </CardWrapper>
  )
}
