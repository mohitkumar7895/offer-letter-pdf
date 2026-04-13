"use client";

import { useEffect, useState, useCallback } from "react";
import type { Employee } from "@/types/employee";

type Props = {
  employee: Employee;
  onClose: () => void;
};

export default function EmployeeDetailModal({ employee, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {employee.employeeName}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {employee.designation} • {employee.accessRole}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-2xl"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Personal Information */}
          <Section title="Personal Information">
            <DetailGrid>
              <DetailItem label="Full Name" value={employee.employeeName} />
              <DetailItem label="Email" value={employee.email} />
              <DetailItem label="Mobile Number" value={employee.mobileNumber} />
              <DetailItem label="Alternate Number" value={employee.alternateNumber || "—"} />
              <DetailItem label="Designation" value={employee.designation} />
              <DetailItem label="Role" value={employee.role} />
              <DetailItem label="Access Role" value={employee.accessRole} />
            </DetailGrid>
          </Section>

          {/* Address Information */}
          <Section title="Address Details">
            <DetailGrid>
              <DetailItem
                label="Current Address"
                value={employee.address.currentAddress}
                span="full"
              />
              <DetailItem
                label="Permanent Address"
                value={employee.address.permanentAddress}
                span="full"
              />
              <DetailItem
                label="Working Location"
                value={employee.address.workingLocation}
              />
            </DetailGrid>
          </Section>

          {/* Account Details */}
          <Section title="Bank Account Details">
            <DetailGrid>
              <DetailItem
                label="Account Holder Name"
                value={employee.accountDetails.accountHolderName}
              />
              <DetailItem
                label="Account Number"
                value={employee.accountDetails.accountNumber}
              />
              <DetailItem label="IFSC Code" value={employee.accountDetails.ifscCode} />
              <DetailItem label="Bank Name" value={employee.accountDetails.bankName} />
              <DetailItem label="UPI ID" value={employee.accountDetails.upiId || "—"} />
              <DetailItem
                label="UPI Holder Name"
                value={employee.accountDetails.upiHolderName || "—"}
              />
            </DetailGrid>
          </Section>

          {/* Document Information */}
          <Section title="Documents & Identification">
            <DetailGrid>
              <DetailItem label="Aadhar Number" value={employee.documents.aadharNumber} />
              {employee.documents.aadharFile && (
                <DocumentItem
                  label="Aadhar File"
                  file={employee.documents.aadharFile}
                />
              )}
              <DetailItem label="PAN Number" value={employee.documents.panNumber || "—"} />
              {employee.documents.panCardFile && (
                <DocumentItem
                  label="PAN Card File"
                  file={employee.documents.panCardFile}
                />
              )}
              {employee.documents.passportPhoto && (
                <DocumentItem
                  label="Passport Photo"
                  file={employee.documents.passportPhoto}
                />
              )}
              {employee.documents.passbookFile && (
                <DocumentItem
                  label="Passbook"
                  file={employee.documents.passbookFile}
                />
              )}
              {employee.documents.experienceLetter && (
                <DocumentItem
                  label="Experience Letter"
                  file={employee.documents.experienceLetter}
                />
              )}
              {employee.documents.academicDocuments &&
                employee.documents.academicDocuments.length > 0 && (
                  <div className="col-span-full">
                    <p className="mb-2 font-semibold text-slate-700 dark:text-slate-200">
                      Academic Documents
                    </p>
                    <div className="space-y-2">
                      {employee.documents.academicDocuments.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📄</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                {doc.originalName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 rounded-lg p-2 hover:bg-cyan-100 dark:hover:bg-slate-700 text-lg"
                            title="Download"
                          >
                            ⬇️
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </DetailGrid>
          </Section>

          {/* Manager Information */}
          {/* {employee.reporting && (
            <Section title="Reporting Structure">
              <DetailGrid>
                <DetailItem
                  label="Reports To"
                  value={employee.reporting.managerName || "—"}
                />
                <DetailItem
                  label="Manager Role"
                  value={employee.reporting.managerRole || "—"}
                />
              </DetailGrid>
            </Section>
          )} */}

          {/* Metadata */}
          <Section title="Record Information">
            <DetailGrid>
              <DetailItem
                label="Created"
                value={formatDate(employee.createdAt)}
              />
              <DetailItem
                label="Updated"
                value={formatDate(employee.updatedAt)}
              />
            </DetailGrid>
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
          <button
            onClick={handleClose}
            className="w-full rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-200 pb-6 dark:border-slate-700 last:border-0 last:pb-0">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      {children}
    </div>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
  span?: "half" | "full";
};

function DetailItem({ label, value, span = "half" }: DetailItemProps) {
  const colSpan = span === "full" ? "sm:col-span-2" : "";
  return (
    <div className={colSpan}>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

type DocumentItemProps = {
  label: string;
  file: {
    originalName: string;
    url: string;
    size: number;
    uploadedAt: string | Date;
  };
};

function DocumentItem({ label, file }: DocumentItemProps) {
  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="flex-shrink-0 text-lg">📄</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
              {file.originalName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
            </p>
          </div>
        </div>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 flex-shrink-0 rounded-lg p-2 hover:bg-cyan-100 dark:hover:bg-slate-700 text-lg"
          title="Download"
        >
          ⬇️
        </a>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
