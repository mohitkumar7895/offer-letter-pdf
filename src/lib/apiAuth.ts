import { NextResponse } from "next/server";
import type { AuthPayload } from "@/lib/auth";
import { getAuthFromCookies } from "@/lib/auth";
import type { AccessRole } from "@/types/employee";

export async function requireAuth(
  allowedRoles?: AccessRole[],
): Promise<{ user: AuthPayload } | { error: NextResponse }> {
  const user = await getAuthFromCookies();
  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}
