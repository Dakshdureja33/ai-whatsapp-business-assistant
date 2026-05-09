"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle, Mail, Lock, User, Building2,
  Eye, EyeOff, ArrowRight, AlertCircle, Loader2,
  Check, Shield, Zap, Bot
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const benefits = [
  { icon: Bot, text: "AI-powered customer responses" },
  { icon: Zap, text: "Automation workflows" },
  { icon: Shield, text: "Enterprise-grade security" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    company: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return { level: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 1) return { level: 1, label: "Weak", color: "#ef4444" };
    if (score <= 2) return { level: 2, label: "Fair", color: "#f59e0b" };
    if (score <= 3) return { level: 3, label: "Good", color: "#3b82f6" };
    return { level: 4, label: "Strong", color: "#22c55e" };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await register({
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      company: form.company || undefined,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Registration failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0d1525] to-[#0a1a10]" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-[#25D366]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 -right-40 w-[500px] h-[500px] bg-[#128C7E]/5 rounded-full blur-[150px]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Left Panel - Benefits (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative z-10 items-center justify-center p-12">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/20">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#25D366] to-[#128C7E] bg-clip-text text-transparent">
              WA Assistant
            </span>
          </Link>

          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Start automating your
            <span className="block bg-gradient-to-r from-[#25D366] to-[#128C7E] bg-clip-text text-transparent">
              WhatsApp business
            </span>
          </h2>

          <p className="text-[var(--color-text-muted)] mb-10 leading-relaxed">
            Join thousands of businesses using AI to handle customer support,
            capture leads, and manage orders — all through WhatsApp.
          </p>

          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-[#25D366]" />
                </div>
                <span className="text-sm">{b.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["R", "P", "A", "S"].map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/20 border-2 border-[var(--color-surface-light)] flex items-center justify-center text-xs font-bold text-[#25D366]"
                >
                  {letter}
                </div>
              ))}
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">
              <strong className="text-white">2,000+</strong> businesses already using
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-[#25D366] to-[#128C7E] bg-clip-text text-transparent">
                WA Assistant
              </span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Get started with your WhatsApp Business Assistant
            </p>
          </div>

          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl text-sm text-[#ef4444]"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                  Full Name <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-all placeholder:text-[var(--color-text-muted)]/50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                  Work Email <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-all placeholder:text-[var(--color-text-muted)]/50"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Your Company (optional)"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-all placeholder:text-[var(--color-text-muted)]/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                  Password <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-12 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-all placeholder:text-[var(--color-text-muted)]/50"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="flex-1 h-1 rounded-full transition-colors duration-300"
                          style={{
                            background: n <= passwordStrength.level ? passwordStrength.color : "var(--color-border)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] mt-1 block" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                  Confirm Password <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type="password"
                    value={form.confirm_password}
                    onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                    placeholder="Re-enter password"
                    className={`w-full pl-10 pr-10 py-3 bg-[var(--color-surface)] border rounded-xl text-sm focus:outline-none transition-all placeholder:text-[var(--color-text-muted)]/50 ${
                      form.confirm_password && form.confirm_password === form.password
                        ? "border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/20"
                        : form.confirm_password
                        ? "border-[#ef4444]/50 focus:ring-1 focus:ring-[#ef4444]/20"
                        : "border-[var(--color-border)] focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20"
                    }`}
                    autoComplete="new-password"
                  />
                  {form.confirm_password && form.confirm_password === form.password && (
                    <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
                  )}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[var(--color-border)] bg-[var(--color-surface)] accent-[#25D366]"
                />
                <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  I agree to the{" "}
                  <button type="button" className="text-[#25D366] hover:underline">Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" className="text-[#25D366] hover:underline">Privacy Policy</button>
                </span>
              </label>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#25D366]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#25D366] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
