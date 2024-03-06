"use client"

import { LuKeyRound } from "react-icons/lu"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

import { admin } from "@/lib/actions/admin"
import { SuccessMessage } from "@/components/status-message"
import { RoleGate } from "@/components/auth/role-gate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  async function handleApiRoute() {
    const response = await fetch("/api/admin")
    const data = await response.json()

    if (response.ok) {
      toast.success(data)
    } else {
      toast.error(data)
    }
  }

  async function handleServerAction() {
    const data = await admin()

    if (data.success) {
      toast.success(data.success)
    }

    if (data.error) {
      toast.error(data.error)
    }
  }

  return (
    <Card className="w-full max-w-[600px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LuKeyRound size={24} />
          <CardTitle>Admin</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <SuccessMessage message="You are authorized to view this content." />
        </RoleGate>
        <ContentItem label="Admin-only API Route" onClick={handleApiRoute} />
        <ContentItem
          label="Admin-only Server Action"
          onClick={handleServerAction}
        />
      </CardContent>
    </Card>
  )
}

interface ContentItemProps {
  label: string
  onClick: () => void
}

function ContentItem({ label, onClick }: ContentItemProps) {
  return (
    <div className="flex flex-row items-center justify-between overflow-hidden rounded-md border p-3 shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      <Button onClick={onClick}>Click to test</Button>
    </div>
  )
}
