import type { Request, Response } from "express";
import { z } from "zod";
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
} from "../services/orderService.js";

export async function createOrderHandler(req: Request, res: Response) {
  const parsed = createOrderInput.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ ok: false, error: z.prettifyError(parsed.error) });
    return;
  }

  const order = await createOrder(parsed.data);
  res.status(201).json({ ok: true, order });
}

export async function listOrdersHandler(req: Request, res: Response) {
  const parsed = ListOrdersQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: z.prettifyError(parsed.error) });
    return;
  }

  const orders = await listOrders(parsed.data);
  res.json({ ok: true, count: orders.length, orders });
}

export async function updateOrderStatusHandler(req: Request, res: Response) {
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
  const result = await updateOrderStatus(params.data.id, body.data.status);

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
