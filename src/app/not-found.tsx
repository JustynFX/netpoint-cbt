import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-6xl font-extrabold text-emerald-500">404</p>
        <h1 className="mt-4 text-xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          The page you are looking for does not exist. Head back to the NetPoint CBT homepage
          for JAMB registration, printing, and digital services near UNIBEN.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
