import { Router } from "express";
import {
    signupController,
    loginController,
    logoutController,
    getMeController,
    changePasswordController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);

// Protected routes
router.get("/me", authMiddleware, getMeController);
router.patch("/change-password", authMiddleware, changePasswordController);

export const authRoutes = router;
