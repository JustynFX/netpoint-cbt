import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isAdminAuthenticated,
  isAdminPinConfigured,
  verifyPinInput,
} from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({
    ok: true,
    authenticated,
    pinConfigured: isAdminPinConfigured(),
  });
}

export async function POST(request: Request) {
  if (!isAdminPinConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "ADMIN_PIN is not configured on the server (.env.local).",
      },
      { status: 503 }
    );
  }

  let body: { pin?: unknown };
  try {
    body = (await request.json()) as { pin?: unknown };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const submittedPin = typeof body.pin === "string" ? body.pin : "";
  if (!submittedPin.trim() || !verifyPinInput(submittedPin)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect Owner PIN. Please try again." },
      { status: 401 }
    );
  }

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Unable to issue session." },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true, authenticated: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, authenticated: false });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
