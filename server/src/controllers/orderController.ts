import type { Request, Response } from "express";
import { z } from "zod";
import { createOrderInput ,ListOrdersQuery } from "../validation/order.schema.js";
import { createOrder,listOrders } from "../services/orderService.js";



export async function createOrderHandler(req:Request, res:Response){
    const parsed = createOrderInput.safeParse(req.body);

    if(!parsed.success){
        res.status(400).json({ok:false, error:z.prettifyError(parsed.error)});
        return;
    }

    const order = await createOrder(parsed.data);
    res.status(201).json({ok:true, order});
}

export async function listOrdersHandler(req:Request, res:Response){
    const parsed = ListOrdersQuery.safeParse(req.query);
    if(!parsed.success){
        res.status(400).json({ok:false, error:z.prettifyError(parsed.error)});
        return;
    }

    const orders = await listOrders(parsed.data);
    res.json({ok:true, count:orders.length, orders});
}