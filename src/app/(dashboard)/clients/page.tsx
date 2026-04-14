import connectDB, { getMongoIssue } from "@/lib/mongodb";
import Client from "@/models/Client";
import ClientManagementClient from "@/components/ClientManagementClient";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  let initialClients = [];
  let error: string | null = null;

  try {
    await connectDB();
    const rows = await Client.find().sort({ createdAt: -1 }).lean();
    
    // Normalize data for client component
    initialClients = rows.map((r: any) => ({
      ...r,
      _id: String(r._id),
      createdAt: r.createdAt ? r.createdAt.toISOString() : undefined,
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
    }));
  } catch (cause) {
    error = getMongoIssue(cause).message;
  }

  return (
    <div className="min-h-screen flex-1 px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-7 xl:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_15%_10%,rgba(14,165,233,0.16),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.14),transparent_38%)]"
            aria-hidden
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                Administration
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Client Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Manage your client accounts and their associated domain/hosting details.
              </p>
            </div>
          </div>
        </header>

        <ClientManagementClient 
          initialClients={initialClients} 
          serverError={error} 
        />
      </div>
    </div>
  );
}
