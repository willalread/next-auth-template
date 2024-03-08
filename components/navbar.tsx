"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { User } from "@/lib/user"
import { UserButton } from "@/components/auth/user-button"
import { Button } from "@/components/ui/button"

export function Navbar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <nav className="flex w-full max-w-[600px] items-center justify-between gap-2 overflow-hidden rounded-lg bg-secondary p-4 shadow-md">
      <div className="flex gap-2">
        <Button
          asChild
          variant={pathname === "/user-info" ? "default" : "outline"}
        >
          <Link href="/user-info">User Info</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton user={user} />
    </nav>
  )
}
