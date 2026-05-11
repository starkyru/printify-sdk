export class PrintifyApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'PrintifyApiError';
  }
}

export class PrintifyRateLimitError extends PrintifyApiError {
  constructor(public readonly retryAfter: number | null) {
    super('Rate limit exceeded', 429);
    this.name = 'PrintifyRateLimitError';
  }
}
