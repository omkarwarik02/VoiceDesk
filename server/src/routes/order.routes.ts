import { Router } from "express";
import { createOrderHandler } from "../controllers/orderController.js";

export const orderRouter = Router();

orderRouter.post("/", createOrderHandler);
