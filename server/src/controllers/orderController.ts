import type { Request, Response } from "express";
import { number, z } from "zod";
import {
  createOrderInput,
  ListOrdersQuery,
  OrderIdParams,
  UpdateStatusInput,
} from "../validation/order.schema.js";
import {
  createOrder,
  listOrders,
  updateOrderStatus,
  getOrder
} from "../services/orderService.js";
import getUserId from "../utils/auth.js";





export async function createOrderHandler(req: Request, res: Response) {
  const userId = getUserId(req);
  const parsed = createOrderInput.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ ok: false, error: z.prettifyError(parsed.error) });
    return;
  }

  const order = await createOrder(userId,parsed.data);
  res.status(201).json({ ok: true, order });
}

export async function listOrdersHandler(req: Request, res: Response) {
  const userId = getUserId(req);
  const parsed = ListOrdersQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: z.prettifyError(parsed.error) });
    return;
  }

  const orders = await listOrders(userId,parsed.data);
  res.json({ ok: true, count: orders.length, orders });
}








export async function updateOrderStatusHandler(req: Request, res: Response) {
  const userId = getUserId(req);
  const params = OrderIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ ok: false, error: z.prettifyError(params.error) });
    return;
  }

  const body = UpdateStatusInput.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ ok: false, error: z.prettifyError(body.error) });
    return;
  }
  const result = await updateOrderStatus(userId,params.data.id, body.data.status);

  if (!result.ok) {
    if (result.code === "NOT_FOUND") {
      res
        .status(401)
        .json({ ok: false, error: `Order ${params.data.id} not found` });
      return;
    }
    res.status(400).json({
      ok: false,
      error: `Cannot change order status to "${body.data.status}"`,
    });
    return;
  }
  res.json({ ok: true, order: result.order });
}

export async function getOrderHandler(req:Request,res:Response) {
  const userId = getUserId(req);
const params = OrderIdParams.safeParse(req.params);
if(!params.success){
  res.status(400).json({ok:false, error:z.prettifyError(params.error)});
  return;
}
const result = await getOrder(userId,params.data.id);
if(!result.ok){ 
   res.status(404).json({ok: false, error:`Order ${params.data.id} not found`})
  return;

}
  res.json({ ok: true, order: result.order });

}