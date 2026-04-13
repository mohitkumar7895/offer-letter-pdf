import { getAuthFromCookies } from "@/lib/auth";
import { PdfEditorShell } from "@/components/PdfEditorShell";

export default async function OfferLetterPage() {
  const user = await getAuthFromCookies();
  return <PdfEditorShell userRole={user?.role ?? null} />;
}
