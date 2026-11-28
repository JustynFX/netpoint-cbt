"use client";

import { useState } from "react";
import { GraduationCap, Menu, X, CalendarCheck } from "lucide-react";

interface NavbarProps {
  onOpenEnquiry: () => void;
}

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "JAMB Checklist", href: "#checklist" },
  { label: "Hours & Location", href: "#location" },
];

export function Navbar({ onOpenEnquiry }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 shadow-sm">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              NetPoint <span className="text-emerald-600">CBT</span>
            </span>
            <span className="block text-[11px] font-medium text-slate-500">
              Cyber Café &bull; Ugbowo, Benin City
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenEnquiry}
            className="hidden items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:inline-flex cursor-pointer"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Enquire / Book Slot
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 cursor-pointer"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Enquire / Book Slot
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
