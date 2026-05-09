"use client";

import { motion } from "framer-motion";
import {
  Package, Truck, CheckCircle2, Clock, XCircle,
  MapPin, Hash, DollarSign, Calendar
} from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const statusConfig: Record<string, { color: string; icon: typeof Package; label: string }> = {
  pending: { color: "#f59e0b", icon: Clock, label: "Pending" },
  confirmed: { color: "#3b82f6", icon: CheckCircle2, label: "Confirmed" },
  processing: { color: "#8b5cf6", icon: Package, label: "Processing" },
  shipped: { color: "#06b6d4", icon: Truck, label: "Shipped" },
  delivered: { color: "#22c55e", icon: CheckCircle2, label: "Delivered" },
  cancelled: { color: "#ef4444", icon: XCircle, label: "Cancelled" },
};

const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-4">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors ${
              i <= currentIdx ? "bg-[#25D366]" : "bg-[var(--color-border)]"
            }`}
          />
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 ${i < currentIdx ? "bg-[#25D366]" : "bg-[var(--color-border)]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Order Tracking</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Simulated orders for WhatsApp order status queries • {mockOrders.length} orders
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {mockOrders.map((order, i) => {
          const cfg = statusConfig[order.status];
          const StatusIcon = cfg.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${cfg.color}15` }}>
                    <StatusIcon className="w-5 h-5" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      <span className="text-sm font-semibold">{order.order_number}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{order.total_amount.toLocaleString()}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">{order.currency}</div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between text-xs p-2 bg-[var(--color-surface)] rounded-lg">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="text-[var(--color-text-muted)]">₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs text-[var(--color-text-muted)]">
                {order.tracking_number && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Tracking: {order.tracking_number}</span>
                  </div>
                )}
                {order.estimated_delivery && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Est. Delivery: {formatDate(order.estimated_delivery)}</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {order.status !== "cancelled" && <OrderTimeline status={order.status} />}
              <div className="flex justify-between mt-1">
                {steps.map((s) => (
                  <span key={s} className="text-[8px] text-[var(--color-text-muted)] capitalize">{s}</span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
