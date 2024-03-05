import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

import { currentRole } from "@/lib/auth"

export async function GET() {
  const role = await currentRole()

  if (role === UserRole.ADMIN) {
    return NextResponse.json("Allowed API Route", { status: 200 })
  }

  return NextResponse.json("Forbidden API Route", { status: 403 })
}
