"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bot, User, Send, Phone, MoreVertical,
  CheckCheck, Clock, UserCheck, ArrowLeftRight, MessageCircle,
  Plus, X
} from "lucide-react";
import { mockConversations, mockMessages, mockContacts } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";
import type { Conversation, Message, Contact } from "@/lib/types";

const statusColors: Record<string, string> = {
  ai_handling: "#25D366",
  human_handling: "#3b82f6",
  active: "#f59e0b",
  resolved: "#8b949e",
  archived: "#6b7280",
};

const statusLabels: Record<string, string> = {
  ai_handling: "AI Handling",
  human_handling: "Human",
  active: "Active",
  resolved: "Resolved",
  archived: "Archived",
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showNewConvModal, setShowNewConvModal] = useState(false);
  const [newConvSearch, setNewConvSearch] = useState("");
  const [newConvMessage, setNewConvMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredConvs = conversations.filter((c) => {
    const matchSearch =
      !searchQuery ||
      c.contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact?.phone_number.includes(searchQuery);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredContacts = mockContacts.filter(
    (c) =>
      !newConvSearch ||
      c.name?.toLowerCase().includes(newConvSearch.toLowerCase()) ||
      c.phone_number.includes(newConvSearch)
  );

  const handleSend = () => {
    if (!messageInput.trim() || !selectedConv) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: selectedConv.id,
      whatsapp_message_id: null,
      direction: "outbound",
      message_type: "text",
      content: messageInput,
      is_ai_generated: false,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setMessageInput("");
  };

  const handleCreateConversation = () => {
    if (!selectedContact) return;

    // Check if conversation already exists
    const existing = conversations.find(
      (c) => c.contact_id === selectedContact.id
    );
    if (existing) {
      setSelectedConv(existing);
      setShowNewConvModal(false);
      resetNewConvForm();
      return;
    }

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      contact_id: selectedContact.id,
      status: "ai_handling",
      subject: null,
      is_ai_enabled: true,
      message_count: newConvMessage ? 1 : 0,
      last_message_preview: newConvMessage || "New conversation started",
      started_at: new Date().toISOString(),
      resolved_at: null,
      created_at: new Date().toISOString(),
      contact: selectedContact,
    };

    const updatedConvs = [newConv, ...conversations];
    setConversations(updatedConvs);

    if (newConvMessage.trim()) {
      const msg: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: newConv.id,
        whatsapp_message_id: null,
        direction: "outbound",
        message_type: "text",
        content: newConvMessage,
        is_ai_generated: false,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, msg]);
    }

    setSelectedConv(newConv);
    setShowNewConvModal(false);
    resetNewConvForm();
  };

  const resetNewConvForm = () => {
    setNewConvSearch("");
    setNewConvMessage("");
    setSelectedContact(null);
  };

  return (
    <div className="flex h-[calc(100vh-130px)] gap-4">
      {/* Conversation List */}
      <div className="w-96 flex flex-col glass-card overflow-hidden">
        {/* Search + New */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 transition-colors"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewConvModal(true)}
              className="p-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl hover:shadow-lg hover:shadow-[#25D366]/20 transition-shadow flex-shrink-0"
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["all", "ai_handling", "human_handling", "resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filterStatus === s
                    ? "bg-[#25D366]/10 text-[#25D366]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)]"
                }`}
              >
                {s === "all" ? "All" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map((conv) => (
            <motion.button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              whileHover={{ backgroundColor: "rgba(37, 211, 102, 0.05)" }}
              className={`w-full flex items-start gap-3 p-4 border-b border-[var(--color-border)] text-left transition-colors ${
                selectedConv?.id === conv.id ? "bg-[#25D366]/5" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/20 flex items-center justify-center text-sm font-bold text-[#25D366]">
                  {conv.contact?.name?.[0] || "?"}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-surface-light)]"
                  style={{ background: statusColors[conv.status] }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{conv.contact?.name || "Unknown"}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {formatTime(conv.created_at)}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                  {conv.last_message_preview}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${statusColors[conv.status]}15`,
                      color: statusColors[conv.status],
                    }}
                  >
                    {conv.status === "ai_handling" && <Bot className="w-3 h-3 inline mr-1" />}
                    {statusLabels[conv.status]}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {conv.message_count} msgs
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/20 flex items-center justify-center text-sm font-bold text-[#25D366]">
                  {selectedConv.contact?.name?.[0] || "?"}
                </div>
                <div>
                  <div className="text-sm font-semibold">{selectedConv.contact?.name || "Unknown"}</div>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <Phone className="w-3 h-3" />
                    {selectedConv.contact?.phone_number}
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px]"
                      style={{
                        background: `${statusColors[selectedConv.status]}15`,
                        color: statusColors[selectedConv.status],
                      }}
                    >
                      {statusLabels[selectedConv.status]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-[var(--color-surface-lighter)] transition-colors text-[var(--color-text-muted)] hover:text-white group relative">
                  <ArrowLeftRight className="w-4 h-4" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-[var(--color-surface-lighter)] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    Toggle AI/Human
                  </span>
                </button>
                <button className="p-2 rounded-xl hover:bg-[var(--color-surface-lighter)] transition-colors text-[var(--color-text-muted)] hover:text-white group relative">
                  <UserCheck className="w-4 h-4" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-[var(--color-surface-lighter)] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    Mark Converted
                  </span>
                </button>
                <button className="p-2 rounded-xl hover:bg-[var(--color-surface-lighter)] transition-colors text-[var(--color-text-muted)] hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages
                  .filter((m) => m.conversation_id === selectedConv.id)
                  .map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${msg.direction === "outbound" ? "order-2" : ""}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                          msg.direction === "outbound"
                            ? "bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-br-md"
                            : "bg-[var(--color-surface-lighter)] rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1.5 mt-1 text-[10px] text-[var(--color-text-muted)] ${msg.direction === "outbound" ? "justify-end" : ""}`}>
                        {msg.is_ai_generated && (
                          <span className="flex items-center gap-0.5 text-[#25D366]">
                            <Bot className="w-3 h-3" /> AI
                          </span>
                        )}
                        <Clock className="w-3 h-3" />
                        {formatTime(msg.created_at)}
                        {msg.direction === "outbound" && <CheckCheck className="w-3 h-3 text-[#25D366]" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {messages.filter((m) => m.conversation_id === selectedConv.id).length === 0 && (
                <div className="flex-1 flex items-center justify-center h-full">
                  <div className="text-center text-[var(--color-text-muted)]">
                    <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No messages yet. Send the first message!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="p-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-xl text-white hover:shadow-lg hover:shadow-[#25D366]/20 transition-shadow"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* ────── New Conversation Modal ────── */}
      <AnimatePresence>
        {showNewConvModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => { setShowNewConvModal(false); resetNewConvForm(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md glass-card p-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">New Conversation</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">Start a new WhatsApp chat</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowNewConvModal(false); resetNewConvForm(); }}
                  className="p-2 rounded-xl hover:bg-[var(--color-surface-lighter)] transition-colors text-[var(--color-text-muted)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Contact Selector */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                    Select Contact <span className="text-[#ef4444]">*</span>
                  </label>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={newConvSearch}
                      onChange={(e) => setNewConvSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 transition-colors"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-[var(--color-border)] p-1">
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                          selectedContact?.id === contact.id
                            ? "bg-[#25D366]/10 border border-[#25D366]/30"
                            : "hover:bg-[var(--color-surface-lighter)]"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/20 flex items-center justify-center text-xs font-bold text-[#25D366] flex-shrink-0">
                          {contact.name?.[0] || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{contact.name || "Unknown"}</div>
                          <div className="text-[10px] text-[var(--color-text-muted)]">{contact.phone_number}</div>
                        </div>
                        {selectedContact?.id === contact.id && (
                          <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* First Message */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-muted)] mb-1.5 block">
                    First Message <span className="text-[10px] text-[var(--color-text-muted)]">(optional)</span>
                  </label>
                  <textarea
                    value={newConvMessage}
                    onChange={(e) => setNewConvMessage(e.target.value)}
                    placeholder="Type an initial message to send..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20 transition-all resize-none placeholder:text-[var(--color-text-muted)]/50"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border)]">
                <button
                  onClick={() => { setShowNewConvModal(false); resetNewConvForm(); }}
                  className="px-5 py-2.5 rounded-xl text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-lighter)] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateConversation}
                  disabled={!selectedContact}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#25D366]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Start Chat
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
