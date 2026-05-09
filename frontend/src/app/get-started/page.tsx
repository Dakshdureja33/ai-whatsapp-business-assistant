"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle, ArrowRight, ArrowLeft, Check,
  Globe, Key, Bot, Zap, Rocket, Building2,
  Phone, Shield, BarChart3, Users
} from "lucide-react";

const steps = [
  {
    id: "welcome",
    title: "Welcome to WA Assistant",
    subtitle: "Your AI-powered WhatsApp Business automation platform",
    icon: Rocket,
    color: "#25D366",
  },
  {
    id: "features",
    title: "What you can do",
    subtitle: "Powerful features to grow your business on WhatsApp",
    icon: Zap,
    color: "#8b5cf6",
  },
  {
    id: "setup",
    title: "Quick setup guide",
    subtitle: "Get running in 3 easy steps",
    icon: Key,
    color: "#3b82f6",
  },
  {
    id: "ready",
    title: "You're all set!",
    subtitle: "Start automating your WhatsApp business today",
    icon: Check,
    color: "#22c55e",
  },
];

const features = [
  { icon: Bot, title: "AI Chatbot", desc: "Llama 3.3 powered intelligent responses", color: "#8b5cf6" },
  { icon: Users, title: "Lead Management", desc: "Auto-capture and score leads", color: "#3b82f6" },
  { icon: MessageCircle, title: "Live Chat", desc: "AI/Human handoff in real-time", color: "#25D366" },
  { icon: Zap, title: "Automation", desc: "Welcome messages, follow-ups, alerts", color: "#f59e0b" },
  { icon: BarChart3, title: "Analytics", desc: "Track messages, leads, conversions", color: "#06b6d4" },
  { icon: Shield, title: "Enterprise Ready", desc: "JWT auth, role-based access", color: "#ef4444" },
];

const setupSteps = [
  {
    step: 1,
    title: "Create Meta App",
    desc: "Go to Meta Developer Portal and create a Business app with WhatsApp product",
    icon: Globe,
  },
  {
    step: 2,
    title: "Configure API Keys",
    desc: "Add your WhatsApp Phone ID, Access Token, and Groq API key in Settings",
    icon: Key,
  },
  {
    step: 3,
    title: "Set Up Webhook",
    desc: "Point your Meta webhook URL to your deployed backend endpoint",
    icon: Phone,
  },
];

export default function GetStartedPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0d1525] to-[#0a1a10]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#25D366]/5 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#128C7E]/5 rounded-full blur-[120px] animate-float-delayed" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl px-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <motion.div
                animate={{
                  background: i <= currentStep ? s.color : "var(--color-border)",
                  scale: i === currentStep ? 1.2 : 1,
                }}
                className="w-3 h-3 rounded-full transition-colors"
              />
              {i < steps.length - 1 && (
                <div
                  className="w-16 h-0.5 mx-1"
                  style={{
                    background: i < currentStep ? steps[i + 1].color : "var(--color-border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#25D366]/20"
              >
                <MessageCircle className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-4xl font-bold mb-3">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[#25D366] to-[#128C7E] bg-clip-text text-transparent">
                  WA Assistant
                </span>
              </h1>
              <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
                Your AI-powered WhatsApp Business automation platform built on Meta&apos;s Cloud API.
              </p>

              <div className="glass-card p-8 max-w-md mx-auto text-left mb-8">
                <h3 className="font-semibold mb-4">What you&apos;ll set up today:</h3>
                <div className="space-y-3">
                  {["Connect your WhatsApp Business", "Configure AI responses", "Set up automation workflows", "Launch your dashboard"].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#25D366]" />
                      </div>
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Features */}
          {currentStep === 1 && (
            <motion.div
              key="features"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-2">Powerful Features</h1>
              <p className="text-[var(--color-text-muted)] mb-8">
                Everything you need to automate WhatsApp for your business
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-5 text-left group hover:border-[var(--color-border-hover)] transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${f.color}15` }}
                    >
                      <f.icon className="w-5 h-5" style={{ color: f.color }} />
                    </div>
                    <div className="text-sm font-semibold mb-1">{f.title}</div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Setup */}
          {currentStep === 2 && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-2">Quick Setup</h1>
              <p className="text-[var(--color-text-muted)] mb-8">
                Three steps to get your assistant running
              </p>

              <div className="space-y-4 max-w-lg mx-auto">
                {setupSteps.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="glass-card p-6 flex items-start gap-4 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-6 h-6 text-[#25D366]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366]/10 text-[#25D366] font-bold">
                          Step {s.step}
                        </span>
                        <h3 className="text-sm font-semibold">{s.title}</h3>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 glass-card p-4 max-w-lg mx-auto">
                <p className="text-xs text-[var(--color-text-muted)]">
                  💡 <strong className="text-[#25D366]">Tip:</strong> You can skip setup and explore the dashboard with demo data. No API keys required!
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Ready */}
          {currentStep === 3 && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#22c55e]/20"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-4xl font-bold mb-3">You&apos;re All Set!</h1>
              <p className="text-lg text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
                Your WhatsApp Business Assistant is ready. Create an account or sign in to access your dashboard.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/register")}
                  className="px-8 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-[#25D366]/25 transition-all w-full sm:w-auto justify-center"
                >
                  Create Account <ArrowRight className="w-5 h-5" />
                </motion.button>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-[var(--color-surface-light)] border border-[var(--color-border)] text-white rounded-xl font-medium flex items-center gap-2 hover:border-[#25D366]/50 transition-all w-full sm:w-auto justify-center"
                >
                  Sign In
                </Link>
              </div>

              <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 text-sm text-[var(--color-text-muted)] hover:text-[#25D366] transition-colors"
              >
                Skip → Explore with demo data
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-lighter)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < steps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#25D366]/25 transition-all"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
