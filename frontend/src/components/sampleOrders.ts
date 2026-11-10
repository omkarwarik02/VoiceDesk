import type { Order } from "../types/agent";

export const sampleOrders: Order[] = [
  {
    id: 4, status: "in_progress", dueDate: "2026-11-09", amount: 1200, advancePaid: 0,
    isUrgent: false, notes: null, createdAt: "2026-11-05T10:00:00Z",
    customer: { id: 4, name: "Desai", phone: null, isVip: false },
    items: [{ id: 7, name: "Stickers", quantity: 500, unit: null }],
    priority: { level: "HIGH", score: 60, reasons: ["overdue", "marked urgent"] },
  },
  {
    id: 5, status: "new", dueDate: "2026-11-11", amount: 800, advancePaid: 0,
    isUrgent: false, notes: null, createdAt: "2026-11-10T10:00:00Z",
    customer: { id: 5, name: "Shah", phone: null, isVip: false },
    items: [{ id: 8, name: "Visiting cards", quantity: 100, unit: null }],
    priority: { level: "MEDIUM", score: 40, reasons: ["due tomorrow", "advance paid"] },
  },
];