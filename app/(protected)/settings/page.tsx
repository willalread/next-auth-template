import { currentUser } from "@/lib/auth"
import { SettingsForm } from "@/components/auth/settings-form"

export default async function SettingsPage() {
  const user = await currentUser()

  return <SettingsForm user={user} />
}
