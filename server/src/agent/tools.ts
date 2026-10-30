import {tool} from "langchain";
import { z } from "zod";
import { ListOrdersQuery } from "../validation/order.schema.js";
import { listOrders } from "../services/orderService.js";


export const  listOrdersTool = tool(
    async (filters) => {
        try{

            const orders = await listOrders(filters);
            if(orders.length === 0){
                return "No orders match these filters."
            }
            const summary = orders.map((o) =>({
                
                    id: o.id,
                    customer: o.customer.name,
                    dueDate:o.dueDate,
                    status:o.status,
                    items:o.items.map((i)=> `${i.quantity} ${i.unit ?? ""} ${i.name}`),
                    priority:o.priority?.level,
                    reasons:o.priority?.reasons ?? []
                
            }));

            return JSON.stringify(summary);


        } catch (err) {
            return `Error: listordersTool failed:${err instanceof Error ? err.message:String(err)}`

        }

    },
    {
        name:"list_orders",
        description:"Returns the shop’s orders with order id, customer name, items, due date, status and priority (level + reasons), sorted by due date. Optional filters: due can be today (India time), overdue (past due, not delivered or cancelled) or upcoming (after today); status can be new, in_progress, ready, delivered or cancelled. No filters returns all orders. Use it for questions about what is due, late, pending, ready or most urgent.",
        schema:ListOrdersQuery.describe("today = due today, India time"),
    }

)