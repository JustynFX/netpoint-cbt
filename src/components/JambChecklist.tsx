"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckSquare,
  RotateCcw,
  Square,
  CalendarCheck,
  Info,
} from "lucide-react";
import type { ServiceCategory } from "@/lib/constants";

interface JambChecklistProps {
  onOpenEnquiry: (service?: ServiceCategory) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
}

const checklistItems: ChecklistItem[] = [
  {
    id: "nin",
    label: "Valid NIN Slip / National ID Number",
    detail:
      "Verify that your full name and date of birth on your NIMC slip match your O'Level documents.",
  },
  {
    id: "profile-code",
    label: "10-Character JAMB Profile Code",
    detail:
      "Text 'NIN' followed by a space and your 11-digit NIN to 55019 or 66019 from your personal SIM.",
  },
  {
    id: "olevel",
    label: "O'Level Results (WAEC / NECO / NABTEB)",
    detail:
      "Bring clear copies (maximum of two sittings) or let us know if you are registering with Awaiting Result.",
  },
  {
    id: "contact",
    label: "Active Personal Email & Phone Number",
    detail:
      "Use an email address you can open on your phone—JAMB sends confirmation and CAPS updates directly to it.",
  },
  {
    id: "course-choice",
    label: "Preferred Institution, Course & UTME Subjects",
    detail:
      "Confirm your 1st–4th choice schools and exact JAMB subject combination for your UNIBEN or chosen course.",
  },
  {
    id: "previous-reg",
    label: "Previous JAMB Reg Number (Direct Entry / Re-sit only)",
    detail:
      "Required if you are applying for Direct Entry or updating an existing JAMB profile.",
  },
];

const photoRules = [
  "No eyeglasses, tinted shades, hats, or face caps.",
  "Both ears must be clearly visible with a neutral expression.",
  "Plain white or clean light background; neat, modest dressing.",
  "Keep fingers clean and dry for smooth biometric thumbprint capture.",
];

export function JambChecklist({ onOpenEnquiry }: JambChecklistProps) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progress = Math.round((checkedIds.length / checklistItems.length) * 100);

  return (
    <section id="checklist" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Pre-Visit Preparation
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              JAMB &amp; Post-UTME &ldquo;What to Bring&rdquo; Checklist
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Tick off each requirement before leaving home so your registration at our Ugbowo
              centre takes minutes instead of multiple trips.
            </p>
          </div>

          {checkedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setCheckedIds([])}
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Checklist
            </button>
          )}
        </div>

        <div className="mt-10 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Interactive Checklist */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7 lg:col-span-7">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-900">
                Readiness Progress ({checkedIds.length} of {checklistItems.length} ready)
              </span>
              <span className="text-sm font-bold text-emerald-600">{progress}%</span>
            </div>

            <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <ul className="mt-6 space-y-3">
              {checklistItems.map((item) => {
                const isChecked = checkedIds.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-pressed={isChecked}
                      className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                        isChecked
                          ? "border-emerald-300 bg-emerald-50/70"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="mt-0.5 shrink-0 text-emerald-600">
                        {isChecked ? (
                          <CheckSquare className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Square className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <span
                          className={`block text-sm font-bold sm:text-base ${
                            isChecked ? "text-emerald-950 line-through decoration-emerald-500/60" : "text-slate-900"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-slate-600 sm:text-sm">
                          {item.detail}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Column: Passport Rules & Issue Help */}
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">Passport &amp; Biometric Rules</h3>
                  <p className="text-xs text-slate-300">
                    Avoid rejected captures during registration
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-slate-200">
                {photoRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={() => onOpenEnquiry("JAMB, Post-UTME & Exam Registration")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 cursor-pointer"
                >
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  Items Ready? Book a Slot
                </button>
              </div>
            </div>

            {/* Troubleshooting / Profile Code Help Box */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                    Profile Code, NIN, or Biometric Issue?
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                    Not receiving your 55019/66019 SMS, seeing a NIMC mismatch, or had past
                    thumbprint capture trouble? Send us an enquiry before coming in so Mr. Edosa
                    can review the exact issue.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenEnquiry("Profile Code / Biometric / Portal Issue")}
                    className="mt-3 inline-flex items-center text-sm font-bold text-amber-900 underline decoration-amber-400 underline-offset-4 hover:text-amber-950 cursor-pointer"
                  >
                    Report a Profile Code or Portal Issue &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Compliance Note (The Never Rule) */}
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs leading-relaxed text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              <p>
                <strong>Official Examination Notice:</strong> NetPoint CBT provides accurate
                registration, printing, and technical assistance only. Examination scores,
                cut-off marks, and admissions are determined strictly by JAMB, WAEC, and UNIBEN.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
