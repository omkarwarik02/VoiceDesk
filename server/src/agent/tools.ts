import {tool} from "langchain";
import { ListOrdersToolInput , OrderIdParams, CreateOrderToolInput, createOrderInput, ResumeDecision } from "../validation/order.schema.js";
import { listOrders, getOrder, createOrder } from "../services/orderService.js";
import { z } from "zod";
import { interrupt, isGraphInterrupt } from "@langchain/langgraph";


export const  listOrdersTool = tool(
    async (input) => {
        try{
            const filters ={
                status:input.status ?? undefined,
                due:input.due ?? undefined,
                customer:input.customer?.trim() || undefined,
            }

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
        schema:ListOrdersToolInput,
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

export const createOrderTool = tool(
    async( input) =>{
        try{

            const draft = {
                customerName:input.customerName,
                customerPhone:input.customerPhone ?? undefined,
                dueDate:input.dueDate ?? undefined,
                amount:input.amount ?? undefined,
                advancePaid:input.advancePaid ?? undefined,
                isUrgent:input.isUrgent ?? undefined,
                notes:input.notes ?? undefined,
                items:input.items.map((item)=>({
                    name:item.name,
                    quantity:item.quantity,
                    unit:item.unit ?? undefined
                })),
            }
            const parsed = createOrderInput.safeParse(draft);
            if(!parsed.success){
                 return `Cannot create the order: ${z.prettifyError(parsed.error)} Ask the user to provide or correct this.`;
            }
            const raw = interrupt({ type:"order_approval", draft:parsed.data});

            const descision = ResumeDecision.safeParse(raw);
            if(!descision.success){
                return "The owner's decision was invalid, so nothing was saved.";
            }
            if(descision.data.action === "cancel"){
                  return "The owner cancelled this order. Nothing was saved.";
            }
            const finalOrder = descision.data.action === "edit" ? descision.data.draft : parsed.data;

            const order = await createOrder(finalOrder);
            return `Order #${order.id} created for ${order.customer.name}`

        }catch(err){
            if(isGraphInterrupt(err)) throw err;
             return `Error: create_order failed: ${err instanceof Error ? err.message : String(err)}`;
        }

    },
{
    name: "create_order",
    description: "Creates a new order for the shop. Calling it shows the owner a draft for approval; the order is saved only after the owner approves (or edits) it, and nothing is saved if they cancel. Only call it when you know the customer name and at least one item with a quantity; if anything required is missing, ask the user first instead of guessing. Convert relative dates (aaj, kal, parso, weekdays) into YYYY-MM-DD using today's date. Set isUrgent to true only if the user says it is urgent (urgent, jaldi, aaj hi). Leave out any field you don't know instead of sending null or a guess. After the tool returns, tell the user the result: the new order number, or that it was cancelled.",
    schema: CreateOrderToolInput,
  },

)















export const VoiceDeskTools = [listOrdersTool,getOrderTool,createOrderTool];