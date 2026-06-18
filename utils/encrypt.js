import crypto from "crypto";
import { getEncryptionKey } from "./secretKey.js";

/**
 * Encrypt data using AES-256-CBC encryption
 * @param {string} plaintext - Data to encrypt
 * @returns {string} - Encrypted data in format: iv:encryptedData (both in hex)
 */
export function encryptVote(plaintext) {
  try {
    const key = Buffer.from(getEncryptionKey(), "utf8");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    // Return IV and encrypted data together, separated by colon
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt vote");
  }
}

/**
 * Decrypt data using AES-256-CBC decryption
 * @param {string} encryptedData - Encrypted data in format: iv:encryptedData
 * @returns {string} - Decrypted plaintext
 */
export function decryptVote(encryptedData) {
  try {
    const key = Buffer.from(getEncryptionKey(), "utf8");
    const [ivHex, encrypted] = encryptedData.split(":");
    
    if (!ivHex || !encrypted) {
      throw new Error("Invalid encrypted format");
    }
    
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt vote");
  }
}
