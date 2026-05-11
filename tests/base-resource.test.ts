import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BaseResource } from '../src/base-resource.js';
import { PrintifyApiError, PrintifyRateLimitError } from '../src/errors.js';

// Expose protected methods for testing
class TestResource extends BaseResource {
  get<T>(path: string) {
    return this.httpGet<T>(path);
  }
  post<T>(path: string, body?: unknown) {
    return this.httpPost<T>(path, body);
  }
  put<T>(path: string, body?: unknown) {
    return this.httpPut<T>(path, body);
  }
  del<T>(path: string) {
    return this.httpDelete<T>(path);
  }
}

function mockFetch(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    headers: new Headers(headers),
    json: () => Promise.resolve(body),
  });
}

describe('BaseResource', () => {
  const resource = new TestResource(
    'https://api.printify.com/v1',
    'tok_test',
  );

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch(200, { id: 1 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects invalid baseUrl', () => {
    expect(() => new TestResource('not-a-url', 'tok')).toThrow(
      'Invalid baseUrl',
    );
  });

  it('accepts valid HTTP URL for local testing', () => {
    expect(
      () => new TestResource('http://localhost:3000', 'tok'),
    ).not.toThrow();
  });

  it('sends GET with auth header', async () => {
    await resource.get('/shops.json');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.printify.com/v1/shops.json',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer tok_test',
        }),
      }),
    );
  });

  it('sends POST with JSON body', async () => {
    const body = { title: 'test' };
    await resource.post('/products.json', body);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.printify.com/v1/products.json',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
      }),
    );
  });

  it('sends PUT request', async () => {
    await resource.put('/products/1.json', { title: 'updated' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/products/1.json'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('sends DELETE request', async () => {
    await resource.del('/products/1.json');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/products/1.json'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('returns undefined for 204 No Content', async () => {
    vi.stubGlobal('fetch', mockFetch(204, null));
    const result = await resource.del('/products/1.json');
    expect(result).toBeUndefined();
  });

  it('throws PrintifyRateLimitError on 429', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch(429, {}, { 'retry-after': '60' }),
    );
    await expect(resource.get('/shops.json')).rejects.toThrow(
      PrintifyRateLimitError,
    );
  });

  it('parses retry-after header', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch(429, {}, { 'retry-after': '45' }),
    );
    try {
      await resource.get('/shops.json');
    } catch (e) {
      expect((e as PrintifyRateLimitError).retryAfter).toBe(45);
    }
  });

  it('sets retryAfter to null for non-numeric header', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch(429, {}, { 'retry-after': 'Thu, 01 Jan 2099 00:00:00 GMT' }),
    );
    try {
      await resource.get('/shops.json');
    } catch (e) {
      expect((e as PrintifyRateLimitError).retryAfter).toBeNull();
    }
  });

  it('throws PrintifyApiError on non-ok response', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { message: 'Not found' }));
    await expect(resource.get('/missing.json')).rejects.toThrow(
      PrintifyApiError,
    );
  });

  it('handles non-JSON error body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers(),
        json: () => Promise.reject(new Error('not json')),
      }),
    );
    await expect(resource.get('/fail.json')).rejects.toThrow(
      'HTTP 500 Internal Server Error',
    );
  });

  it('includes AbortSignal in fetch calls', async () => {
    await resource.get('/shops.json');
    const init = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });
});
