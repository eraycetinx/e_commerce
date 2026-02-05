import express from "express";
import * as likeController from "../controller/like.controller";

const router = express.Router();

router.post("/like-comment", likeController.likeComment);
router.post("/unlike-comment", likeController.unlikeComment);
