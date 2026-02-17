import express from "express";
import * as orderController from "../controller/order.controller";

const router = express.Router();

router.post("/create-order", orderController.createOrder);
router.get("/orders", orderController.orders);

export default router;
