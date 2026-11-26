"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { ServiceCategory } from "@/lib/constants";

interface ServicesProps {
  onSelectService: (service: ServiceCategory) => void;
}

interface ServiceItem {
  title: ServiceCategory;
  badge: string;
  image: string;
  imageAlt: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
}

const services: ServiceItem[] = [
  {
    title: "JAMB, Post-UTME & Exam Registration",
    badge: "Exam Support",
    image: "/images/service-jamb.png",
    imageAlt: "JAMB UTME, Direct Entry, and Post-UTME registration support",
    description:
      "Smooth registration assistance for UTME, Direct Entry, WAEC/NECO GCE, and UNIBEN Post-UTME screening & clearance.",
    highlights: [
      "55019 / 66019 profile code & NIN check",
      "Biometric capture & slip printing",
      "O'Level & change-of-institution uploads",
    ],
    ctaLabel: "Book Registration Slot",
  },
  {
    title: "High-Speed Printing, Photocopy & Binding",
    badge: "Print & Bind",
    image: "/images/service-print.png",
    imageAlt: "High-speed laser printing, photocopying, and project binding",
    description:
      "Crisp black-and-white or colour prints for lecture notes, SIWES reports, and final-year UNIBEN research projects.",
    highlights: [
      "Spiral, comb & thermal project binding",
      "Fast bulk photocopying & ID lamination",
      "High-resolution document scanning to PDF",
    ],
    ctaLabel: "Enquire About Printing",
  },
  {
    title: "Document Typing & Online Applications",
    badge: "Digital Desk",
    image: "/images/service-typing.png",
    imageAlt: "Professional document typing and online portal applications",
    description:
      "Clean, error-free document formatting and guided submissions for university, scholarship, and NYSC portals.",
    highlights: [
      "Assignments, CVs & official letters typed fast",
      "UNIBEN school fees, KOFA & hostel portals",
      "NYSC mobilisation, Remita RRR & bursary forms",
    ],
    ctaLabel: "Request Typing / Portal Help",
  },
];

export function Services({ onSelectService }: ServicesProps) {
  return (
    <section id="services" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Our Core Services
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Everything Students &amp; Applicants Need Under One Roof
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Whether you are preparing for UTME, submitting a final-year project, or completing
            an urgent online portal application, book ahead or enquire first so you save time.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[10/7] w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={800}
                  height={560}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3.5 top-3.5 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                  {service.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-700">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                  >
                    {service.ctaLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
