"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Flame,
  Inbox,
  Lock,
  LogOut,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { EnquiryRecord } from "@/lib/sheets-csv";
import type { TriageLabel } from "@/lib/triage";

type FilterLabel = "ALL" | TriageLabel;

interface AdminDashboardProps {
  initialAuthenticated: boolean;
}

function LabelBadge({ label }: { label: TriageLabel }) {
  const classes =
    label === "HOT"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : label === "CHECK"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide ${classes}`}
    >
      {label}
    </span>
  );
}

export function AdminDashboard({ initialAuthenticated }: AdminDashboardProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [pin, setPin] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [dataMode, setDataMode] = useState<"live" | "demo">("live");
  const [warning, setWarning] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [labelFilter, setLabelFilter] = useState<FilterLabel>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadEnquiries = useCallback(async () => {
    setLoadingData(true);
    setFetchError(null);
    try {
      const response = await fetch("/api/admin/enquiries", {
        cache: "no-store",
      });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = (await response.json()) as {
        ok: boolean;
        mode?: "live" | "demo";
        warning?: string | null;
        enquiries?: EnquiryRecord[];
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setFetchError(data.error || "Unable to load enquiries.");
        return;
      }
      setDataMode(data.mode ?? "live");
      setWarning(data.warning ?? null);
      setEnquiries(data.enquiries ?? []);
    } catch {
      setFetchError("Network error while fetching enquiries.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      void loadEnquiries();
    }
  }, [authenticated, loadEnquiries]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setAuthError(data.error || "Authentication failed.");
        return;
      }
      setPin("");
      setAuthenticated(true);
    } catch {
      setAuthError("Network error while verifying PIN.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setEnquiries([]);
  };

  const counts = useMemo(() => {
    let hot = 0;
    let warm = 0;
    let check = 0;
    for (const row of enquiries) {
      if (row.label === "HOT") hot++;
      else if (row.label === "CHECK") check++;
      else warm++;
    }
    return { total: enquiries.length, hot, warm, check };
  }, [enquiries]);

  const serviceBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of enquiries) {
      const key = row.service || "General Enquiry";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const maxCount = entries[0]?.[1] ?? 1;
    return entries.map(([service, count]) => ({
      service,
      count,
      percent: Math.round((count / Math.max(enquiries.length, 1)) * 100),
      barWidth: Math.round((count / maxCount) * 100),
    }));
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enquiries.filter((row) => {
      if (labelFilter !== "ALL" && row.label !== labelFilter) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.message.toLowerCase().includes(q) ||
        row.service.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.phone.toLowerCase().includes(q)
      );
    });
  }, [enquiries, labelFilter, searchQuery]);

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-emerald-400">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                NetPoint CBT Owner Portal
              </h1>
              <p className="text-xs text-slate-500">
                Mr. Edosa Ekhator &bull; Ugbowo, Benin City
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700"
              >
                {authError}
              </div>
            )}

            <div>
              <label
                htmlFor="owner-pin"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700"
              >
                Owner PIN
              </label>
              <input
                id="owner-pin"
                type="password"
                inputMode="numeric"
                autoFocus
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your Owner PIN"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base tracking-widest text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-60 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {authLoading ? "Verifying PIN..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Back to public website"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold sm:text-lg">
                  NetPoint CBT Admin
                </h1>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    dataMode === "live"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {dataMode === "live" ? "Live Sheet" : "Preview Mode"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enquiry Triage &amp; Lead Tracker &bull; Ugbowo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadEnquiries()}
              disabled={loadingData}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6 lg:px-8">
        {warning && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <span>{warning}</span>
          </div>
        )}

        {fetchError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800"
          >
            {fetchError}
          </div>
        )}

        {/* 4 KPI Summary Cards */}
        <section aria-label="Enquiry KPIs" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Enquiries
              </span>
              <Inbox className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {counts.total}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                HOT Leads
              </span>
              <Flame className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-600 sm:text-3xl">
              {counts.hot}
            </p>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-sky-700">
                WARM Leads
              </span>
              <Sparkles className="h-4 w-4 text-sky-500" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-sky-600 sm:text-3xl">
              {counts.warm}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-amber-800">
                CHECK Escalations
              </span>
              <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-600 sm:text-3xl">
              {counts.check}
            </p>
          </div>
        </section>

        {/* Service Breakdown Bar Visualization */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
              Service Breakdown
            </h2>
          </div>

          {serviceBreakdown.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No enquiries recorded yet.</p>
          ) : (
            <div className="mt-4 space-y-3.5">
              {serviceBreakdown.map((item) => (
                <div key={item.service}>
                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="truncate font-semibold text-slate-800">
                      {item.service}
                    </span>
                    <span className="shrink-0 font-bold text-slate-600">
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${item.barWidth}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest Enquiries Filter, Search & Table */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                <MessageSquare className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                Latest Enquiries
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Showing {filteredEnquiries.length} of {enquiries.length} enquiries
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by label">
                {(["ALL", "HOT", "WARM", "CHECK"] as FilterLabel[]).map((item) => {
                  const active = labelFilter === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLabelFilter(item)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {item === "ALL" ? "All" : item}
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or message..."
                  aria-label="Search enquiries by name or message"
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:w-60"
                />
              </div>
            </div>
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No enquiries match the current filter or search query.
            </div>
          ) : (
            <>
              {/* Mobile Cards (< md) */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredEnquiries.map((row) => (
                  <article key={row.id} className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{row.name}</h3>
                        <p className="text-[11px] text-slate-500">{row.timestamp}</p>
                      </div>
                      <LabelBadge label={row.label} />
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">{row.service}</p>
                    <p className="text-xs leading-relaxed text-slate-700">{row.message}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-500">
                      <span>{row.email}</span>
                      <span>{row.phone}</span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Desktop Table (>= md) */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3.5">Time</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5">Service</th>
                      <th className="px-5 py-3.5">Message</th>
                      <th className="px-5 py-3.5">Label</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEnquiries.map((row) => (
                      <tr key={row.id} className="align-top hover:bg-slate-50/70">
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                          {row.timestamp}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{row.name}</div>
                          <div className="text-xs text-slate-500">{row.email}</div>
                          <div className="text-xs text-slate-500">{row.phone}</div>
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                          {row.service}
                        </td>
                        <td className="max-w-md px-5 py-4 text-xs leading-relaxed text-slate-700">
                          {row.message}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <LabelBadge label={row.label} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
