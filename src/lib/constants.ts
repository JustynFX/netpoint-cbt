export const SERVICE_CATEGORIES = [
  "JAMB, Post-UTME & Exam Registration",
  "High-Speed Printing, Photocopy & Binding",
  "Document Typing & Online Applications",
  "Profile Code / Biometric / Portal Issue",
  "General Question / Pricing",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
