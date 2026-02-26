// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "An unexpected error occurred. Please try again later.";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

