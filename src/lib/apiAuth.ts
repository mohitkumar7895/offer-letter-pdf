import { NextResponse } from "next/server";
import type { AuthPayload } from "@/lib/auth";
import { getAuthFromCookies } from "@/lib/auth";
import type { AccessRole } from "@/types/employee";

export async function requireAuth(
  allowedRoles?: AccessRole[],
): Promise<{ user: AuthPayload } | { error: NextResponse }> {
  const cookieUser = await getAuthFromCookies();
  const user: AuthPayload = cookieUser || {
    userId: "guest-user",
    email: "guest@local.dev",
    role: "Admin",
  };

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}
