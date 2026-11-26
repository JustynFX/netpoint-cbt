# AGENTS.md — Builder & Autonomous Agent Instructions

## Role & Operating Mandate
You are the Principal Full-Stack Engineer building **NetPoint CBT & Cyber Café** for **Mr. Edosa Ekhator** (Ugbowo, near UNIBEN, Benin City). Every architectural, UI, and backend decision must optimize for speed, reliability, mobile-first usability, and zero external workflow dependencies.

---

## Strict Architectural Constraints
1. **NO Group-Work Artifacts:** Do NOT create multi-business dropdowns, shared multi-tenant forms, or references to other businesses. This platform is exclusively for **NetPoint CBT**.
2. **NO n8n / External Workflow Builders:** Do NOT instruct the user to configure n8n, Zapier, or Make. All automation (AI classification, Google Sheet logging, email dispatch, and Telegram alerts) MUST live natively inside `/api/enquiry`.
3. **Chatbot Provider:** Use **Botpress** exclusively for the embedded chat widget. Never add Chatbase, Intercom, or custom mock chat widgets.
4. **Resilient Fallbacks:** In `/api/enquiry`, wrap external API calls (LLM, Google Sheets, Email, Telegram) in independent `try/catch` blocks so a missing optional key (e.g., during local dev testing) logs clearly to the console without crashing the user's form submission experience.

---

## Domain & Compliance Guardrails
- **The Never Rule:** Never generate copy, email templates, or fallback responses that promise or imply guaranteed JAMB/exam scores or admission.
- **Nigerian Academic Context:** Use authentic, clear Nigerian English appropriate for UNIBEN students and Benin City residents (e.g., referencing NIN, 55019/66019 profile codes, Post-UTME, Ugbowo, UNIBEN Main Gate). No "lorem ipsum" placeholder text anywhere in the codebase.

---

## Coding & UI Standards
- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons (`lucide-react`).
- **Aesthetics:**
  - Palette: Deep Navy (`#0F172A`), Emerald (`#10B981`), Crisp White (`#FFFFFF`), Soft Slate (`#F8FAFC`).
  - Typography: Clean sans-serif (`Inter` or `Plus Jakarta Sans`), strong visual hierarchy, high contrast.
  - Mobile-First: Ensure modals, tables, and buttons work smoothly on 375px mobile screens. Leave bottom-right viewport clearance (`bottom-6 right-6`) for the Botpress floating bubble.
- **Code Quality:**
  - Keep components modular (`src/components/Navbar.tsx`, `Hero.tsx`, `Services.tsx`, `JambChecklist.tsx`, `EnquiryModal.tsx`, `AdminDashboard.tsx`).
  - Always maintain an up-to-date `.env.example` whenever new environment variables are introduced.
  - Build phase-by-phase as defined in `PLAN.md`. After completing each phase, summarize what was built and prompt the user to verify before advancing.