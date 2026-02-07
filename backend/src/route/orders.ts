import express from "express";
import * as orderController from "../controller/order.controller";

const router = express.Router();

router.post("/create-order", orderController.createOrder);
router.put("/update-order", orderController.updateOrder);
router.get("/orders", orderController.orders);
