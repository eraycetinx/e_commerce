import express from "express";
import * as productController from "../controller/product.controller";

const router = express.Router();

router.post("/create-product", productController.createProduct);
router.put("/update-product", productController.updateProduct);
router.delete("/delete-product", productController.deleteProduct);

router.get("/products", productController.products);
router.get("/product/:uuid", productController.product);

export default router;
