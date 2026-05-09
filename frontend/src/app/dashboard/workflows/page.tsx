"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Play, Pause, Plus, Clock, BarChart3,
  MessageCircle, UserPlus, Bell, Calendar, Settings,
  X, ChevronDown
} from "lucide-react";
import { mockWorkflows } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Workflow, WorkflowTrigger } from "@/lib/types";

const triggerConfig: Record<string, { icon: typeof Zap; color: string; label: string }> = {
  new_conversation: { icon: MessageCircle, color: "#25D366", label: "New Conversation" },
  keyword: { icon: Settings, color: "#3b82f6", label: "Keyword Match" },
  scheduled: { icon: Calendar, color: "#8b5cf6", label: "Scheduled" },
  admin_offline: { icon: Clock, color: "#f59e0b", label: "Admin Offline" },
  order_status_change: { icon: Zap, color: "#06b6d4", label: "Order Status Change" },
};

const triggerOptions: { value: WorkflowTrigger; label: string }[] = [
  { value: "new_conversation", label: "New Conversation" },
  { value: "keyword", label: "Keyword Match" },
  { value: "scheduled", label: "Scheduled" },
  { value: "admin_offline", label: "Admin Offline" },
  { value: "order_status_change", label: "Order Status Change" },
];

const actionOptions = [
  { value: "send_welcome", label: "Send Welcome Message" },
  { value: "send_message", label: "Send Message" },
  { value: "capture_lead", label: "Capture Lead" },
  { value: "auto_reply", label: "Auto Reply" },
  { value: "notify_admin", label: "Notify Admin" },
];

const actionIcons: Record<string, typeof Zap> = {
  send_welcome: MessageCircle,
  send_message: MessageCircle,
  capture_lead: UserPlus,
  auto_reply: Bell,
  notify_admin: Bell,
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [showModal, setShowModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: "new_conversation" as WorkflowTrigger,
    actions: [{ type: "send_welcome", config: {} }],
  });

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map((w) => (w.id === id ? { ...w, is_active: !w.is_active } : w)));
  };

  const handleCreate = () => {
    if (!newWorkflow.name.trim()) return;
    const wf: Workflow = {
      id: `wf-${Date.now()}`,
      name: newWorkflow.name,
      description: newWorkflow.description || null,
      trigger: newWorkflow.trigger,
      trigger_config: {},
      actions: newWorkflow.actions,
      is_active: true,
      execution_count: 0,
      last_executed_at: null,
      created_at: new Date().toISOString(),
    };
    setWorkflows([wf, ...workflows]);
    setShowModal(false);
    setNewWorkflow({
      name: "",
      description: "",
      trigger: "new_conversation",
      actions: [{ type: "send_welcome", config: {} }],
    });
  };

  const addAction = () => {
    setNewWorkflow({
      ...newWorkflow,
      actions: [...newWorkflow.actions, { type: "send_message", config: {} }],
    });
  };

  const removeAction = (idx: number) => {
    if (newWorkflow.actions.length <= 1) return;
    setNewWorkflow({
      ...newWorkflow,
      actions: newWorkflow.actions.filter((_, i) => i !== idx),
    });
  };

  const updateAction = (idx: number, type: string) => {
    const actions = [...newWorkflow.actions];
    actions[idx] = { ...actions[idx], type };
    setNewWorkflow({ ...newWorkflow, actions });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Automation Workflows</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            WhatsApp automation powered by Meta Webhooks • {workflows.length} workflows
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#25D366]/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      {/* Workflows */}
      <div className="space-y-4">
        {workflows.map((wf, i) => {
          const trigger = triggerConfig[wf.trigger];
          const TriggerIcon = trigger?.icon || Zap;
          return (
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card p-6 ${!wf.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${trigger?.color || "#888"}15` }}
                  >
                    <TriggerIcon className="w-6 h-6" style={{ color: trigger?.color || "#888" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      {wf.name}
                      {wf.is_active && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] font-medium">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{wf.description}</p>

                    {/* Trigger */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] text-[var(--color-text-muted)]">TRIGGER:</span>
                      <span
                        className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                        style={{ background: `${trigger?.color || "#888"}15`, color: trigger?.color || "#888" }}
                      >
                        {trigger?.label || wf.trigger}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-[var(--color-text-muted)]">ACTIONS:</span>
                      {wf.actions.map((action, j) => {
                        const ActionIcon = actionIcons[action.type] || Zap;
                        return (
                          <span
                            key={j}
                            className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] flex items-center gap-1"
                          >
                            <ActionIcon className="w-3 h-3" />
                            {action.type.replace(/_/g, " ")}
                          </span>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    <div className="mt-3 flex items-center gap-4 text-[10px] text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" /> {wf.execution_count} executions
                      </span>
                      {wf.last_executed_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Last: {formatDate(wf.last_executed_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    wf.is_active
                      ? "bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20"
                      : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]"
                  }`}
                >
                  {wf.is_active ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Activate
                    </>
                  )}
                </button>
              </div>

              {/* Visual Flow */}
              <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-[10px]">
                  <div className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] flex items-center gap-1.5" style={{ borderColor: trigger?.color }}>
                    <TriggerIcon className="w-3 h-3" style={{ color: trigger?.color }} />
                    <span style={{ color: trigger?.color }}>{trigger?.label}</span>
                  </div>
                  {wf.actions.map((action, j) => {
                    const ActionIcon = actionIcons[action.type] || Zap;
                    return (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-6 h-px bg-[var(--color-border)]" />
                        <div className="text-[var(--color-text-muted)]">→</div>
                        <div className="w-6 h-px bg-[var(--color-border)]" />
                        <div className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] flex items-center gap-1.5 text-[var(--color-text-muted)]">
                          <ActionIcon className="w-3 h-3" />
                          <span>{action.type.replace(/_/g, " ")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ────── Create Workflow Modal ────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg glass-card p-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Create Workflow</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">Set up a new automation</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-[var(--color-surface-lighter)] transition-colors text-[var(--color-text-muted)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                    Workflow Name <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    placeholder="e.g., Welcome New Customers"
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-all placeholder:text-[var(--color-text-muted)]/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    placeholder="Brief description of what this workflow does"
                    rows={2}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-all resize-none placeholder:text-[var(--color-text-muted)]/50"
                  />
                </div>

                {/* Trigger */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                    Trigger Event <span className="text-[#ef4444]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={newWorkflow.trigger}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger: e.target.value as WorkflowTrigger })}
                      className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 appearance-none cursor-pointer"
                    >
                      {triggerOptions.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-[var(--color-text-muted)]">
                      Actions <span className="text-[#ef4444]">*</span>
                    </label>
                    <button
                      onClick={addAction}
                      className="text-xs text-[#25D366] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Action
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newWorkflow.actions.map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--color-text-muted)] w-5 text-right">{idx + 1}.</span>
                        <div className="relative flex-1">
                          <select
                            value={action.type}
                            onChange={(e) => updateAction(idx, e.target.value)}
                            className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 appearance-none cursor-pointer"
                          >
                            {actionOptions.map((a) => (
                              <option key={a.value} value={a.value}>{a.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
                        </div>
                        {newWorkflow.actions.length > 1 && (
                          <button
                            onClick={() => removeAction(idx)}
                            className="p-1.5 rounded-lg hover:bg-[#ef4444]/10 text-[var(--color-text-muted)] hover:text-[#ef4444] transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-muted)] mb-2 uppercase tracking-wider font-medium">Flow Preview</div>
                  <div className="flex items-center gap-2 text-[10px] flex-wrap">
                    <div
                      className="px-3 py-1.5 rounded-lg border flex items-center gap-1.5"
                      style={{ borderColor: triggerConfig[newWorkflow.trigger]?.color, color: triggerConfig[newWorkflow.trigger]?.color }}
                    >
                      {(() => { const T = triggerConfig[newWorkflow.trigger]?.icon || Zap; return <T className="w-3 h-3" />; })()}
                      {triggerConfig[newWorkflow.trigger]?.label}
                    </div>
                    {newWorkflow.actions.map((action, j) => {
                      const AIcon = actionIcons[action.type] || Zap;
                      return (
                        <div key={j} className="flex items-center gap-2">
                          <span className="text-[var(--color-text-muted)]">→</span>
                          <div className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] flex items-center gap-1.5 text-[var(--color-text-muted)]">
                            <AIcon className="w-3 h-3" />
                            {action.type.replace(/_/g, " ")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={!newWorkflow.name.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#25D366]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Workflow
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
