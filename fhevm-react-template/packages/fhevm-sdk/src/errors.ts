export class FhevmError extends Error {
  public readonly code?: string;
  public readonly originalError?: unknown;

  constructor(message: string, code?: string, originalError?: unknown) {
    super(message);
    this.name = 'FhevmError';
    this.code = code;
    this.originalError = originalError;
  }
}

export class EncryptionError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

export class DecryptionError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'DecryptionError';
  }
}

export class InitializationError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'InitializationError';
  }
}

export class NetworkError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class SignerError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'SignerError';
  }
}
