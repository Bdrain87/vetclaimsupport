/**
 * Client-side encryption utilities for sensitive data
 * Uses Web Crypto API for AES-GCM encryption
 */

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
// OWASP 2023 recommends 600,000+ iterations for PBKDF2-SHA256
const KEY_ITERATIONS = 600000;

// Check if Web Crypto is available
export function isEncryptionSupported(): boolean {
  return typeof window !== 'undefined' &&
         window.crypto &&
         window.crypto.subtle !== undefined;
}

// Generate a random salt
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

// Generate a random IV (Initialization Vector)
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

// Derive a key from password using PBKDF2
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive AES-GCM key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: KEY_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

// Convert ArrayBuffer to base64 string
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert base64 string to ArrayBuffer
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Encrypt data with password
export async function encrypt(
  data: string,
  password: string
): Promise<string> {
  if (!isEncryptionSupported()) {
    throw new Error('Web Crypto API is not supported in this environment');
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Generate salt and IV
  const salt = generateSalt();
  const iv = generateIV();

  // Derive key from password
  const key = await deriveKey(password, salt);

  // Encrypt data
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    dataBuffer
  );

  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(
    salt.length + iv.length + encryptedBuffer.byteLength
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

  // Return as base64
  return bufferToBase64(combined.buffer);
}

// Decrypt data with password
export async function decrypt(
  encryptedData: string,
  password: string
): Promise<string> {
  if (!isEncryptionSupported()) {
    throw new Error('Web Crypto API is not supported in this environment');
  }

  try {
    // Decode from base64
    const combined = base64ToBuffer(encryptedData);

    // Extract salt, iv, and encrypted data
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encryptedBuffer = combined.slice(SALT_LENGTH + IV_LENGTH);

    // Derive key from password
    const key = await deriveKey(password, salt);

    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encryptedBuffer
    );

    // Decode to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch {
    throw new Error('Decryption failed. Incorrect password or corrupted data.');
  }
}

// Encrypt an object
export async function encryptObject<T>(
  obj: T,
  password: string
): Promise<string> {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString, password);
}

// Decrypt to object
export async function decryptObject<T>(
  encryptedData: string,
  password: string
): Promise<T> {
  const jsonString = await decrypt(encryptedData, password);
  return JSON.parse(jsonString) as T;
}

/**
 * Hash a password for verification using PBKDF2 with a random salt.
 *
 * Returns a string in the format `<base64-salt>:<base64-hash>` so the salt is
 * stored alongside the hash and can be used during verification.
 *
 * Uses the same iteration count as key derivation (100 000 rounds of
 * PBKDF2-SHA-256) to make brute-force attacks expensive.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!isEncryptionSupported()) {
    throw new Error('Web Crypto API is not supported');
  }

  const encoder = new TextEncoder();
  const salt = generateSalt(); // 16 random bytes

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: KEY_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256, // 32 bytes
  );

  return bufferToBase64(salt.buffer) + ':' + bufferToBase64(hashBuffer);
}

/**
 * Verify a password against a stored hash.
 *
 * Supports both the new salted format (`<salt>:<hash>`) and the legacy
 * unsalted SHA-256 format (plain base64) for backwards compatibility.
 */
export async function verifyPasswordHash(
  password: string,
  storedHash: string,
): Promise<boolean> {
  if (!isEncryptionSupported()) {
    throw new Error('Web Crypto API is not supported');
  }

  const encoder = new TextEncoder();

  if (storedHash.includes(':')) {
    // New salted PBKDF2 format: "base64salt:base64hash"
    const [saltB64, expectedHashB64] = storedHash.split(':');
    const salt = base64ToBuffer(saltB64);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );

    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: KEY_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      256,
    );

    return bufferToBase64(hashBuffer) === expectedHashB64;
  }

  // Legacy unsalted SHA-256 path -- kept for backwards compatibility with
  // hashes created before the PBKDF2 migration.
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToBase64(hashBuffer) === storedHash;
}

/**
 * @deprecated Use `hashPassword` instead.  Retained only so that call-sites
 * that have not yet been migrated continue to compile.
 */
export async function hashString(str: string): Promise<string> {
  return hashPassword(str);
}

// Generate a secure random password
export function generateSecurePassword(length: number = 16): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Password should be at least 8 characters');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
}

// Storage key for encrypted data settings
const ENCRYPTION_ENABLED_KEY = 'vet-claim-encryption-enabled';
const PASSWORD_HASH_KEY = 'vet-claim-password-hash';

// Check if encryption is enabled
export function isEncryptionEnabled(): boolean {
  return localStorage.getItem(ENCRYPTION_ENABLED_KEY) === 'true';
}

// Enable encryption with password
export async function enableEncryption(password: string): Promise<void> {
  const hash = await hashPassword(password);
  try {
    localStorage.setItem(PASSWORD_HASH_KEY, hash);
    localStorage.setItem(ENCRYPTION_ENABLED_KEY, 'true');
  } catch {
    throw new Error('Failed to save encryption settings — storage may be full');
  }
}

// Disable encryption
export function disableEncryption(): void {
  localStorage.removeItem(PASSWORD_HASH_KEY);
  localStorage.removeItem(ENCRYPTION_ENABLED_KEY);
}

// Verify password against the stored hash
export async function verifyPassword(password: string): Promise<boolean> {
  const storedHash = localStorage.getItem(PASSWORD_HASH_KEY);
  if (!storedHash) return false;

  return verifyPasswordHash(password, storedHash);
}
