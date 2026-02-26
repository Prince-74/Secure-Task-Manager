import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Check if errors are from query parameters
    const hasQueryErrors = errors.array().some((err) => err.location === "query");
    
    if (hasQueryErrors) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
      });
    }
    
    // For other validation errors, return detailed format
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

