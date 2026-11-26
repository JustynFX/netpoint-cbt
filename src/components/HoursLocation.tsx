"use client";

import { Clock, MapPin, Navigation, CalendarCheck } from "lucide-react";

interface HoursLocationProps {
  onOpenEnquiry: () => void;
}

export function HoursLocation({ onOpenEnquiry }: HoursLocationProps) {
  return (
    <section id="location" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Visit NetPoint CBT
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Operating Hours &amp; Ugbowo Location
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Conveniently positioned along the Ugbowo corridor near UNIBEN Main Gate for quick
            walk-ins and scheduled registration slots.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Operating Hours Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Opening Hours</h3>
                  <p className="text-xs font-medium text-slate-500">
                    West Africa Time (WAT) &bull; Benin City
                  </p>
                </div>
              </div>

              <dl className="mt-6 divide-y divide-slate-100 text-sm">
                <div className="flex items-center justify-between py-3.5">
                  <dt className="font-semibold text-slate-700">Monday &ndash; Saturday</dt>
                  <dd className="font-bold text-slate-900">7:30 AM &ndash; 8:00 PM</dd>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <dt className="font-semibold text-slate-700">
                    Peak JAMB / Post-UTME Season
                  </dt>
                  <dd className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Extended Slots Available
                  </dd>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <dt className="font-semibold text-slate-700">Sunday</dt>
                  <dd className="font-medium text-slate-500">
                    Closed (Online enquiries open 24/7)
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
              <strong>Tip for UNIBEN students:</strong> Morning slots between 7:30 AM and 10:00 AM
              are fastest for biometric registrations and large project binding jobs.
            </div>
          </div>

          {/* Ugbowo Location Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm sm:p-8">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">Ugbowo Centre Directions</h3>
                  <p className="text-xs font-medium text-slate-400">
                    NetPoint CBT &amp; Cyber Café &bull; Mr. Edosa Ekhator
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
                <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                  <p className="font-semibold text-white">
                    Ugbowo (Near UNIBEN Main Gate), Benin City, Edo State
                  </p>
                  <p className="mt-1 text-slate-300">
                    Easily accessible from UNIBEN Ugbowo Campus Main Gate, Ekosodin Junction, and
                    BDPA Housing Estate along the Benin&ndash;Lagos Expressway corridor.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 text-slate-300">
                  <Navigation
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>
                    Book an enquiry slot ahead of time and we will confirm your exact visit window
                    and checklist by email.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-2">
              <button
                type="button"
                onClick={onOpenEnquiry}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 cursor-pointer"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Enquire / Book Your Visit Slot
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
