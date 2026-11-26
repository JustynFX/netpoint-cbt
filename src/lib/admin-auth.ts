import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "netpoint_admin_session";

function getAdminPin(): string | null {
  const pin = process.env.ADMIN_PIN?.trim();
  return pin && pin.length > 0 ? pin : null;
}

function signToken(payload: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function isAdminPinConfigured(): boolean {
  return getAdminPin() !== null;
}

export function verifyPinInput(submittedPin: string): boolean {
  const expected = getAdminPin();
  if (!expected) return false;
  const a = Buffer.from(submittedPin.trim(), "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createAdminSessionToken(): string | null {
  const secret = getAdminPin();
  if (!secret) return null;
  const issuedAt = Date.now().toString();
  return signToken(`netpoint-owner:${issuedAt}`, secret);
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const secret = getAdminPin();
  if (!secret) return false;

  const dotIdx = token.lastIndexOf(".");
  if (dotIdx <= 0) return false;

  const payload = token.slice(0, dotIdx);
  const expectedToken = signToken(payload, secret);

  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(expectedToken, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}
