import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // 128-bit IV

const getKey = () => {
  const secret = process.env.AES_SECRET;
  if (!secret) {
    throw new Error("AES_SECRET is not configured");
  }
  // AES-256 requires 32-byte key; this enforces that requirement.
  const keyBuffer = Buffer.from(secret, "utf8");
  if (keyBuffer.length !== 32) {
    throw new Error("AES_SECRET must be 32 characters long for AES-256");
  }
  return keyBuffer;
};

export const encryptText = (plainText) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  // store iv and ciphertext together
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decryptText = (cipherText) => {
  if (!cipherText) return "";
  const [ivHex, encrypted] = cipherText.split(":");
  if (!ivHex || !encrypted) {
    // If format is invalid, treat as plain text to avoid hard failures.
    return cipherText;
  }
  const iv = Buffer.from(ivHex, "hex");
  const key = getKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

