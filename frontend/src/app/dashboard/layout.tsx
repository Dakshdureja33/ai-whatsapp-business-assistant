"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, MessageCircle, Users, HelpCircle,
  Package, Zap, Settings, ChevronLeft, ChevronRight,
  Bot, LogOut, Bell
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Analytics" },
  { href: "/dashboard/conversations", icon: MessageCircle, label: "Conversations" },
  { href: "/dashboard/leads", icon: Users, label: "Leads" },
  { href: "/dashboard/faqs", icon: HelpCircle, label: "Knowledge Base" },
  { href: "/dashboard/orders", icon: Package, label: "Orders" },
  { href: "/dashboard/workflows", icon: Zap, label: "Workflows" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Show nothing while checking auth state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center animate-pulse">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.full_name || "Admin";
  const displayInitial = displayName[0]?.toUpperCase() || "A";
  const displayEmail = user?.email || "admin@wa.com";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-light)]"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--color-border)]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="text-sm font-bold gradient-text whitespace-nowrap">WA Assistant</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">Business Dashboard</div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-[#25D366]/10 text-[#25D366]"
                    : "text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-lighter)]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#25D366] rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#25D366]" : ""}`} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-[var(--color-surface-lighter)] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[var(--color-surface-lighter)] border border-[var(--color-border)] rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* User section */}
        <div className="border-t border-[var(--color-border)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0668E1] to-[#25D366] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {displayInitial}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">{displayName}</div>
                <div className="text-[10px] text-[var(--color-text-muted)] truncate">{displayEmail}</div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-[#ef4444]/10 text-[var(--color-text-muted)] hover:text-[#ef4444] transition-colors group relative"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--color-surface-lighter)] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  Sign Out
                </div>
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleLogout}
              className="mt-2 w-full p-1.5 rounded-lg hover:bg-[#ef4444]/10 text-[var(--color-text-muted)] hover:text-[#ef4444] transition-colors flex items-center justify-center group relative"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[var(--color-surface-lighter)] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                Sign Out
              </div>
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-light)]">
          <div>
            <h1 className="text-lg font-semibold">
              {navItems.find(i => i.href === pathname || (i.href !== "/dashboard" && pathname.startsWith(i.href)))?.label || "Dashboard"}
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">WhatsApp Business Assistant</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-[var(--color-surface-lighter)] transition-colors">
              <Bell className="w-5 h-5 text-[var(--color-text-muted)]" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#25D366] rounded-full animate-pulse-dot" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl text-xs">
              <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse-dot" />
              <span className="text-[var(--color-text-muted)]">AI Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
