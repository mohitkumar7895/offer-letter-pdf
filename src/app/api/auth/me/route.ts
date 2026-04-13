import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  const cookieUser = await getAuthFromCookies();
  const user = cookieUser || {
    userId: "guest-user",
    email: "guest@local.dev",
    role: "Admin" as const,
  };

  return NextResponse.json({
    user: {
      id: user.userId,
      email: user.email,
      role: user.role,
    },
  });
}
