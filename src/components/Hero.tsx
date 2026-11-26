"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, MapPin, ShieldCheck } from "lucide-react";

interface HeroProps {
  onOpenEnquiry: () => void;
}

export function Hero({ onOpenEnquiry }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Subtle geometric background accents */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
        {/* Left Copy */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-300">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Ugbowo, near UNIBEN Main Gate &bull; Benin City
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Fast, Stress-Free JAMB Registration, Printing &amp; Digital Services Near UNIBEN
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Skip unnecessary queues at the gate. NetPoint CBT &amp; Cyber Café helps UNIBEN
            students, UTME candidates, and Benin City residents complete registrations,
            high-speed printing, and portal uploads with accuracy and speed.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer"
            >
              Enquire / Book Slot
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <a
              href="#checklist"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-base font-semibold text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-800"
            >
              View JAMB Checklist
            </a>
          </div>

          {/* Trust Row */}
          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-slate-800 pt-6 text-xs text-slate-300 sm:grid-cols-3 sm:text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>55019 / 66019 Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>Mon&ndash;Sat: 7:30 AM &ndash; 8:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>Accurate Portal Support</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800 shadow-2xl">
            <Image
              src="/images/hero-cbt.png"
              alt="NetPoint CBT workstation and digital services centre in Ugbowo, Benin City"
              width={1200}
              height={800}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="flex items-center justify-between border-t border-slate-700/80 bg-slate-900/90 px-4 py-3 text-xs text-slate-300 sm:px-5">
              <span>Managed by Mr. Edosa Ekhator</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Walk-ins &amp; Pre-booked Slots
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
