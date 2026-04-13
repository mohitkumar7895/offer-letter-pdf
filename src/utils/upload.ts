import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { UploadedFileMeta } from "@/types/employee";

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function saveUploadedFile(
  file: File,
  employeeId: string,
  field: string,
): Promise<UploadedFileMeta> {
  const uploadRoot = path.join(
    process.cwd(),
    "public",
    "uploads",
    "employees",
    employeeId,
  );
  await mkdir(uploadRoot, { recursive: true });

  const safeName = sanitizeFileName(file.name || "document.bin");
  const storedName = `${field}-${Date.now()}-${randomUUID()}-${safeName}`;
  const absolutePath = path.join(uploadRoot, storedName);

  const bytes = await file.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(bytes));

  return {
    fileName: storedName,
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    url: `/uploads/employees/${employeeId}/${storedName}`,
    uploadedAt: new Date().toISOString(),
  };
}
