import express from "express";
import * as commentController from "../controller/comment.controller";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/create-comment", auth, commentController.createComment);
router.delete("/delete-comment", auth, commentController.deleteComment);

router.get("/product-comments", commentController.productComment);

export default router;
