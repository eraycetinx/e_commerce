import express from "express";
import * as productController from "../controller/product.controller";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/create-product", auth, productController.createProduct);
router.put("/update-product", auth, productController.updateProduct);
router.delete("/delete-product", auth, productController.deleteProduct);

// kisiler public sayfalara auth olamadan girebilir
router.get("/products", productController.products);
router.get("/product/:uuid", productController.product);

export default router;
