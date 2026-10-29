import { ilike } from "drizzle-orm";
import { db } from "../db/client.js";
import { customers, orders, orderItems } from "../db/schema.js";
import type { CreateOrderInput } from "../validation/order.schema.js";

export async function createOrder(input:CreateOrderInput){
    return db.transaction(async(tx) =>{
        let[customer] = await tx
            .select()
            .from(customers)
            .where(ilike(customers.name, input.customerName))
            .limit(1);


            if(!customer){
                [customer] = await tx
                    .insert(customers)
                    .values({name:input.customerName, phone:input.customerPhone ?? null})
                    .returning();
            }
            if(!customer) throw new Error("Could not create customer");


            const [order] = await tx
            .insert(orders)
            .values({
                customerId:customer.id,
                dueDate:input.dueDate ?? null,
                amount:input.amount ?? null,
                advancePaid:input.advancePaid,
                isUrgent:input.isurgent,
                notes:input.notes ?? null,
            })
            .returning();

                if (!order) throw new Error("Could not create order");

                const items = await tx
                .insert(orderItems)
                .values(
                    input.items.map((item)=>({
                        orderId: order.id,
                        name:item.name,
                        quantity:item.quantity,
                        unit:item.unit ?? null,
                    })),
                )
                .returning();

                return { ...order, customer, items};

    })
}