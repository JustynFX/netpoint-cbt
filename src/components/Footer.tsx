"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface FooterProps {
  onOpenEnquiry: () => void;
}

export function Footer({ onOpenEnquiry }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 pb-20 pt-12 text-slate-300 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-base font-bold">
                NetPoint <span className="text-emerald-400">CBT &amp; Cyber Café</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Reliable JAMB/Post-UTME registration support, high-speed printing, binding, and
              online application services near UNIBEN Main Gate, Ugbowo, Benin City.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Navigation
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#services" className="transition-colors hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="#checklist" className="transition-colors hover:text-white">
                  JAMB &ldquo;What to Bring&rdquo; Checklist
                </a>
              </li>
              <li>
                <a href="#location" className="transition-colors hover:text-white">
                  Hours &amp; Ugbowo Location
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEnquiry}
                  className="text-emerald-400 transition-colors hover:text-emerald-300 cursor-pointer"
                >
                  Enquire / Book Slot
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Compliance &amp; Management
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              NetPoint CBT assists with accurate registration and document preparation only. We
              never promise or guarantee exam scores or university admission; official results are
              issued solely by JAMB, WAEC, and UNIBEN.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} NetPoint CBT &amp; Cyber Café &bull; Mr. Edosa
            Ekhator, Ugbowo, Benin City.
          </p>
          <Link
            href="/admin"
            className="text-slate-500 transition-colors hover:text-slate-300"
          >
            Owner Portal (/admin)
          </Link>
        </div>
      </div>
    </footer>
  );
}
