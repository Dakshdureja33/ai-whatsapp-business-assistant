"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle, Bot, BarChart3, Zap, Shield, Globe,
  ArrowRight, Check, Star, Users, TrendingUp, Phone
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
  }),
};

const features = [
  { icon: Bot, title: "AI-Powered Replies", desc: "Llama 3.3 generates intelligent, context-aware responses to customer queries in real-time.", color: "#25D366" },
  { icon: Zap, title: "Automation Workflows", desc: "Automate welcome messages, lead capture, follow-ups, and order notifications.", color: "#f59e0b" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track leads, conversions, message volume, and AI performance with beautiful charts.", color: "#3b82f6" },
  { icon: MessageCircle, title: "Live Chat Takeover", desc: "Seamlessly switch between AI and human support with full conversation history.", color: "#8b5cf6" },
  { icon: Shield, title: "Meta API Integration", desc: "Built on WhatsApp Cloud API with secure webhook handling and message validation.", color: "#ef4444" },
  { icon: Globe, title: "Multi-Business Ready", desc: "Scale across multiple businesses with isolated data and custom configurations.", color: "#06b6d4" },
];

const stats = [
  { value: "10K+", label: "Messages Processed", icon: MessageCircle },
  { value: "95%", label: "AI Accuracy", icon: Bot },
  { value: "3x", label: "Faster Response", icon: TrendingUp },
  { value: "500+", label: "Active Users", icon: Users },
];

const techStack = [
  "Next.js", "React", "TailwindCSS", "FastAPI", "PostgreSQL",
  "Llama 3.3 (Groq)", "Docker", "WhatsApp Cloud API", "Meta Webhooks",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">WA Assistant</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm">Features</a>
            <a href="#tech" className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm">Tech Stack</a>
            <a href="#demo" className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm">Demo</a>
            <Link href="/login" className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#25D366]/20 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#25D366] opacity-5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0668E1] opacity-5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#128C7E] opacity-5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm">
              <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse-dot" />
              <span className="text-[var(--color-text-muted)]">Powered by Meta WhatsApp Cloud API & Llama 3.3</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-bold leading-tight">
              AI-Powered{" "}
              <span className="gradient-text">WhatsApp</span>
              <br />
              Business Assistant
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
              Automate customer support, capture leads, and manage orders through
              WhatsApp with intelligent AI responses and powerful automation workflows.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-[#25D366]/20 transition-all">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="flex items-center gap-2 px-8 py-4 glass rounded-2xl text-[var(--color-text-muted)] hover:text-white transition-colors font-medium">
                Explore Features
              </a>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 glass-card p-2 max-w-5xl mx-auto"
          >
            <div className="bg-[var(--color-surface)] rounded-xl p-6 min-h-[300px]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span className="ml-4 text-xs text-[var(--color-text-muted)]">WhatsApp Business Assistant — Dashboard</span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="glass-card p-4 text-center"
                  >
                    <s.icon className="w-5 h-5 text-[#25D366] mx-auto mb-2" />
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 glass-card p-4">
                  <div className="text-sm font-medium mb-3">Message Volume</div>
                  <div className="flex items-end gap-1 h-20">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1 + i * 0.05 }}
                        className="flex-1 bg-gradient-to-t from-[#25D366] to-[#128C7E] rounded-sm opacity-80"
                      />
                    ))}
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-sm font-medium mb-3">AI Status</div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse-dot" />
                    <span className="text-sm text-[#22c55e]">Active</span>
                  </div>
                  <div className="text-2xl font-bold">95.2%</div>
                  <div className="text-xs text-[var(--color-text-muted)]">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto">
              Everything you need to automate your WhatsApp business communication
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15` }}
                >
                  <f.icon className="w-7 h-7" style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-32 px-6 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built with <span className="gradient-text-meta">Modern Stack</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg">
              Production-ready technologies for scalable business automation
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 glass-card text-sm font-medium cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Chat */}
      <section id="demo" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              See it in <span className="gradient-text">Action</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg">
              Sample conversation between a customer and the AI assistant
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)] mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">TechStore Pro AI</div>
                <div className="text-xs text-[#25D366] flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse-dot" />
                  Online
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { dir: "in", text: "Hi! I'm looking for a laptop for coding. Budget around ₹70k" },
                { dir: "out", text: "Hello! 👋 Welcome to TechStore Pro! Great choice — here are our top picks for developers:\n\n💻 MacBook Air M2 — ₹69,900\n💻 Dell XPS 13 — ₹64,500\n💻 ThinkPad X1 Carbon — ₹67,800\n\nAll with 16GB RAM & 512GB SSD. Want details on any?" },
                { dir: "in", text: "Tell me about the MacBook Air" },
                { dir: "out", text: "The MacBook Air M2 is perfect for coding! 🚀\n\n📱 15.3\" Liquid Retina Display\n⚡ Apple M2 — 8-core CPU\n🧠 16GB Unified Memory\n💾 512GB SSD\n🔋 18-hour battery\n📦 Ships in 2–3 days\n\nReady to order?" },
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.dir === "in" ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`flex ${msg.dir === "out" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                    msg.dir === "out"
                      ? "bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-br-md"
                      : "bg-[var(--color-surface-lighter)] text-[var(--color-text)] rounded-bl-md"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#25D366] via-[#0668E1] to-[#25D366]" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Automate Your Business?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8 text-lg">
              Start managing your WhatsApp business conversations with AI today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-[#25D366]/20 transition-all">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 glass rounded-2xl text-[var(--color-text-muted)] hover:text-white transition-colors font-medium">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold gradient-text">WA Business Assistant</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
            <span>Built with Meta WhatsApp Cloud API</span>
            <span>•</span>
            <span>Powered by Llama 3.3</span>
          </div>
          <div className="text-sm text-[var(--color-text-muted)]">
            © 2024 WhatsApp Business Assistant
          </div>
        </div>
      </footer>
    </div>
  );
}
