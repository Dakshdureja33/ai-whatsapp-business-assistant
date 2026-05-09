import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WhatsApp Business Assistant | AI-Powered Automation",
  description:
    "Automate customer support, lead management, and order handling through WhatsApp using Meta's Cloud API and AI-powered responses.",
  keywords: [
    "WhatsApp", "Business", "AI", "Automation", "Meta", "Customer Support",
    "Lead Management", "Chatbot", "SaaS",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

