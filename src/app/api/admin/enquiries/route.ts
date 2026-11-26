import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fetchEnquiriesFromSheet } from "@/lib/sheets-csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Please sign in with the Owner PIN." },
      { status: 401 }
    );
  }

  const result = await fetchEnquiriesFromSheet();
  return NextResponse.json({
    ok: true,
    mode: result.mode,
    warning: result.warning ?? null,
    enquiries: result.enquiries,
  });
}
