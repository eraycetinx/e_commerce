import express from "express";
import * as commentController from "../controller/comment.controller";

const router = express.Router();

router.post("/create-comment", commentController.createComment);
router.put("/update-comment", commentController.updateComment);
router.delete("/delete-comment", commentController.deleteComment);

router.get("/product-comment", commentController.productComment);
