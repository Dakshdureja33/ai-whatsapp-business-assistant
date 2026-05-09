// ──────────────────────────────────────────
// TypeScript types matching the backend schemas
// ──────────────────────────────────────────

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type ConversationStatus = "active" | "ai_handling" | "human_handling" | "resolved" | "archived";
export type MessageDirection = "inbound" | "outbound";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type WorkflowTrigger = "new_conversation" | "keyword" | "scheduled" | "admin_offline" | "order_status_change";

export interface Contact {
  id: string;
  phone_number: string;
  name: string | null;
  email: string | null;
  company: string | null;
  lead_status: LeadStatus;
  lead_score: number;
  tags: string[];
  notes: string | null;
  first_message_at: string;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  whatsapp_message_id: string | null;
  direction: MessageDirection;
  message_type: string;
  content: string;
  is_ai_generated: boolean;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  contact_id: string;
  status: ConversationStatus;
  subject: string | null;
  is_ai_enabled: boolean;
  message_count: number;
  last_message_preview: string | null;
  started_at: string;
  resolved_at: string | null;
  created_at: string;
  contact: Contact | null;
  messages?: Message[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  keywords: string[];
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  contact_id: string;
  status: OrderStatus;
  items: { name: string; quantity: number; price: number }[];
  total_amount: number;
  currency: string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  created_at: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  trigger: WorkflowTrigger;
  trigger_config: Record<string, unknown>;
  actions: { type: string; config: Record<string, unknown> }[];
  is_active: boolean;
  execution_count: number;
  last_executed_at: string | null;
  created_at: string;
}

export interface AnalyticsOverview {
  total_contacts: number;
  new_leads_today: number;
  active_conversations: number;
  messages_today: number;
  conversion_rate: number;
  avg_response_time: number;
  ai_handled_percentage: number;
  total_orders: number;
}

export interface DailyMetric {
  date: string;
  messages: number;
  new_leads: number;
  conversations: number;
  orders: number;
}

export interface LeadBreakdown {
  status: string;
  count: number;
}
