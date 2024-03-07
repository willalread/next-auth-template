import { LuInfo } from "react-icons/lu"

import { currentUser } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UserInfoPage() {
  const user = await currentUser()

  return (
    <Card className="w-full max-w-[600px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LuInfo size={24} />
          <CardTitle>User Info</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoItem label="ID" value={user.id} />
        <InfoItem label="Name" value={user.name} />
        <InfoItem label="Email" value={user.email} />
        <InfoItem label="Role" value={user.role} />
        <InfoItem label="MFA">
          <Badge variant={user.isTwoFactorEnabled ? "success" : "destructive"}>
            {user.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </InfoItem>
      </CardContent>
    </Card>
  )
}

interface InfoItemProps {
  label: string
  value?: string | null
  children?: React.ReactNode
}

function InfoItem({ label, value, children }: InfoItemProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 overflow-hidden rounded-md border p-3 shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      {value && (
        <p className="truncate rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
          {value}
        </p>
      )}
      {children}
    </div>
  )
}
