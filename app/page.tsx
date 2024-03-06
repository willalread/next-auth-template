import Link from "next/link"
import { BsShieldLockFill } from "react-icons/bs"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-6 p-4 sm:p-8">
      <div className="flex items-center gap-2">
        <BsShieldLockFill size={50} />
        <h1 className="text-6xl font-semibold drop-shadow-md">Auth</h1>
      </div>
      <Button variant="secondary" size="lg" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
    </main>
  )
}
