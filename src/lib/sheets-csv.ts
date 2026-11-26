import type { TriageLabel } from "./triage";

export interface EnquiryRecord {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  label: TriageLabel;
}

/**
 * RFC-4180 compliant CSV parser supporting quoted fields, embedded commas,
 * escaped quotes (""), and CRLF/LF newlines.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field.trim());
      field = "";
    } else if (ch === "\r" && next === "\n") {
      row.push(field.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
      i++;
    } else if (ch === "\n" || ch === "\r") {
      row.push(field.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  return rows;
}

function normalizeLabel(raw: string | undefined): TriageLabel {
  const upper = (raw ?? "").trim().toUpperCase();
  if (upper === "HOT" || upper === "WARM" || upper === "CHECK") {
    return upper;
  }
  return "WARM";
}

export const DEMO_ENQUIRIES: EnquiryRecord[] = [
  {
    id: "demo-1",
    timestamp: "26 Nov 2026, 04:15 PM",
    name: "Chinedu Okafor",
    email: "chinedu.okafor@example.com",
    phone: "0803 456 7890",
    service: "JAMB, Post-UTME & Exam Registration",
    message: "Coming tomorrow at 8:30 AM to complete my UTME registration. NIN and profile code ready.",
    label: "HOT",
  },
  {
    id: "demo-2",
    timestamp: "26 Nov 2026, 02:40 PM",
    name: "Tega Akpovire",
    email: "tega.akpovire@example.com",
    phone: "0809 111 2233",
    service: "Profile Code / Biometric / Portal Issue",
    message: "Sent NIN to 55019 twice since yesterday and no profile code SMS has arrived yet.",
    label: "CHECK",
  },
  {
    id: "demo-3",
    timestamp: "26 Nov 2026, 12:10 PM",
    name: "Eseosa Iguodala",
    email: "eseosa.i@example.com",
    phone: "0812 888 0912",
    service: "High-Speed Printing, Photocopy & Binding",
    message: "How much is spiral binding and colour printing for a 65-page UNIBEN final-year project?",
    label: "WARM",
  },
  {
    id: "demo-4",
    timestamp: "26 Nov 2026, 10:05 AM",
    name: "Osasere Omoregie",
    email: "osasere@example.com",
    phone: "0706 321 4455",
    service: "Document Typing & Online Applications",
    message: "Need to book a slot this afternoon to type my SIWES logbook summary and generate Remita RRR.",
    label: "HOT",
  },
];

export async function fetchEnquiriesFromSheet(): Promise<{
  mode: "live" | "demo";
  enquiries: EnquiryRecord[];
  warning?: string;
}> {
  const csvUrl = process.env.NEXT_PUBLIC_SHEET_CSV_URL?.trim();

  if (!csvUrl) {
    console.info(
      "[NetPoint][Admin] NEXT_PUBLIC_SHEET_CSV_URL not set — returning local preview data."
    );
    return {
      mode: "demo",
      enquiries: DEMO_ENQUIRIES,
      warning:
        "NEXT_PUBLIC_SHEET_CSV_URL is not configured in .env.local yet. Showing preview rows.",
    };
  }

  try {
    const response = await fetch(csvUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Google Sheet CSV HTTP ${response.status}`);
    }

    const csvText = await response.text();
    const matrix = parseCsv(csvText);

    if (matrix.length === 0) {
      return { mode: "live", enquiries: [] };
    }

    const header = matrix[0].map((col) => col.toLowerCase());
    const hasHeader =
      header.includes("timestamp") ||
      header.includes("name") ||
      header.includes("label");

    const dataRows = hasHeader ? matrix.slice(1) : matrix;

    const findCol = (key: string, fallbackIndex: number) => {
      if (!hasHeader) return fallbackIndex;
      const idx = header.findIndex((col) => col.includes(key));
      return idx >= 0 ? idx : fallbackIndex;
    };

    const tsIdx = findCol("timestamp", 0);
    const nameIdx = findCol("name", 1);
    const emailIdx = findCol("email", 2);
    const phoneIdx = findCol("phone", 3);
    const serviceIdx = findCol("service", 4);
    const messageIdx = findCol("message", 5);
    const labelIdx = findCol("label", 6);

    const parsed: EnquiryRecord[] = dataRows
      .map((cols, index) => ({
        id: `row-${index + 1}`,
        timestamp: cols[tsIdx] || "—",
        name: cols[nameIdx] || "Unknown",
        email: cols[emailIdx] || "—",
        phone: cols[phoneIdx] || "N/A",
        service: cols[serviceIdx] || "General Enquiry",
        message: cols[messageIdx] || "",
        label: normalizeLabel(cols[labelIdx]),
      }))
      .reverse(); // Newest first

    return { mode: "live", enquiries: parsed };
  } catch (error) {
    console.error("[NetPoint][Admin] Failed to fetch Google Sheet CSV:", error);
    return {
      mode: "demo",
      enquiries: DEMO_ENQUIRIES,
      warning:
        "Could not fetch live Google Sheet CSV right now. Showing fallback preview rows.",
    };
  }
}
