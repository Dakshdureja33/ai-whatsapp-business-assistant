"use client";

import { motion } from "framer-motion";
import {
  Users, MessageCircle, TrendingUp, Package,
  Bot, Clock, Target, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { mockAnalytics, mockDailyMetrics, mockLeadBreakdown } from "@/lib/mock-data";

const statCards = [
  { label: "Total Contacts", value: mockAnalytics.total_contacts, icon: Users, change: "+12%", up: true, color: "#25D366" },
  { label: "Messages Today", value: mockAnalytics.messages_today, icon: MessageCircle, change: "+8%", up: true, color: "#3b82f6" },
  { label: "Active Conversations", value: mockAnalytics.active_conversations, icon: TrendingUp, change: "+5%", up: true, color: "#8b5cf6" },
  { label: "New Leads Today", value: mockAnalytics.new_leads_today, icon: Target, change: "+18%", up: true, color: "#f59e0b" },
  { label: "Conversion Rate", value: `${mockAnalytics.conversion_rate}%`, icon: ArrowUpRight, change: "+2.1%", up: true, color: "#22c55e" },
  { label: "AI Handled", value: `${mockAnalytics.ai_handled_percentage}%`, icon: Bot, change: "+3%", up: true, color: "#06b6d4" },
  { label: "Avg Response", value: `${mockAnalytics.avg_response_time}s`, icon: Clock, change: "-0.5s", up: true, color: "#ec4899" },
  { label: "Total Orders", value: mockAnalytics.total_orders, icon: Package, change: "+7%", up: true, color: "#f97316" },
];

const PIE_COLORS = ["#25D366", "#3b82f6", "#f59e0b", "#22c55e", "#ef4444"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-[var(--color-text-muted)] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5 group cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${card.color}15` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${card.up ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </div>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold">Message Volume</h3>
              <p className="text-xs text-[var(--color-text-muted)]">Last 30 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
                <span className="text-[var(--color-text-muted)]">Messages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span className="text-[var(--color-text-muted)]">Conversations</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockDailyMetrics}>
              <defs>
                <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#25D366" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} stroke="var(--color-text-muted)" fontSize={10} />
              <YAxis stroke="var(--color-text-muted)" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="messages" stroke="#25D366" fill="url(#msgGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="conversations" stroke="#3b82f6" fill="url(#convGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lead Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-base font-semibold mb-1">Lead Breakdown</h3>
          <p className="text-xs text-[var(--color-text-muted)] mb-6">By status</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockLeadBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="count"
              >
                {mockLeadBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {mockLeadBreakdown.map((item, i) => (
              <div key={item.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="capitalize text-[var(--color-text-muted)]">{item.status}</span>
                </div>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* New Leads Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold">New Leads & Orders</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Daily acquisition trend</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockDailyMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} stroke="var(--color-text-muted)" fontSize={10} />
            <YAxis stroke="var(--color-text-muted)" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="new_leads" fill="#25D366" radius={[4, 4, 0, 0]} name="New Leads" />
            <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
