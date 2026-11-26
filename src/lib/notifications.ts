import type { EnquiryInput, TriageLabel } from "./triage";

export interface SheetRowPayload {
  Timestamp: string;
  Name: string;
  Email: string;
  Phone: string;
  Service: string;
  Message: string;
  Label: TriageLabel;
}

export interface IntegrationStatus {
  sheets: "sent" | "skipped" | "failed";
  email: "sent" | "skipped" | "failed";
  telegram: "sent" | "skipped" | "not_required" | "failed";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildCustomerEmail(input: EnquiryInput, label: TriageLabel) {
  const safeName = escapeHtml(input.name);
  const safeService = escapeHtml(input.service);

  const complianceFooter = `
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
    <p style="font-size:12px;color:#64748b;line-height:1.5;">
      <strong>NetPoint CBT &amp; Cyber Café</strong> &bull; Ugbowo (near UNIBEN Main Gate), Benin City<br/>
      Hours: Monday &ndash; Saturday, 7:30 AM &ndash; 8:00 PM (WAT)<br/>
      <em>Compliance Notice: NetPoint CBT provides registration, printing, and portal support only. Official exam scores and admissions are determined solely by JAMB, WAEC, and UNIBEN.</em>
    </p>
  `;

  if (label === "HOT") {
    return {
      subject: "Slot / Service Request Received — NetPoint CBT (Ugbowo)",
      html: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;max-width:600px;line-height:1.6;">
          <h2 style="color:#0f172a;margin-bottom:8px;">Hello ${safeName},</h2>
          <p>Thank you for contacting <strong>NetPoint CBT &amp; Cyber Café</strong>. We have received your slot/service request for <strong>${safeService}</strong> and notified our Ugbowo desk so we can attend to you quickly.</p>
          <p><strong>Before you arrive near UNIBEN Main Gate:</strong></p>
          <ul>
            <li>For JAMB/Post-UTME: bring your valid NIN slip, 10-character Profile Code (via 55019/66019), O&apos;Level results, and active personal email/phone.</li>
            <li>For Printing/Binding: bring your document on a flash drive, phone, or email ready to forward at the desk.</li>
            <li>Opening Hours: Monday &ndash; Saturday, 7:30 AM &ndash; 8:00 PM.</li>
          </ul>
          <p>We look forward to serving you shortly.</p>
          ${complianceFooter}
        </div>
      `,
    };
  }

  if (label === "CHECK") {
    return {
      subject: "Personal Review Escalation — NetPoint CBT (Mr. Edosa Ekhator)",
      html: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;max-width:600px;line-height:1.6;">
          <h2 style="color:#0f172a;margin-bottom:8px;">Hello ${safeName},</h2>
          <p>Thank you for reaching out to <strong>NetPoint CBT &amp; Cyber Café</strong> regarding <strong>${safeService}</strong>.</p>
          <p>Because your message involves a specific issue or escalation (such as a profile code, NIN/biometric challenge, payment/portal error, or exam result question), it has been flagged for <strong>personal review by Mr. Edosa Ekhator</strong>.</p>
          <p>Please note that NetPoint CBT can guide you through official registration and technical steps, while examination scores and admissions are issued strictly by JAMB, WAEC, or UNIBEN without guarantees.</p>
          <p>Mr. Edosa will review your details and follow up with clear next steps.</p>
          ${complianceFooter}
        </div>
      `,
    };
  }

  return {
    subject: "Information & Checklist — NetPoint CBT & Cyber Café (Ugbowo)",
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a;max-width:600px;line-height:1.6;">
        <h2 style="color:#0f172a;margin-bottom:8px;">Hello ${safeName},</h2>
        <p>Thank you for your enquiry about <strong>${safeService}</strong> at <strong>NetPoint CBT &amp; Cyber Café</strong> (Ugbowo, near UNIBEN Main Gate, Benin City).</p>
        <p><strong>Quick Reference for Your Visit:</strong></p>
        <ul>
          <li><strong>Hours:</strong> Monday &ndash; Saturday, 7:30 AM &ndash; 8:00 PM (extended slots during peak JAMB season).</li>
          <li><strong>JAMB Registration Essentials:</strong> NIN slip, 10-character Profile Code (55019/66019), O&apos;Level results (max 2 sittings), active email &amp; phone, and no glasses/caps for capture.</li>
          <li><strong>Other Services:</strong> High-speed laser printing, spiral/comb binding for UNIBEN projects, typing, and online portal applications.</li>
        </ul>
        <p>Reply to this email or submit another slot request anytime when you are ready to come in.</p>
        ${complianceFooter}
      </div>
    `,
  };
}

export async function appendToGoogleSheet(
  row: SheetRowPayload
): Promise<"sent" | "skipped" | "failed"> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.info(
      "[NetPoint][Sheets] GOOGLE_SHEET_WEBHOOK_URL not set — skipping Google Sheet append."
    );
    return "skipped";
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Google Sheet webhook HTTP ${response.status}`);
    }
    return "sent";
  } catch (error) {
    console.error("[NetPoint][Sheets] Failed to append enquiry row:", error);
    return "failed";
  }
}

export async function sendCustomerEmail(
  input: EnquiryInput,
  label: TriageLabel
): Promise<"sent" | "skipped" | "failed"> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    console.info(
      "[NetPoint][Email] RESEND_API_KEY not set — skipping customer email dispatch."
    );
    return "skipped";
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || "NetPoint CBT <onboarding@resend.dev>";
  const { subject, html } = buildCustomerEmail(input, label);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [input.email],
        subject,
        html,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Resend API HTTP ${response.status}: ${text}`);
    }
    return "sent";
  } catch (error) {
    console.error("[NetPoint][Email] Failed to send customer email:", error);
    return "failed";
  }
}

export async function sendOwnerTelegramAlert(
  input: EnquiryInput,
  label: TriageLabel,
  timestamp: string
): Promise<"sent" | "skipped" | "not_required" | "failed"> {
  if (label !== "HOT" && label !== "CHECK") {
    return "not_required";
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!botToken || !chatId) {
    console.info(
      "[NetPoint][Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping Telegram alert."
    );
    return "skipped";
  }

  const heading =
    label === "CHECK"
      ? "URGENT ESCALATION [CHECK]"
      : "NEW BOOKING / ORDER [HOT]";

  const text = [
    `${heading} — NetPoint CBT`,
    `Time: ${timestamp}`,
    `Name: ${input.name}`,
    `Service: ${input.service}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "Not provided"}`,
    `Message: ${input.message}`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Telegram API HTTP ${response.status}: ${body}`);
    }
    return "sent";
  } catch (error) {
    console.error("[NetPoint][Telegram] Failed to send Telegram alert:", error);
    return "failed";
  }
}
