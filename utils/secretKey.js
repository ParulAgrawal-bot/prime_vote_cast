// Generate a 32-character hex string as encryption key
// In production, store this in environment variables
export const SECRET_KEY = process.env.ENCRYPTION_KEY || "your-secret-key-32-chars-minimum";

// Ensure key is 32 bytes for AES-256
export const getEncryptionKey = () => {
  const key = SECRET_KEY;
  if (key.length < 32) {
    // Pad with zeros if too short
    return (key + "0".repeat(32)).slice(0, 32);
  }
  return key.slice(0, 32);
};
