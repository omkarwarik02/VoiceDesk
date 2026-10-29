import { z } from "zod";

export const createOrderInput = z.object({
    customerName:z.string().trim().min(1,"Customer  name is required"),
    customerPhone:z.string().trim().optional(),
    dueDate:z.iso.date().optional(),
    amount:z.number().int().nonnegative().optional(),
    advancePaid:z.number().int().nonnegative().default(0),
    isUrgent:z.boolean().default(false),
    notes:z.string().optional(),
    items:z.array(z.object({
        name:z.string().trim().min(1),
        quantity:z.number().int().positive(),
        unit:z.string().optional(),
    }),
)
    .min(1,"An order needs at least one item")
});

export const ListOrdersQuery = z.object({
    status:z.enum(["new", "in_progress", "ready", "delivered", "cancelled"]).optional(),
    due:z.enum(["today", "overdue", "upcoming"]).optional(),
});

export type ListOrdersQuery = z.infer<typeof ListOrdersQuery>;

export type CreateOrderInput = z.infer<typeof createOrderInput>;