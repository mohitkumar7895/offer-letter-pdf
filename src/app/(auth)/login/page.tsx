"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@local.dev");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-cyan-50 via-white to-amber-50 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-cyan-100 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Employee System Login
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Use admin credentials to access HR and employee modules.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-800"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-800"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-cyan-600 px-4 py-2.5 font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Default: admin@local.dev / Admin@123 (override with ADMIN_EMAIL and ADMIN_PASSWORD).
        </p>
      </form>
    </div>
  );
}
