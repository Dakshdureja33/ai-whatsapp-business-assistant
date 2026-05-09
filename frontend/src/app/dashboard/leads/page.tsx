"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, UserPlus, Mail, Phone, Building2,
  Star, Tag, TrendingUp, MoreHorizontal
} from "lucide-react";
import { mockContacts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  new: { color: "#3b82f6", bg: "#3b82f615", label: "New" },
  contacted: { color: "#f59e0b", bg: "#f59e0b15", label: "Contacted" },
  qualified: { color: "#8b5cf6", bg: "#8b5cf615", label: "Qualified" },
  converted: { color: "#22c55e", bg: "#22c55e15", label: "Converted" },
  lost: { color: "#ef4444", bg: "#ef444415", label: "Lost" },
};

function LeadScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : score >= 25 ? "#3b82f6" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[var(--color-surface)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{score}</span>
    </div>
  );
}

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockContacts.filter((c) => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone_number.includes(search);
    const matchStatus = statusFilter === "all" || c.lead_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Lead Management</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{mockContacts.length} total contacts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#25D366]/20 transition-all">
          <UserPlus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "new", "contacted", "qualified", "converted", "lost"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-[#25D366]/10 text-[#25D366]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]"
              }`}
            >
              {s === "all" ? "All" : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((contact, i) => {
          const status = statusConfig[contact.lead_status];
          return (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/20 flex items-center justify-center text-sm font-bold text-[#25D366]">
                    {contact.name?.[0] || "?"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{contact.name || "Unknown"}</div>
                    <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <Phone className="w-3 h-3" />
                      {contact.phone_number}
                    </div>
                  </div>
                </div>
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {contact.email && (
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <Mail className="w-3.5 h-3.5" /> {contact.email}
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <Building2 className="w-3.5 h-3.5" /> {contact.company}
                  </div>
                )}
              </div>

              {/* Lead Score */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Lead Score
                  </span>
                </div>
                <LeadScoreBar score={contact.lead_score} />
              </div>

              {/* Tags */}
              {contact.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3 h-3 text-[var(--color-text-muted)]" />
                  {contact.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-[var(--color-surface)] rounded-full text-[var(--color-text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Last Active */}
              <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
                <span>Last active: {formatDate(contact.last_message_at)}</span>
                <button className="p-1 rounded-lg hover:bg-[var(--color-surface-lighter)] transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
