export type TriageLabel = "HOT" | "WARM" | "CHECK";

export interface EnquiryInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface TriageResult {
  label: TriageLabel;
  source: "gemini" | "openai" | "fallback";
}

const VALID_LABELS = new Set<TriageLabel>(["HOT", "WARM", "CHECK"]);

const TRIAGE_SYSTEM_PROMPT = `You are the enquiry triage classifier for NetPoint CBT & Cyber Café (Ugbowo, near UNIBEN Main Gate, Benin City, managed by Mr. Edosa Ekhator).

Classify the customer enquiry into EXACTLY ONE uppercase word: HOT, WARM, or CHECK.

Rules:
- HOT: Customer is ready to visit, book a registration/printing/typing slot, or place an urgent printing/typing/binding order.
- WARM: Customer is asking general questions (opening hours, pricing, required documents, services) or sending a simple greeting like "hello".
- CHECK: Customer reports a missing JAMB profile code, 55019/66019 failure, NIN mismatch, biometric/thumbprint failure, payment/Remita issue, complaint, OR asks for a guaranteed JAMB/Post-UTME score, result, or admission.

Reply with ONLY one word: HOT, WARM, or CHECK.`;

/**
 * Deterministic keyword fallback when no LLM API key is configured or an API call fails.
 * Always prioritizes CHECK safety/escalation rules first (including The Never Rule).
 */
export function fallbackClassifyEnquiry(input: EnquiryInput): TriageLabel {
  const messageLower = input.message.toLowerCase();
  const combined = `${input.service} ${input.message}`.toLowerCase();

  const checkPatterns = [
    "guarantee",
    "guaranteed",
    "pass jamb",
    "score 300",
    "score 250",
    "high score",
    "expo",
    "runs",
    "leak",
    "magic",
    "admission guaranteed",
    "profile code",
    "55019",
    "66019",
    "missing",
    "biometric",
    "thumbprint",
    "fingerprint",
    "nimc",
    "nin issue",
    "mismatch",
    "payment",
    "debited",
    "failed",
    "error",
    "issue",
    "problem",
    "complaint",
    "stuck",
    "cannot login",
    "can't login",
    "not working",
  ];

  if (checkPatterns.some((kw) => combined.includes(kw))) {
    return "CHECK";
  }

  const hotPatterns = [
    "book",
    "slot",
    "visit",
    "coming",
    "tomorrow",
    "today",
    "morning",
    "afternoon",
    "evening",
    "urgent",
    "asap",
    "right now",
    "register me",
    "want to register",
    "need to print",
    "want to print",
    "ready to print",
    "ready to bind",
    "place an order",
    "schedule",
    "appointment",
  ];

  if (hotPatterns.some((kw) => messageLower.includes(kw))) {
    return "HOT";
  }

  return "WARM";
}

function parseLabel(rawText: string | undefined | null): TriageLabel | null {
  if (!rawText) return null;
  const match = rawText.toUpperCase().match(/\b(HOT|WARM|CHECK)\b/);
  if (match && VALID_LABELS.has(match[1] as TriageLabel)) {
    return match[1] as TriageLabel;
  }
  return null;
}

export async function classifyEnquiry(input: EnquiryInput): Promise<TriageResult> {
  const userContent = `Service Category: ${input.service}\nCustomer Name: ${input.name}\nMessage: ${input.message}`;

  // 1. Try Gemini if GEMINI_API_KEY is configured
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: TRIAGE_SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userContent }] }],
            generationConfig: {
              temperature: 0,
              maxOutputTokens: 10,
            },
          }),
          signal: AbortSignal.timeout(8000),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = parseLabel(rawText);
      if (parsed) {
        return { label: parsed, source: "gemini" };
      }
      console.warn("[NetPoint][Triage] Gemini returned unparseable label:", rawText);
    } catch (error) {
      console.error("[NetPoint][Triage] Gemini classification failed:", error);
    }
  }

  // 2. Try OpenAI if OPENAI_API_KEY is configured
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0,
          max_tokens: 10,
          messages: [
            { role: "system", content: TRIAGE_SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const rawText = data.choices?.[0]?.message?.content;
      const parsed = parseLabel(rawText);
      if (parsed) {
        return { label: parsed, source: "openai" };
      }
      console.warn("[NetPoint][Triage] OpenAI returned unparseable label:", rawText);
    } catch (error) {
      console.error("[NetPoint][Triage] OpenAI classification failed:", error);
    }
  }

  // 3. Resilient local fallback
  if (!geminiKey && !openaiKey) {
    console.info(
      "[NetPoint][Triage] No LLM API key set — using deterministic keyword fallback."
    );
  }
  return {
    label: fallbackClassifyEnquiry(input),
    source: "fallback",
  };
}
