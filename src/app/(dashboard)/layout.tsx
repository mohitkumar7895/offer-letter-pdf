import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell";
import { getAuthFromCookies } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("ems-theme")?.value;
  const theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : "light";
  const auth = await getAuthFromCookies();

  return (
    <AppShell initialTheme={theme} userRole={auth?.role}>
      {children}
    </AppShell>
  );
}
