"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X, Send, CheckCircle2, ShieldAlert, Loader2, AlertCircle } from "lucide-react";
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/lib/constants";

interface EnquiryModalProps {
  isOpen: boolean;
  initialService?: ServiceCategory;
  onClose: () => void;
}

interface EnquiryResponsePayload {
  ok: boolean;
  label?: "HOT" | "WARM" | "CHECK";
  summary?: string;
  timestamp?: string;
  error?: string;
}

export function EnquiryModal({ isOpen, initialService, onClose }: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<ServiceCategory>(
    initialService ?? SERVICE_CATEGORIES[0]
  );
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<EnquiryResponsePayload | null>(null);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleResetAndClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setResult(null);
    setErrorMessage(null);
    setSubmitting(false);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          message,
        }),
      });

      const data = (await response.json()) as EnquiryResponsePayload;

      if (!response.ok || !data.ok) {
        setErrorMessage(
          data.error || "Unable to submit your enquiry right now. Please check your details."
        );
        return;
      }

      setResult(data);
    } catch {
      setErrorMessage(
        "Network error while sending your enquiry. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const labelBadgeStyle =
    result?.label === "HOT"
      ? "bg-emerald-100 text-emerald-800"
      : result?.label === "CHECK"
        ? "bg-amber-100 text-amber-800"
        : "bg-sky-100 text-sky-800";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      onClick={handleResetAndClose}
    >
      <div
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              NetPoint CBT &bull; Ugbowo
            </span>
            <h2
              id="enquiry-modal-title"
              className="mt-1.5 text-xl font-extrabold text-slate-900"
            >
              Enquire or Book a Slot
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Tell us what you need and our team will prepare your slot or answer promptly.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            aria-label="Close enquiry modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {result ? (
          <div className="py-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>

            {result.label && (
              <span
                className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide ${labelBadgeStyle}`}
              >
                Status: {result.label}
              </span>
            )}

            <h3 className="mt-3 text-lg font-bold text-slate-900">
              Enquiry Submitted Successfully
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Thank you, <span className="font-semibold text-slate-900">{name}</span>.{" "}
              {result.summary}
            </p>
            {result.timestamp && (
              <p className="mt-2 text-xs text-slate-400">Logged at {result.timestamp} (WAT)</p>
            )}
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="enquiry-name"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="enquiry-name"
                type="text"
                required
                disabled={submitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Osasere Omoregie"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="enquiry-email"
                  className="block text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="enquiry-email"
                  type="email"
                  required
                  disabled={submitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="enquiry-phone"
                  className="block text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  Phone (Optional)
                </label>
                <input
                  id="enquiry-phone"
                  type="tel"
                  disabled={submitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0803 000 0000"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="enquiry-service"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700"
              >
                Service Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="enquiry-service"
                disabled={submitting}
                value={service}
                onChange={(e) => setService(e.target.value as ServiceCategory)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              >
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="enquiry-message"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700"
              >
                Message / Preferred Time <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="enquiry-message"
                required
                disabled={submitting}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us when you plan to visit (e.g., tomorrow 9 AM for JAMB registration), document details, or any profile code issue..."
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              />
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span>
                We assist strictly with legitimate registration, printing, and portal steps.
                Official exam results and admissions are determined solely by JAMB/UNIBEN.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending Enquiry...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Submit Enquiry
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
