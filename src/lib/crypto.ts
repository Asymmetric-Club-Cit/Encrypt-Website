import { v4 as uuidv4 } from 'uuid';

// Caesar Cipher implementation
export function caesarEncrypt(text: string, shift: number = 7): string {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
}

export function caesarDecrypt(text: string, shift: number = 7): string {
  return caesarEncrypt(text, 26 - shift);
}

// Generate unique submission ID
export function generateSubmissionId(): string {
  const prefix = 'MSG';
  const uuid = uuidv4().substring(0, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${uuid}-${timestamp}`;
}

// Format date for turns tracking
export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}
