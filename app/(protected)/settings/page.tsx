import { auth } from "@/auth"
import { LogoutButton } from "@/components/auth/logout-button"

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <LogoutButton />
    </div>
  )
}
