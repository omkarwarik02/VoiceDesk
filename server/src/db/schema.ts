import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  boolean,
  date,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { time } from "node:console";


export const orderStatus = pgEnum("order_status", [
  "new",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
]);

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId:text("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  isVip: boolean("is_vip").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId:text("user_id").notNull(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  dueDate: date("due_date"),
  amount: integer("amount"),
  advancePaid: integer("advance_paid").notNull().default(0),
  isUrgent: boolean("is_urgent").notNull().default(false),
  status: orderStatus("status").notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit"),
});

export const agentThreads = pgTable("agent_threads",{
threadId:uuid("thread_id").primaryKey(),
userId:text("user_id").notNull(),
createdAt:timestamp("created_at").defaultNow().notNull(),
})
