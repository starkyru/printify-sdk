import { describe, it, expect } from 'vitest';
import { PrintifyApiError, PrintifyRateLimitError } from '../src/errors.js';

describe('PrintifyApiError', () => {
  it('sets message, statusCode, and name', () => {
    const err = new PrintifyApiError('Not Found', 404);
    expect(err.message).toBe('Not Found');
    expect(err.statusCode).toBe(404);
    expect(err.name).toBe('PrintifyApiError');
    expect(err).toBeInstanceOf(Error);
  });

  it('includes validation errors', () => {
    const errors = { title: ['is required'] };
    const err = new PrintifyApiError('Validation failed', 422, errors);
    expect(err.errors).toEqual(errors);
  });
});

describe('PrintifyRateLimitError', () => {
  it('sets statusCode 429 and retryAfter', () => {
    const err = new PrintifyRateLimitError(30);
    expect(err.statusCode).toBe(429);
    expect(err.retryAfter).toBe(30);
    expect(err.name).toBe('PrintifyRateLimitError');
    expect(err).toBeInstanceOf(PrintifyApiError);
  });

  it('handles null retryAfter', () => {
    const err = new PrintifyRateLimitError(null);
    expect(err.retryAfter).toBeNull();
  });
});
