import { NextResponse } from "next/server";
import { classifyEnquiry } from "@/lib/triage";
import {
  appendToGoogleSheet,
  sendCustomerEmail,
  sendOwnerTelegramAlert,
} from "@/lib/notifications";

interface EnquiryRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  message?: unknown;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatBeninTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export async function POST(request: Request) {
  let rawBody: EnquiryRequestBody;
  try {
    rawBody = (await request.json()) as EnquiryRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const name = typeof rawBody.name === "string" ? rawBody.name.trim() : "";
  const email = typeof rawBody.email === "string" ? rawBody.email.trim() : "";
  const phone = typeof rawBody.phone === "string" ? rawBody.phone.trim() : "";
  const service = typeof rawBody.service === "string" ? rawBody.service.trim() : "";
  const message = typeof rawBody.message === "string" ? rawBody.message.trim() : "";

  if (!name || name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please provide your full name." },
      { status: 400 }
    );
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (!service) {
    return NextResponse.json(
      { ok: false, error: "Please select a service category." },
      { status: 400 }
    );
  }

  if (!message || message.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please enter a brief message or enquiry." },
      { status: 400 }
    );
  }

  const enquiry = { name, email, phone, service, message };
  const timestamp = formatBeninTimestamp(new Date());

  // 1. Classify enquiry into HOT / WARM / CHECK
  const triage = await classifyEnquiry(enquiry);

  // 2. Execute external integrations independently with resilient fallbacks
  const [sheetsStatus, emailStatus, telegramStatus] = await Promise.all([
    appendToGoogleSheet({
      Timestamp: timestamp,
      Name: name,
      Email: email,
      Phone: phone || "N/A",
      Service: service,
      Message: message,
      Label: triage.label,
    }),
    sendCustomerEmail(enquiry, triage.label),
    sendOwnerTelegramAlert(enquiry, triage.label, timestamp),
  ]);

  console.info("[NetPoint][Enquiry] Processed", {
    timestamp,
    service,
    label: triage.label,
    triageSource: triage.source,
    integrations: {
      sheets: sheetsStatus,
      email: emailStatus,
      telegram: telegramStatus,
    },
  });

  const customerSummary =
    triage.label === "HOT"
      ? "Your slot or urgent order request has been logged. Our Ugbowo desk is ready to assist you."
      : triage.label === "CHECK"
        ? "Your enquiry has been flagged for personal review by Mr. Edosa Ekhator so your issue can be resolved accurately."
        : "Your enquiry has been logged and our team has sent helpful preparation details.";

  return NextResponse.json({
    ok: true,
    label: triage.label,
    triageSource: triage.source,
    timestamp,
    summary: customerSummary,
    integrations: {
      sheets: sheetsStatus,
      email: emailStatus,
      telegram: telegramStatus,
    },
  });
}
