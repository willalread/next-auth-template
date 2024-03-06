import type { ExtendedUser } from "@/auth"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserInfoProps {
  label: string
  user?: ExtendedUser
}

export function UserInfo({ label, user }: UserInfoProps) {
  return (
    <Card className="w-full max-w-[600px] overflow-hidden shadow-md">
      <CardHeader className="items-center">
        <CardTitle className="text-2xl leading-normal tracking-normal">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoItem label="ID" value={user?.id} />
        <InfoItem label="Name" value={user?.name} />
        <InfoItem label="Email" value={user?.email} />
        <InfoItem label="Role" value={user?.role} />
        <InfoItem label="Two Factor Authentication">
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
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
    <div className="flex flex-row items-center justify-between gap-4 overflow-hidden rounded-lg border p-3 shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      {value && (
        <p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
          {value}
        </p>
      )}
      {children}
    </div>
  )
}
