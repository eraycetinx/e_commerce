import express from "express";
import * as userController from "../controller/user.controller";

const router = express.Router();

router.put("/update-profile", userController.updateProfile);
router.get("/profile/:username", userController.profile);
router.delete("/delete-user", userController.deleteUser);

export default router;
