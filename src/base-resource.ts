import { PrintifyApiError, PrintifyRateLimitError } from './errors.js';

const DEFAULT_TIMEOUT_MS = 30_000;

export class BaseResource {
  constructor(
    protected readonly baseUrl: string,
    protected readonly accessToken: string,
    protected readonly timeoutMs: number = DEFAULT_TIMEOUT_MS,
  ) {
    try {
      new URL(baseUrl);
    } catch {
      throw new Error(`Invalid baseUrl: "${baseUrl}"`);
    }
  }

  protected async httpGet<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  protected async httpPost<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  protected async httpPut<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  protected async httpDelete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const init: RequestInit = { method, headers, signal: controller.signal };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, init);

      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('retry-after');
        // Printify uses integer seconds; RFC 7231 HTTP-date format would
        // cause parseInt to return NaN, which is mapped to null below.
        const retryAfter = retryAfterHeader
          ? parseInt(retryAfterHeader, 10)
          : null;
        throw new PrintifyRateLimitError(
          Number.isNaN(retryAfter) ? null : retryAfter,
        );
      }

      if (!response.ok) {
        let errorBody:
          | { message?: string; errors?: Record<string, string[]> }
          | undefined;
        try {
          errorBody = (await response.json()) as {
            message?: string;
            errors?: Record<string, string[]>;
          };
        } catch {
          // Response body may not be JSON
        }

        throw new PrintifyApiError(
          errorBody?.message ??
            `HTTP ${response.status} ${response.statusText}`,
          response.status,
          errorBody?.errors,
        );
      }

      // Some endpoints return 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
