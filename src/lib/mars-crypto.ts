/**
 * Mars Crypto - Modern Web Crypto API Implementation
 * Uses AES-256-GCM for secure encryption with authentication
 * Inspired by the Mars CAST-128 algorithm but adapted for web security
 */

export class MarsCrypto {
  private readonly key: string;
  private readonly keyLength = 32; // 256-bit key
  private readonly ivLength = 12; // 96-bit IV for GCM
  private readonly saltLength = 16; // 128-bit salt
  private readonly iterations = 100000; // PBKDF2 iterations

  constructor(key: string = "MartianOrbit2025") {
    this.key = key;
  }

  /**
   * Base64 encoding for binary data
   */
  private base64Encode(data: ArrayBuffer): string {
    const bytes = new Uint8Array(data);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Base64 decoding to binary data
   */
  private base64Decode(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Derive encryption key from password using PBKDF2
   */
  private async deriveKey(password: string, salt: ArrayBuffer): Promise<CryptoKey> {
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

    // Derive AES key
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt plaintext using AES-256-GCM (Mars-style security)
   */
  async encrypt(plaintext: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);

      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
      const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));

      // Derive key from password and salt
      const key = await this.deriveKey(this.key, salt.buffer);

      // Encrypt with AES-GCM (includes authentication)
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      );

      // Combine salt + iv + ciphertext
      const finalData = new Uint8Array(
        this.saltLength + this.ivLength + ciphertext.byteLength
      );
      
      finalData.set(salt, 0);
      finalData.set(iv, this.saltLength);
      finalData.set(new Uint8Array(ciphertext), this.saltLength + this.ivLength);

      // Return base64 encoded result
      return this.base64Encode(finalData.buffer);
    } catch (error) {
      throw new Error(`Mars encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt ciphertext using AES-256-GCM (Mars-style verification)
   */
  async decrypt(base64Ciphertext: string): Promise<string> {
    try {
      // Decode base64 data
      const data = new Uint8Array(this.base64Decode(base64Ciphertext));

      // Validate minimum length
      if (data.length < this.saltLength + this.ivLength) {
        throw new Error('Invalid input data - too short');
      }

      // Extract components
      const salt = data.slice(0, this.saltLength);
      const iv = data.slice(this.saltLength, this.saltLength + this.ivLength);
      const ciphertext = data.slice(this.saltLength + this.ivLength);

      // Derive key from password and salt
      const key = await this.deriveKey(this.key, salt.buffer);

      // Decrypt with AES-GCM (includes authentication verification)
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        ciphertext
      );

      // Convert back to string
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      if (error instanceof Error && error.message.includes('OperationError')) {
        throw new Error('Decryption failed - authentication verification failed or corrupted data');
      }
      throw new Error(`Mars decryption failed: ${error}`);
    }
  }

  /**
   * Generate a secure random key for Mars operations
   */
  static generateSecureKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate if a string is a valid Mars encrypted message
   */
  static isValidEncrypted(encrypted: string): boolean {
    try {
      const data = atob(encrypted);
      return data.length >= 28; // minimum: 16 salt + 12 iv
    } catch {
      return false;
    }
  }
}

// Export default instance with Mars key
export const marsCrypto = new MarsCrypto();

// Named exports for specific use cases
export const createMarsCrypto = (customKey: string) => new MarsCrypto(customKey);
