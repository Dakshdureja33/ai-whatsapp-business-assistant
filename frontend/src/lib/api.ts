import type {
  AnalyticsOverview, Contact, Conversation, DailyMetric,
  FAQ, LeadBreakdown, Order, Workflow
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Analytics
export const getAnalyticsOverview = () => fetchAPI<AnalyticsOverview>("/analytics/overview");
export const getDailyMetrics = (days = 30) => fetchAPI<DailyMetric[]>(`/analytics/daily?days=${days}`);
export const getLeadBreakdown = () => fetchAPI<LeadBreakdown[]>("/analytics/lead-breakdown");

// Conversations
export const getConversations = (status?: string) =>
  fetchAPI<Conversation[]>(`/conversations${status ? `?status=${status}` : ""}`);
export const getConversation = (id: string) =>
  fetchAPI<Conversation>(`/conversations/${id}`);
export const sendAdminMessage = (id: string, content: string) =>
  fetchAPI<unknown>(`/conversations/${id}/messages`, {
    method: "POST",
    body: JSON.stringify({ conversation_id: id, content }),
  });
export const updateConversation = (id: string, data: Record<string, unknown>) =>
  fetchAPI<Conversation>(`/conversations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// Contacts / Leads
export const getContacts = (status?: string, search?: string) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  return fetchAPI<Contact[]>(`/contacts?${params.toString()}`);
};
export const updateContact = (id: string, data: Record<string, unknown>) =>
  fetchAPI<Contact>(`/contacts/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// FAQs
export const getFAQs = () => fetchAPI<FAQ[]>("/faqs");
export const createFAQ = (data: { question: string; answer: string; category?: string; keywords?: string[] }) =>
  fetchAPI<FAQ>("/faqs", { method: "POST", body: JSON.stringify(data) });
export const updateFAQ = (id: string, data: Record<string, unknown>) =>
  fetchAPI<FAQ>(`/faqs/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteFAQ = (id: string) =>
  fetchAPI<unknown>(`/faqs/${id}`, { method: "DELETE" });

// Orders
export const getOrders = () => fetchAPI<Order[]>("/orders");

// Workflows
export const getWorkflows = () => fetchAPI<Workflow[]>("/workflows");
export const createWorkflow = (data: Record<string, unknown>) =>
  fetchAPI<Workflow>("/workflows", { method: "POST", body: JSON.stringify(data) });
export const updateWorkflow = (id: string, data: Record<string, unknown>) =>
  fetchAPI<Workflow>(`/workflows/${id}`, { method: "PATCH", body: JSON.stringify(data) });
