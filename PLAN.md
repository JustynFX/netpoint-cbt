# MASTER PROJECT PLAN: NetPoint CBT & Cyber Café (Capstone #13)

## 1. Project Overview & Architecture
- **Business Name:** NetPoint CBT & Cyber Café
- **Client / Owner:** Mr. Edosa Ekhator
- **Location:** Ugbowo (near UNIBEN Main Gate), Benin City, Edo State
- **Execution Mode:** Solo, self-contained build (bypassing all group-work and n8n dependencies).
- **Tech Stack:**
  - **Frontend & Backend:** Next.js (App Router) / React + Tailwind CSS (built in Antigravity).
  - **AI Chatbot:** Botpress Webchat (embedded widget).
  - **Automation & AI Triage:** Native Next.js API Route (`/api/enquiry`) replacing n8n.
  - **Data Persistence:** Google Sheets (via Google Apps Script Webhook or Google Sheets API).
  - **Notifications:** Automated Customer Email (Resend / Nodemailer) + Owner Telegram Bot Alert (`HOT` & `CHECK` leads).
  - **Admin Portal:** Protected `/admin` dashboard reading live data from Google Sheets.

---

## 2. Business Rules & Domain Logic (Non-Negotiable)
1. **Core Problem Solved:** Eliminates peak JAMB/Post-UTME registration crowds and late-night repetitive WhatsApp/phone enquiries by automating FAQs, pre-visit document checklists, slot booking, and instant issue triage.
2. **THE NEVER RULE:** The system (website copy, chatbot, and automated emails) must **NEVER** promise, predict, or guarantee any JAMB score, Post-UTME score, or exam result. Only the official examination body (JAMB/WAEC/UNIBEN) determines results.
3. **AI Enquiry Triage Classification (`HOT` / `WARM` / `CHECK`):**
   - **`HOT`:** Customer is ready to visit, book a registration slot, or place an urgent printing/typing order. *(Action: Save to Sheet + Send Confirmation Email + Fire Telegram Alert).*
   - **`WARM`:** Customer is asking general questions (opening hours, pricing inquiries, required documents, services). *(Action: Save to Sheet + Send Helpful Info Email).*
   - **`CHECK`:** Customer reports a missing JAMB profile code, biometric/thumbprint failure, payment issue, complaint, OR asks for a guaranteed exam result. *(Action: Save to Sheet + Send Escalation Email stating Mr. Edosa will review personally + Fire Urgent Telegram Alert).*

---

## 3. Phased Execution Roadmap

### Phase 1: Project Scaffolding & Design System
- Initialize clean Next.js project structure with TypeScript and Tailwind CSS.
- Configure design tokens:
  - Primary Brand: Deep Academic Navy (`#0F172A`)
  - Accent / CTA: Emerald Green (`#10B981`)
  - Surface / Background: Crisp White (`#FFFFFF`) & Slate (`#F8FAFC`)
- Set up `.env.local` and `.env.example` for API keys (`GEMINI_API_KEY` or `OPENAI_API_KEY`, `GOOGLE_SHEET_WEBHOOK_URL`, `NEXT_PUBLIC_SHEET_CSV_URL`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ADMIN_PIN`).

### Phase 2: Public Website & Conversion UI
- **Navbar:** Brand logo, smooth-scroll links (`Services`, `JAMB Checklist`, `Hours & Location`), and primary CTA button (`Enquire / Book Slot`).
- **Hero Section:** Clear one-line value proposition (*"Fast, Stress-Free JAMB Registration, Printing & Digital Services Near UNIBEN"*), subheadline, primary CTA button, and Hero Image slot (`/images/hero-cbt.png`).
- **Services Showcase:** 3 structured cards with dedicated image slots (`/images/service-jamb.png`, `/images/service-print.png`, `/images/service-typing.png`):
  1. JAMB, Post-UTME & Exam Registration
  2. High-Speed Printing, Photocopy & Binding
  3. Document Typing & Online Portal Applications
- **Interactive JAMB "What to Bring" Checklist:** Client-side interactive checklist allowing students to check off NIN Slip, 10-character Profile Code, O'Level Results, Active Email/Phone, and review Passport Photo rules (no glasses/caps, ears visible).
- **Hours & Ugbowo Location Section:** Mon–Sat (7:30 AM – 8:00 PM), extended JAMB season hours, and clear UNIBEN Main Gate directions.
- **Footer:** Business summary, quick links, and discreet `/admin` owner link.

### Phase 3: Native Enquiry Pipeline (`/api/enquiry`)
- Build responsive **Enquiry Modal** (accessible from all `Enquire / Book Slot` buttons) with fields: `Full Name`, `Email`, `Phone (Optional)`, `Service Category` dropdown, and `Message`.
- Implement `/api/enquiry` POST handler:
  1. Validate payload.
  2. Query LLM to classify message strictly into `HOT`, `WARM`, or `CHECK`.
  3. POST structured payload (`Timestamp`, `Name`, `Email`, `Phone`, `Service`, `Message`, `Label`) to Google Sheets webhook.
  4. Dispatch tailored email response to customer.
  5. Dispatch Telegram message to Mr. Edosa if label is `HOT` or `CHECK`.
- Provide ready-to-paste Google Apps Script snippet for the Google Sheet.

### Phase 4: Live Admin Dashboard (`/admin`)
- Build PIN-authenticated owner dashboard (`/admin`).
- Fetch live rows from Google Sheets (`NEXT_PUBLIC_SHEET_CSV_URL` or server API route to avoid CORS/caching delays).
- Display 4 KPI Summary Cards: `Total Enquiries`, `HOT Leads`, `WARM Leads`, `CHECK Escalations`.
- Display Service Breakdown bar visualization.
- Build filterable, searchable `Latest Enquiries` table (`Filter by Label: All / HOT / WARM / CHECK`, search by name/message, manual Refresh button).

### Phase 5: Botpress Chatbot Integration & QA Verification
- Inject Botpress Webchat scripts (`inject.js` + `config.js`) cleanly into the root layout without overlapping mobile UI.
- Verify all 4 automated enquiry test cases (`HOT`, `WARM`, `CHECK`, and edge-case `"hello"`).
- Verify mobile responsiveness across 375px and 1440px viewports.