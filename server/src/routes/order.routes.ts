import { Router } from "express";
import { createOrderHandler, getOrderHandler, listOrdersHandler,updateOrderStatusHandler } from "../controllers/orderController.js";

export const orderRouter = Router();

orderRouter.post("/", createOrderHandler);
orderRouter.get("/", listOrdersHandler);
orderRouter.patch("/:id/status", updateOrderStatusHandler);
orderRouter.get("/:id",getOrderHandler);