import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

import { currentUser } from "@/lib/user"

export async function GET() {
  const { role } = await currentUser()

  if (role === UserRole.ADMIN) {
    return NextResponse.json("Allowed API Route", { status: 200 })
  }

  return NextResponse.json("Forbidden API Route", { status: 403 })
}
