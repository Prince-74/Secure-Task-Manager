import jwt from "jsonwebtoken";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: ONE_DAY_IN_SECONDS,
  });
};

export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: ONE_DAY_IN_SECONDS * 1000,
  };
};

