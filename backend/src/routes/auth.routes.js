import express from "express";
import {
  register,
  login,
  refreshTokenHandler,
  getMe,
  logout,
} from "../controllers/auth.controllers.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authenticate } from "../middleware.js/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh-token", refreshTokenHandler);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

export default router;
