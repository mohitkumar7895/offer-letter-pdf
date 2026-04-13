"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";

type EmployeeResponse = { item?: Employee; error?: string };

export default function EmployeeViewPage() {
  const params = useParams();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/employees/${employeeId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load employee");
        }

        const data = (await res.json()) as EmployeeResponse;
        setEmployee(data.item || null);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error loading employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <p className="text-red-700 dark:text-red-300">{error || "Employee not found"}</p>
          <Link
            href="/employees"
            className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Back to Employees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {employee.employeeName}
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {employee.designation} • {employee.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/employees/${employeeId}/edit`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Edit
              </Link>
              <Link
                href="/employees"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              >
                Back
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Role
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {employee.role}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Access
              </p>
              <span className="mt-1 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                {employee.accessRole}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Mobile
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {employee.mobileNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <Section title="Contact Information">
          <Grid>
            <Field label="Email" value={employee.email} />
            <Field label="Mobile" value={employee.mobileNumber} />
            <Field
              label="Alternate Mobile"
              value={employee.alternateNumber || "—"}
            />
          </Grid>
        </Section>

        {/* Address Information */}
        <Section title="Address Information">
          <Grid>
            <Field
              label="Current Address"
              value={employee.address.currentAddress}
              span="full"
            />
            <Field
              label="Permanent Address"
              value={employee.address.permanentAddress}
              span="full"
            />
            <Field
              label="Working Location"
              value={employee.address.workingLocation}
            />
          </Grid>
        </Section>

        {/* Bank Details */}
        <Section title="Bank Account Details">
          <Grid>
            <Field
              label="Account Holder Name"
              value={employee.accountDetails.accountHolderName}
            />
            <Field
              label="Account Number"
              value={maskAccountNumber(employee.accountDetails.accountNumber)}
            />
            <Field label="IFSC Code" value={employee.accountDetails.ifscCode} />
            <Field label="Bank Name" value={employee.accountDetails.bankName} />
            <Field
              label="UPI ID"
              value={employee.accountDetails.upiId || "—"}
            />
            <Field
              label="UPI Holder Name"
              value={employee.accountDetails.upiHolderName || "—"}
            />
          </Grid>
        </Section>

        {/* Documents */}
        <Section title="Documents & Identification">
          <Grid>
            <Field
              label="Aadhar Number"
              value={maskAadhar(employee.documents.aadharNumber)}
            />
            {employee.documents.aadharFile && (
              <DocumentLink
                label="Aadhar File"
                file={employee.documents.aadharFile}
              />
            )}

            <Field
              label="PAN Number"
              value={employee.documents.panNumber
                ? maskPAN(employee.documents.panNumber)
                : "—"}
            />
            {employee.documents.panCardFile && (
              <DocumentLink
                label="PAN Card File"
                file={employee.documents.panCardFile}
              />
            )}

            {employee.documents.passportPhoto && (
              <DocumentLink
                label="Passport Photo"
                file={employee.documents.passportPhoto}
              />
            )}

            {employee.documents.passbookFile && (
              <DocumentLink
                label="Passbook"
                file={employee.documents.passbookFile}
              />
            )}

            {employee.documents.experienceLetter && (
              <DocumentLink
                label="Experience Letter"
                file={employee.documents.experienceLetter}
              />
            )}
          </Grid>

          {employee.documents.academicDocuments &&
            employee.documents.academicDocuments.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                  Academic Documents ({employee.documents.academicDocuments.length})
                </h4>
                <div className="space-y-2">
                  {employee.documents.academicDocuments.map((doc, idx) => (
                    <DocumentRow key={idx} file={doc} />
                  ))}
                </div>
              </div>
            )}
        </Section>

        {/* Metadata */}
        <Section title="Record Information">
          <Grid>
            <Field label="Created" value={formatDate(employee.createdAt)} />
            <Field label="Last Updated" value={formatDate(employee.updatedAt)} />
          </Grid>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2">{children}</div>;
}

type FieldProps = {
  label: string;
  value: string;
  span?: "half" | "full";
};

function Field({ label, value, span = "half" }: FieldProps) {
  const colSpan = span === "full" ? "sm:col-span-2" : "";
  return (
    <div className={colSpan}>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

type DocumentLinkProps = {
  label: string;
  file: {
    originalName: string;
    url: string;
    size: number;
  };
};

function DocumentLink({ label, file }: DocumentLinkProps) {
  return (
    <div className="sm:col-span-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
        {label}
      </p>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-300 dark:hover:bg-cyan-950/50"
      >
        📄 {file.originalName}
        <span className="text-xs text-cyan-600 dark:text-cyan-400">
          ({formatFileSize(file.size)})
        </span>
      </a>
    </div>
  );
}

function DocumentRow({
  file,
}: {
  file: {
    originalName: string;
    url: string;
    size: number;
    uploadedAt: string | Date;
  };
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
          📄 {file.originalName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
        </p>
      </div>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-3 flex-shrink-0 rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
        title="Download"
      >
        ⬇️
      </a>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
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

function maskAadhar(aadhar: string): string {
  return aadhar.slice(-4).padStart(12, "*");
}

function maskPAN(pan: string): string {
  return pan.slice(-4).padStart(10, "*");
}

function maskAccountNumber(account: string): string {
  return account.slice(-4).padStart(account.length, "*");
}
