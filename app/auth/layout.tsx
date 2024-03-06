export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-full items-center justify-center p-4 sm:p-8">
      {children}
    </main>
  )
}
