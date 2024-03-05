"use client"

import { UserRole } from "@prisma/client"

import { useCurrentRole } from "@/lib/hooks/auth"
import { ErrorMessage } from "@/components/status-message"

interface RoleGateProps {
  allowedRole: UserRole
  children: React.ReactNode
}

export function RoleGate({ allowedRole, children }: RoleGateProps) {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    return (
      <ErrorMessage message="You are not authorized to view this content." />
    )
  }

  return <>{children}</>
}
