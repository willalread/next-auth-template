import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"

import "./globals.css"
import { auth } from "@/auth"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next Auth Template",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 sm:p-8">
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  )
}
