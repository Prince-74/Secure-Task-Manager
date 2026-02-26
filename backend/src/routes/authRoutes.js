import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";
import {
  loginValidation,
  registerValidation,
} from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getCurrentUser);

export default router;

