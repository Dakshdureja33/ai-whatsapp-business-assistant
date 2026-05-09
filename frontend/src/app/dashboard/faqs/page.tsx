"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, HelpCircle, Tag,
  ChevronDown, ChevronUp, BarChart3, X, Check
} from "lucide-react";
import { mockFAQs } from "@/lib/mock-data";
import type { FAQ } from "@/lib/types";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", category: "", keywords: "" });

  const filtered = faqs.filter(
    (f) => !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(faqs.map((f) => f.category).filter(Boolean))];

  const handleAdd = () => {
    if (!newFaq.question || !newFaq.answer) return;
    const faq: FAQ = {
      id: `f-${Date.now()}`,
      question: newFaq.question,
      answer: newFaq.answer,
      category: newFaq.category || null,
      keywords: newFaq.keywords ? newFaq.keywords.split(",").map((k) => k.trim()) : [],
      is_active: true,
      usage_count: 0,
      created_at: new Date().toISOString(),
    };
    setFaqs([faq, ...faqs]);
    setNewFaq({ question: "", answer: "", category: "", keywords: "" });
    setShowAddForm(false);
  };

  const toggleActive = (id: string) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, is_active: !f.is_active } : f)));
  };

  const deleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">FAQ Knowledge Base</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            AI uses these FAQs to generate accurate responses • {faqs.length} entries
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#25D366]/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {/* Search & Categories */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <span key={cat} className="px-3 py-1.5 glass-card text-xs text-[var(--color-text-muted)]">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Add New FAQ</h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-[var(--color-surface-lighter)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid gap-4">
              <input
                placeholder="Question"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                className="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50"
              />
              <textarea
                placeholder="Answer"
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                rows={3}
                className="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 resize-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Category (e.g., Shipping)"
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50"
                />
                <input
                  placeholder="Keywords (comma separated)"
                  value={newFaq.keywords}
                  onChange={(e) => setNewFaq({ ...newFaq, keywords: e.target.value })}
                  className="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50"
                />
              </div>
              <button
                onClick={handleAdd}
                className="px-6 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-medium w-fit hover:shadow-lg transition-all"
              >
                Save FAQ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ List */}
      <div className="space-y-3">
        {filtered.map((faq, i) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`glass-card overflow-hidden transition-all ${!faq.is_active ? "opacity-50" : ""}`}
          >
            <button
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                <HelpCircle className="w-5 h-5 text-[#25D366] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{faq.question}</div>
                  <div className="flex items-center gap-3 mt-1">
                    {faq.category && (
                      <span className="text-[10px] px-2 py-0.5 bg-[var(--color-surface)] rounded-full text-[var(--color-text-muted)]">
                        {faq.category}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" /> {faq.usage_count} uses
                    </span>
                  </div>
                </div>
              </div>
              {expandedId === faq.id ? (
                <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
              )}
            </button>

            <AnimatePresence>
              {expandedId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-[var(--color-border)] pt-4">
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">{faq.answer}</p>

                    {faq.keywords.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <Tag className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                        {faq.keywords.map((k) => (
                          <span key={k} className="text-[10px] px-2 py-0.5 bg-[#25D366]/10 text-[#25D366] rounded-full">
                            {k}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(faq.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          faq.is_active
                            ? "bg-[#22c55e]/10 text-[#22c55e]"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        <Check className="w-3 h-3" /> {faq.is_active ? "Active" : "Inactive"}
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)] transition-colors">
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
