import type {
  AnalyticsOverview, Contact, Conversation, DailyMetric,
  FAQ, LeadBreakdown, Message, Order, Workflow
} from "./types";

export const mockAnalytics: AnalyticsOverview = {
  total_contacts: 847,
  new_leads_today: 23,
  active_conversations: 42,
  messages_today: 312,
  conversion_rate: 18.5,
  avg_response_time: 2.3,
  ai_handled_percentage: 87.4,
  total_orders: 156,
};

export const mockDailyMetrics: DailyMetric[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().split("T")[0],
    messages: Math.floor(Math.random() * 200) + 100,
    new_leads: Math.floor(Math.random() * 20) + 5,
    conversations: Math.floor(Math.random() * 30) + 10,
    orders: Math.floor(Math.random() * 10) + 2,
  };
});

export const mockLeadBreakdown: LeadBreakdown[] = [
  { status: "new", count: 234 },
  { status: "contacted", count: 189 },
  { status: "qualified", count: 156 },
  { status: "converted", count: 142 },
  { status: "lost", count: 126 },
];

export const mockContacts: Contact[] = [
  { id: "1", phone_number: "+919876543210", name: "Rahul Sharma", email: "rahul@example.com", company: "TechCorp", lead_status: "qualified", lead_score: 75, tags: ["developer", "premium"], notes: null, first_message_at: "2024-08-01T10:00:00", last_message_at: "2024-09-15T14:30:00", created_at: "2024-08-01T10:00:00" },
  { id: "2", phone_number: "+919876543211", name: "Priya Patel", email: "priya@example.com", company: "DesignHub", lead_status: "converted", lead_score: 95, tags: ["designer", "repeat"], notes: null, first_message_at: "2024-07-15T09:00:00", last_message_at: "2024-09-14T16:00:00", created_at: "2024-07-15T09:00:00" },
  { id: "3", phone_number: "+919876543212", name: "Amit Kumar", email: "amit@example.com", company: "StartupXYZ", lead_status: "new", lead_score: 20, tags: ["startup"], notes: null, first_message_at: "2024-09-10T11:00:00", last_message_at: "2024-09-15T09:00:00", created_at: "2024-09-10T11:00:00" },
  { id: "4", phone_number: "+919876543213", name: "Sneha Gupta", email: "sneha@example.com", company: "RetailMax", lead_status: "contacted", lead_score: 45, tags: ["retail"], notes: null, first_message_at: "2024-08-20T13:00:00", last_message_at: "2024-09-13T10:00:00", created_at: "2024-08-20T13:00:00" },
  { id: "5", phone_number: "+919876543214", name: "Vikram Singh", email: "vikram@example.com", company: null, lead_status: "qualified", lead_score: 60, tags: [], notes: null, first_message_at: "2024-09-05T15:00:00", last_message_at: "2024-09-15T12:00:00", created_at: "2024-09-05T15:00:00" },
  { id: "6", phone_number: "+919876543215", name: "Anita Desai", email: "anita@example.com", company: "MediaPro", lead_status: "new", lead_score: 10, tags: ["media"], notes: null, first_message_at: "2024-09-14T08:00:00", last_message_at: "2024-09-15T11:00:00", created_at: "2024-09-14T08:00:00" },
  { id: "7", phone_number: "+919876543216", name: "Karan Mehta", email: null, company: null, lead_status: "lost", lead_score: 5, tags: [], notes: null, first_message_at: "2024-08-10T10:00:00", last_message_at: "2024-08-25T16:00:00", created_at: "2024-08-10T10:00:00" },
  { id: "8", phone_number: "+919876543217", name: "Deepika Roy", email: "deepika@example.com", company: "EduTech", lead_status: "converted", lead_score: 90, tags: ["education", "premium"], notes: null, first_message_at: "2024-07-20T09:00:00", last_message_at: "2024-09-15T15:00:00", created_at: "2024-07-20T09:00:00" },
];

export const mockMessages: Message[] = [
  { id: "m1", conversation_id: "c1", whatsapp_message_id: null, direction: "inbound", message_type: "text", content: "Hi, I'm looking for a laptop for my office", is_ai_generated: false, is_read: true, created_at: "2024-09-15T10:00:00" },
  { id: "m2", conversation_id: "c1", whatsapp_message_id: null, direction: "outbound", message_type: "text", content: "Hello Rahul! 👋 Welcome to TechStore Pro! I'd be happy to help you find the perfect laptop. What's your budget range and primary use case?", is_ai_generated: true, is_read: true, created_at: "2024-09-15T10:00:05" },
  { id: "m3", conversation_id: "c1", whatsapp_message_id: null, direction: "inbound", message_type: "text", content: "Around 60-70k, mainly for coding and development", is_ai_generated: false, is_read: true, created_at: "2024-09-15T10:01:00" },
  { id: "m4", conversation_id: "c1", whatsapp_message_id: null, direction: "outbound", message_type: "text", content: "Great choice! For coding and development in that range, I'd recommend:\n\n💻 MacBook Air M2 - ₹69,900\n💻 Dell XPS 13 - ₹64,500\n💻 ThinkPad X1 Carbon - ₹67,800\n\nAll come with 16GB RAM and 512GB SSD. Would you like details on any of these?", is_ai_generated: true, is_read: true, created_at: "2024-09-15T10:01:05" },
  { id: "m5", conversation_id: "c1", whatsapp_message_id: null, direction: "inbound", message_type: "text", content: "Tell me more about the MacBook Air M2", is_ai_generated: false, is_read: true, created_at: "2024-09-15T10:02:00" },
  { id: "m6", conversation_id: "c1", whatsapp_message_id: null, direction: "outbound", message_type: "text", content: "The MacBook Air M2 is excellent for developers! 🚀\n\n📱 15.3\" Liquid Retina Display\n⚡ Apple M2 chip (8-core CPU, 10-core GPU)\n🧠 16GB Unified Memory\n💾 512GB SSD\n🔋 18-hour battery life\n📦 Ships in 2-3 business days\n\nWould you like to place an order?", is_ai_generated: true, is_read: false, created_at: "2024-09-15T10:02:05" },
];

export const mockConversations: Conversation[] = [
  { id: "c1", contact_id: "1", status: "ai_handling", subject: "Laptop Inquiry", is_ai_enabled: true, message_count: 6, last_message_preview: "The MacBook Air M2 is excellent for developers! 🚀", started_at: "2024-09-15T10:00:00", resolved_at: null, created_at: "2024-09-15T10:00:00", contact: mockContacts[0], messages: mockMessages },
  { id: "c2", contact_id: "2", status: "resolved", subject: "Order Tracking", is_ai_enabled: true, message_count: 4, last_message_preview: "Your order ORD-20240815 is currently Shipped!", started_at: "2024-09-14T14:00:00", resolved_at: "2024-09-14T15:00:00", created_at: "2024-09-14T14:00:00", contact: mockContacts[1] },
  { id: "c3", contact_id: "3", status: "ai_handling", subject: "Store Information", is_ai_enabled: true, message_count: 4, last_message_preview: "We have some exciting offers right now!", started_at: "2024-09-15T09:00:00", resolved_at: null, created_at: "2024-09-15T09:00:00", contact: mockContacts[2] },
  { id: "c4", contact_id: "4", status: "human_handling", subject: "Product Return", is_ai_enabled: false, message_count: 8, last_message_preview: "Let me check this with our returns team.", started_at: "2024-09-13T10:00:00", resolved_at: null, created_at: "2024-09-13T10:00:00", contact: mockContacts[3] },
  { id: "c5", contact_id: "5", status: "ai_handling", subject: "Pricing Query", is_ai_enabled: true, message_count: 3, last_message_preview: "Here are our latest prices for smartphones.", started_at: "2024-09-15T12:00:00", resolved_at: null, created_at: "2024-09-15T12:00:00", contact: mockContacts[4] },
];

export const mockFAQs: FAQ[] = [
  { id: "f1", question: "What are your business hours?", answer: "We are open Monday to Saturday, 9:00 AM to 6:00 PM IST.", category: "General", keywords: ["hours", "timing", "open"], is_active: true, usage_count: 45, created_at: "2024-08-01T00:00:00" },
  { id: "f2", question: "Do you offer free shipping?", answer: "Yes! We offer free shipping on all orders above ₹2,000.", category: "Shipping", keywords: ["shipping", "delivery", "free"], is_active: true, usage_count: 38, created_at: "2024-08-01T00:00:00" },
  { id: "f3", question: "What is your return policy?", answer: "We offer 30-day hassle-free returns on all products.", category: "Returns", keywords: ["return", "refund", "exchange"], is_active: true, usage_count: 32, created_at: "2024-08-01T00:00:00" },
  { id: "f4", question: "Do you accept EMI payments?", answer: "Yes, we offer EMI options on orders above ₹5,000 through all major banks.", category: "Payment", keywords: ["emi", "payment"], is_active: true, usage_count: 28, created_at: "2024-08-01T00:00:00" },
  { id: "f5", question: "How long does delivery take?", answer: "Standard delivery takes 3-5 business days. Express delivery is available for 1-2 days.", category: "Shipping", keywords: ["delivery", "time"], is_active: true, usage_count: 41, created_at: "2024-08-01T00:00:00" },
  { id: "f6", question: "Do you offer warranty?", answer: "All products come with manufacturer warranty. Extended warranty plans are also available.", category: "Warranty", keywords: ["warranty"], is_active: false, usage_count: 12, created_at: "2024-08-01T00:00:00" },
];

export const mockOrders: Order[] = [
  { id: "o1", order_number: "ORD-20240815", contact_id: "1", status: "shipped", items: [{ name: "MacBook Air M2", quantity: 1, price: 69900 }], total_amount: 69900, currency: "INR", tracking_number: "TRACK123456", estimated_delivery: "2024-09-20T18:00:00", created_at: "2024-08-15T00:00:00" },
  { id: "o2", order_number: "ORD-20240820", contact_id: "2", status: "delivered", items: [{ name: "iPhone 15 Pro", quantity: 1, price: 134900 }], total_amount: 134900, currency: "INR", tracking_number: "TRACK789012", estimated_delivery: "2024-09-01T18:00:00", created_at: "2024-08-20T00:00:00" },
  { id: "o3", order_number: "ORD-20240901", contact_id: "3", status: "processing", items: [{ name: "AirPods Pro", quantity: 2, price: 24900 }], total_amount: 49800, currency: "INR", tracking_number: null, estimated_delivery: "2024-09-25T18:00:00", created_at: "2024-09-01T00:00:00" },
  { id: "o4", order_number: "ORD-20240905", contact_id: "4", status: "pending", items: [{ name: "iPad Air", quantity: 1, price: 59900 }], total_amount: 59900, currency: "INR", tracking_number: null, estimated_delivery: null, created_at: "2024-09-05T00:00:00" },
];

export const mockWorkflows: Workflow[] = [
  { id: "w1", name: "Welcome Message", description: "Send a welcome message to new contacts", trigger: "new_conversation", trigger_config: {}, actions: [{ type: "send_welcome", config: {} }], is_active: true, execution_count: 45, last_executed_at: "2024-09-15T14:30:00", created_at: "2024-08-01T00:00:00" },
  { id: "w2", name: "Lead Capture", description: "Automatically score and tag new leads", trigger: "new_conversation", trigger_config: {}, actions: [{ type: "capture_lead", config: { score_increment: 15, tags: ["new_lead"] } }], is_active: true, execution_count: 38, last_executed_at: "2024-09-15T14:30:00", created_at: "2024-08-01T00:00:00" },
  { id: "w3", name: "After-Hours Auto Reply", description: "Respond when admin is offline", trigger: "admin_offline", trigger_config: {}, actions: [{ type: "auto_reply", config: { message: "Thanks for reaching out! We'll respond within 24 hours. 🙏" } }], is_active: true, execution_count: 22, last_executed_at: "2024-09-15T20:00:00", created_at: "2024-08-01T00:00:00" },
  { id: "w4", name: "Order Confirmation", description: "Send order confirmation messages", trigger: "order_status_change", trigger_config: {}, actions: [{ type: "send_message", config: { message: "Your order has been confirmed!" } }], is_active: false, execution_count: 15, last_executed_at: "2024-09-10T12:00:00", created_at: "2024-08-01T00:00:00" },
  { id: "w5", name: "Follow-up Reminder", description: "Send follow-up to inactive leads", trigger: "scheduled", trigger_config: { interval: "7d" }, actions: [{ type: "send_message", config: { message: "Hi! Just checking in. Is there anything I can help you with?" } }], is_active: true, execution_count: 30, last_executed_at: "2024-09-14T09:00:00", created_at: "2024-08-01T00:00:00" },
];
