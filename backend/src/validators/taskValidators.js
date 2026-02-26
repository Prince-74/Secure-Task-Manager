import { body, query, param } from "express-validator";

const allowedStatuses = ["Pending", "In Progress", "Completed"];

export const createTaskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("status")
    .optional()
    .isIn(allowedStatuses)
    .withMessage("Invalid status value"),
];

export const updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task id"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("status")
    .optional()
    .isIn(allowedStatuses)
    .withMessage("Invalid status value"),
];

export const getTasksQueryValidation = [
  query("page")
    .optional()
    .notEmpty()
    .withMessage("Page cannot be empty")
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .notEmpty()
    .withMessage("Limit cannot be empty")
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  query("status")
    .optional()
    .notEmpty()
    .withMessage("Status cannot be empty")
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(", ")}`),
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string")
    .trim(),
];

export const taskIdParamValidation = [
  param("id").isMongoId().withMessage("Invalid task id"),
];

