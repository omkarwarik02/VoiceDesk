import type { OrderStatusValue } from "../validation/order.schema.js";

export type PriorityLevel = "HIGH" | "MEDIUM" | "LOW";

function daysUntil(date: string, today: string): number {
  return Math.round((Date.parse(date) - Date.parse(today)) / 86_400_000);
}

export function computePriority(
  order: {
    dueDate: string | null;
    status: OrderStatusValue;
    isUrgent: boolean;
    amount: number | null;
    advancePaid: number;
  },
  isVip: boolean,
  today: string,
) {
  if (order.status === "delivered" || order.status === "cancelled") {
    return null;
  }

  let score = 0;
  const reasons: string[] = [];

  if (order.dueDate) {
    const days = daysUntil(order.dueDate, today);
    if (days < 0) {
      score += 50;
      reasons.push("overdue");
    } else if (days === 0) {
      score += 40;
      reasons.push("due today");
    } else if (days <= 3) {
      score += 20;
      reasons.push(`due in ${days} days`);
    } else if (days <= 7) {
      score += 10;
      reasons.push(`due in ${days} days`);
    }
  }

  if (order.isUrgent) {
    score += 15;
    reasons.push("marked urgent");
  }
  if (isVip) {
    score += 10;
    reasons.push("VIP customer");
  }
  if (order.advancePaid > 0) {
    score += 10;
    reasons.push("advance paid");
  }
  if (order.amount !== null && order.amount >= 5000){
    score += 15;
    reasons.push("large order");
  }
  const level: PriorityLevel =
    score >= 60 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

  return { level, score, reasons };
}
