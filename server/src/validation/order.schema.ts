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

export const ResumeDecision = z.discriminatedUnion("action",[
    z.object({ action:z.literal("approve")}),
    z.object({action:z.literal("cancel")}),
    z.object({action:z.literal("edit"),draft:(createOrderInput)})
])
export const OrderStatus = z.enum(["new", "in_progress", "ready", "delivered", "cancelled"]);

export const ListOrdersQuery = z.object({
    status:OrderStatus.optional(),
    due:z.enum(["today", "overdue", "upcoming"]).optional(),
    customer:z.string().trim().min(1).optional(),
});
export const ListOrdersToolInput = z.object({
    status:OrderStatus.nullish(),
    due:z.enum(["today", "overdue", "upcoming"]).nullish(),
     customer: z.string().nullish(),
});

export const OrderIdParams = z.object({
    id:z.coerce.number().int().positive(),
});

export const UpdateStatusInput = z.object({
    status:OrderStatus,
})

export const CreateOrderToolInput = z.object({
       customerName:z.string().trim(),
    customerPhone:z.string().trim().nullish(),
    dueDate:z.string().nullish(),
    amount:z.number().nullish(),
    advancePaid:z.number().nullish(),
    isUrgent:z.boolean().nullish(),
    notes:z.string().nullish(),
    items:z.array(z.object({
        name:z.string().trim(),
        quantity:z.number(),
        unit:z.string().nullish(),
    }))
})
export type ResumeDecision = z.infer<typeof ResumeDecision>;
export type OrderStatusValue = z.infer<typeof OrderStatus>;
export type ListOrdersQuery = z.infer<typeof ListOrdersQuery>;
export type CreateOrderInput = z.infer<typeof createOrderInput>;