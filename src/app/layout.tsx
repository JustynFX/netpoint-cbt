import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BotpressWebchat } from "@/components/BotpressWebchat";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NetPoint CBT & Cyber Café | JAMB, Printing & Digital Services Near UNIBEN",
  description:
    "Fast, stress-free JAMB/Post-UTME registration, high-speed printing, project binding, and online portal services in Ugbowo, near UNIBEN Main Gate, Benin City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
        <BotpressWebchat />
      </body>
    </html>
  );
}
