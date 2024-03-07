"use client"

import { UserRole } from "@prisma/client"
import { toast } from "sonner"

import { admin } from "@/lib/actions/admin"
import { ErrorMessage, SuccessMessage } from "@/components/status-message"
import { Button } from "@/components/ui/button"

export function AdminActions({ role }: { role: UserRole }) {
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
    <div className="space-y-4">
      {role === "ADMIN" ? (
        <SuccessMessage message="You are authorized to view this content." />
      ) : (
        <ErrorMessage message="You are not authorized to view this content." />
      )}
      <ActionItem label="Admin-only API Route" onClick={handleApiRoute} />
      <ActionItem
        label="Admin-only Server Action"
        onClick={handleServerAction}
      />
    </div>
  )
}

interface ActionItemProps {
  label: string
  onClick: () => void
}

function ActionItem({ label, onClick }: ActionItemProps) {
  return (
    <div className="flex flex-row items-center justify-between overflow-hidden rounded-md border p-3 shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      <Button onClick={onClick}>Click to test</Button>
    </div>
  )
}
