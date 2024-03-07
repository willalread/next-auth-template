import { currentUser } from "@/lib/auth"
import { Navbar } from "@/components/navbar"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  return (
    <main className="flex flex-col items-center gap-4 p-4 sm:p-8">
      <Navbar user={user} />
      {children}
    </main>
  )
}
