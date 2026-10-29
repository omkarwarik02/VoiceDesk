import { Router } from "express";
import { createOrderHandler, listOrdersHandler } from "../controllers/orderController.js";

export const orderRouter = Router();

orderRouter.post("/", createOrderHandler);
orderRouter.get("/", listOrdersHandler);