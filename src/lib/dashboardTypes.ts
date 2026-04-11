import type { DocumentKind } from "./formTypes";

export type DashboardItemStorage = "remote" | "local";

export type DashboardItem = {
  id: string;
  title: string;
  documentKind: DocumentKind;
  storage: DashboardItemStorage;
  refNo?: string;
  name?: string;
  createdAt: string;
  mailSentAt?: string;
  mailError?: string;
  lastMailTo?: string;
};

export type LocalDashboardItem = DashboardItem & {
  storage: "local";
  pdfBase64: string;
};

export function isLocalDashboardItem(
  item: DashboardItem,
): item is LocalDashboardItem {
  return item.storage === "local";
}
