import {
  and,
  asc,
  eq,
  gt,
  inArray,
  lt,
  notInArray,
  type SQL,
  ilike,
} from "drizzle-orm";
import { db } from "../db/client.js";
import { customers, orders, orderItems } from "../db/schema.js";
import type {
  CreateOrderInput,
  ListOrdersQuery,
  OrderStatusValue,
} from "../validation/order.schema.js";
import { todayIST } from "../utils/date.js";

export async function createOrder(input: CreateOrderInput) {
  return db.transaction(async (tx) => {
    let [customer] = await tx
      .select()
      .from(customers)
      .where(ilike(customers.name, input.customerName))
      .limit(1);

    if (!customer) {
      [customer] = await tx
        .insert(customers)
        .values({
          name: input.customerName,
          phone: input.customerPhone ?? null,
        })
        .returning();
    }
    if (!customer) throw new Error("Could not create customer");

    const [order] = await tx
      .insert(orders)
      .values({
        customerId: customer.id,
        dueDate: input.dueDate ?? null,
        amount: input.amount ?? null,
        advancePaid: input.advancePaid,
        isUrgent: input.isUrgent,
        notes: input.notes ?? null,
      })
      .returning();

    if (!order) throw new Error("Could not create order");

    const items = await tx
      .insert(orderItems)
      .values(
        input.items.map((item) => ({
          orderId: order.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit ?? null,
        })),
      )
      .returning();

    return { ...order, customer, items };
  });
}

export async function listOrders(filters: ListOrdersQuery) {
  const today = todayIST();
  const conditions: SQL[] = [];

  if (filters.status) {
    conditions.push(eq(orders.status, filters.status));
  }

  if (filters.due === "today") {
    conditions.push(eq(orders.dueDate, today));
  }
  if (filters.due === "upcoming") {
    conditions.push(gt(orders.dueDate, today));
  }
  if (filters.due === "overdue") {
    conditions.push(lt(orders.dueDate, today));
    conditions.push(notInArray(orders.status, ["delivered", "cancelled"]));
  }

  const rows = await db
    .select({ order: orders, customer: customers })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(and(...conditions))
    .orderBy(asc(orders.dueDate));

  if (rows.length === 0) return [];

  const orderIds = rows.map((row) => row.order.id);
  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  return rows.map((row) => ({
    ...row.order,
    customer: row.customer,
    items: items.filter(
      (item: typeof orderItems.$inferSelect) => item.orderId === row.order.id,
    ),
  }));
}

const ALLOWED_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  new: ["in_progress", "cancelled"],
  in_progress: ["ready", "cancelled"],
  ready: ["delivered", "in_progress"],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(
  id: number,
  newStatus: OrderStatusValue,
) {
  const [existing] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!existing) {
    return { ok: false, code: "NOT_FOUND" as const };
  }

  const allowed = ALLOWED_TRANSITIONS[existing.status];
  if (!allowed.includes(newStatus)) {
    return {
      ok: false as const,
      code: "NOT_FOUND" as const,
      from: existing.status,
    };
  }

  const [updated] = await db
    .update(orders)
    .set({ status: newStatus })
    .where(eq(orders.id, id))
    .returning();

  return { ok: true as const, order: updated };
}
