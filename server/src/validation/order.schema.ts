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
export const OrderStatus = z.enum(["new", "in_progress", "ready", "delivered", "cancelled"]);

export const ListOrdersQuery = z.object({
    status:OrderStatus.optional(),
    due:z.enum(["today", "overdue", "upcoming"]).optional(),
});

export const OrderIdParams = z.object({
    id:z.coerce.number().int().positive(),
});

export const UpdateStatusInput = z.object({
    status:OrderStatus,
})

export type OrderStatusValue = z.infer<typeof OrderStatus>;
export type ListOrdersQuery = z.infer<typeof ListOrdersQuery>;
export type CreateOrderInput = z.infer<typeof createOrderInput>;