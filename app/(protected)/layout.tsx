import { Navbar } from "@/components/navbar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex flex-col items-center gap-4 p-4 sm:p-8">
      <Navbar />
      {children}
    </main>
  )
}
