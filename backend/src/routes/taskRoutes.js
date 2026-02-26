import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import {
  createTaskValidation,
  updateTaskValidation,
  getTasksQueryValidation,
  taskIdParamValidation,
} from "../validators/taskValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// All task routes are protected
router.use(authMiddleware);

router.post("/", createTaskValidation, validateRequest, createTask);
router.get("/", getTasksQueryValidation, validateRequest, getTasks);
router.get("/:id", taskIdParamValidation, validateRequest, getTaskById);
router.put("/:id", updateTaskValidation, validateRequest, updateTask);
router.delete("/:id", taskIdParamValidation, validateRequest, deleteTask);

export default router;

