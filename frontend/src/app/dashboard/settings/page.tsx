"use client";

import { motion } from "framer-motion";
import {
  Settings, Globe, Key, Bot, Bell, Shield,
  Webhook, Server, Database, ExternalLink
} from "lucide-react";

const sections = [
  {
    title: "WhatsApp Cloud API",
    icon: Globe,
    color: "#25D366",
    fields: [
      { label: "Phone Number ID", value: "••••••4567", type: "text" },
      { label: "Business Account ID", value: "••••••8901", type: "text" },
      { label: "Access Token", value: "••••••••••••••••", type: "password" },
      { label: "Verify Token", value: "whatsapp_verify_token_2024", type: "text" },
    ],
  },
  {
    title: "Meta App Configuration",
    icon: Shield,
    color: "#0668E1",
    fields: [
      { label: "App ID", value: "••••••2345", type: "text" },
      { label: "App Secret", value: "••••••••••••", type: "password" },
      { label: "API Version", value: "v21.0", type: "text" },
    ],
  },
  {
    title: "Groq AI (Llama 3.3)",
    icon: Bot,
    color: "#8b5cf6",
    fields: [
      { label: "API Key", value: "gsk_••••••••••••", type: "password" },
      { label: "Model", value: "llama-3.3-70b-versatile", type: "text" },
      { label: "Temperature", value: "0.7", type: "text" },
      { label: "Max Tokens", value: "1024", type: "text" },
    ],
  },
  {
    title: "Business Information",
    icon: Settings,
    color: "#f59e0b",
    fields: [
      { label: "Business Name", value: "TechStore Pro", type: "text" },
      { label: "Business Hours", value: "9:00 AM - 6:00 PM", type: "text" },
      { label: "Timezone", value: "Asia/Kolkata", type: "text" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Configure WhatsApp Cloud API, AI model, and business settings
        </p>
      </div>

      {/* Webhook URL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 flex items-center justify-center">
            <Webhook className="w-5 h-5 text-[#06b6d4]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Webhook Configuration</h3>
            <p className="text-[10px] text-[var(--color-text-muted)]">Set this URL in your Meta App Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm font-mono text-[#25D366]">
            https://your-domain.com/api/webhook
          </div>
          <button className="px-4 py-3 bg-[var(--color-surface-lighter)] border border-[var(--color-border)] rounded-xl text-sm hover:border-[#25D366]/50 transition-colors">
            Copy
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Server className="w-3.5 h-3.5" />
          <span>Status:</span>
          <span className="flex items-center gap-1 text-[#22c55e]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse-dot" />
            Connected
          </span>
        </div>
      </motion.div>

      {/* Settings Sections */}
      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (i + 1) * 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${section.color}15` }}>
              <section.icon className="w-5 h-5" style={{ color: section.color }} />
            </div>
            <h3 className="text-sm font-semibold">{section.title}</h3>
          </div>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.label} className="grid grid-cols-3 gap-4 items-center">
                <label className="text-sm text-[var(--color-text-muted)]">{field.label}</label>
                <div className="col-span-2">
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold mb-4">Meta Developer Resources</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Meta App Dashboard", url: "https://developers.facebook.com" },
            { label: "WhatsApp Cloud API Docs", url: "https://developers.facebook.com/docs/whatsapp/cloud-api" },
            { label: "Webhook Setup Guide", url: "https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks" },
            { label: "Groq Console", url: "https://console.groq.com" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] rounded-xl text-sm hover:bg-[var(--color-surface-lighter)] transition-colors group"
            >
              <span>{link.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[#25D366] transition-colors" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#25D366]/20 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}
