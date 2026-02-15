import express from "express";
import * as sotreController from "../controller/store.controller";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/create-store", auth, sotreController.createStore);
router.put("/update-store", auth, sotreController.updateStore);
router.delete("/delete-store", auth, sotreController.deleteStore);

// kisiler public sayfalara auth olamadan girebilir
router.get("/stores", sotreController.stores);
router.get("/store/:uuid", sotreController.store);

export default router;
