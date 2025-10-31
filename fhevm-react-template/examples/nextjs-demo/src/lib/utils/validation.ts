// Validation utilities

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEncryptionInput(value: any, type: number): ValidationResult {
  if (value === null || value === undefined) {
    return { valid: false, error: 'Value cannot be null or undefined' };
  }

  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Value must be a number' };
  }

  // Validate based on bit size
  const maxValues: Record<number, number> = {
    8: 255,
    16: 65535,
    32: 4294967295,
    64: Number.MAX_SAFE_INTEGER,
  };

  if (type in maxValues && num > maxValues[type]) {
    return { valid: false, error: `Value exceeds maximum for ${type}-bit integer` };
  }

  if (num < 0) {
    return { valid: false, error: 'Value must be non-negative' };
  }

  return { valid: true };
}

export function validateComputationOperation(operation: string): ValidationResult {
  const validOperations = ['add', 'subtract', 'multiply', 'divide', 'compare'];

  if (!validOperations.includes(operation)) {
    return {
      valid: false,
      error: `Invalid operation. Must be one of: ${validOperations.join(', ')}`,
    };
  }

  return { valid: true };
}

export function validateHandle(handle: string): ValidationResult {
  if (!handle || typeof handle !== 'string') {
    return { valid: false, error: 'Handle must be a non-empty string' };
  }

  if (handle.length < 10) {
    return { valid: false, error: 'Handle is too short' };
  }

  return { valid: true };
}
