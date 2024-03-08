import { LuKeyRound } from "react-icons/lu"

import { currentUser } from "@/lib/user"
import { AdminActions } from "@/components/auth/admin-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  const user = await currentUser()

  return (
    <Card className="w-full max-w-[600px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LuKeyRound size={24} />
          <CardTitle>Admin</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <AdminActions role={user.role} />
      </CardContent>
    </Card>
  )
}
