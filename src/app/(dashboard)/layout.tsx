import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("ems-theme")?.value;
  const theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : "light";

  return <AppShell initialTheme={theme}>{children}</AppShell>;
}
