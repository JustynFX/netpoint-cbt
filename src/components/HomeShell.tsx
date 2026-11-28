"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { JambChecklist } from "@/components/JambChecklist";
import { HoursLocation } from "@/components/HoursLocation";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/lib/constants";

export function HomeShell() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceCategory>(
    SERVICE_CATEGORIES[0]
  );

  useEffect(() => {
    document.body.classList.toggle("enquiry-modal-open", modalOpen);
    return () => document.body.classList.remove("enquiry-modal-open");
  }, [modalOpen]);

  const openEnquiry = (service?: ServiceCategory) => {
    if (service) {
      setSelectedService(service);
    }
    setModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar onOpenEnquiry={() => openEnquiry()} />
      <main className="flex-1">
        <Hero onOpenEnquiry={() => openEnquiry()} />
        <Services onSelectService={(service) => openEnquiry(service)} />
        <JambChecklist onOpenEnquiry={(service) => openEnquiry(service)} />
        <HoursLocation onOpenEnquiry={() => openEnquiry()} />
      </main>
      <Footer onOpenEnquiry={() => openEnquiry()} />
      <EnquiryModal
        isOpen={modalOpen}
        initialService={selectedService}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
