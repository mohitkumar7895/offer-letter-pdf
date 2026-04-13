import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.userId,
      email: user.email,
      role: user.role,
    },
  });
}
