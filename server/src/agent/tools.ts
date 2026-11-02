import {tool} from "langchain";
import { ListOrdersQuery , OrderIdParams } from "../validation/order.schema.js";
import { listOrders, getOrder } from "../services/orderService.js";


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
                    priority:o.priority?.level ?? null,
                    reasons:o.priority?.reasons ?? []
                
            }));

            return JSON.stringify(summary);


        } catch (err) {
            return `Error: list_orders failed:${err instanceof Error ? err.message:String(err)}`

        }

    },
    {
        name:"list_orders",
        description:"Returns the shop's orders with order id, customer name, items, due date, status and priority (level + reasons), sorted by due date. Optional filters: due can be today (India time), overdue (past due, not delivered or cancelled) or upcoming (after today); status can be new, in_progress, ready, delivered or cancelled; customer filters by customer name (partial and case-insensitive, so 'mehta' matches 'Mehta Traders'). No filters returns all orders. Use it for questions about what is due, late, pending, ready, most urgent, or about a specific customer's orders.",
        schema:ListOrdersQuery,
    }

)

export const  getOrderTool = tool(
    async({id}) =>{
        try{
        const result = await getOrder(id);
        if(!result.ok){
            return `Order ${id} not found`;
        }

        const o = result.order;

        const summary = {
             id: o.id,
                    customer: o.customer.name,
                    phone:o.customer.phone,
                    amount:o.amount,
                    advancePaid:o.advancePaid,
                    notes:o.notes,
                    dueDate:o.dueDate,
                    status:o.status,
                    items:o.items.map((i)=> `${i.quantity} ${i.unit ?? ""} ${i.name}`),
                    priority:o.priority?.level ?? null,
                    reasons:o.priority?.reasons ?? []

        }
        return JSON.stringify(summary);
    } catch(err){
         return `Error: get_order failed:${err instanceof Error ? err.message:String(err)}`
    }

    },
    {
        name:"get_order",
        description:"Returns full details of one order by its id: customer name and phone, items, due date, status, amount, advance paid, notes, and priority (level + reasons). Use it when the user asks about one specific order by number, or wants more details about an order found with list_orders.",
        schema:OrderIdParams,
    }
)

export const VoiceDeskTools = [listOrdersTool,getOrderTool];