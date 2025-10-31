// Security utilities

export function sanitizeInput(input: string): string {
  // Basic input sanitization
  return input.replace(/[<>]/g, '');
}

export function validateAddress(address: string): boolean {
  // Ethereum address validation
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateNumber(value: any, min?: number, max?: number): boolean {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}

export async function hashData(data: string): Promise<string> {
  // Simple hash function (in production, use proper cryptographic hash)
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}
