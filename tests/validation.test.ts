import { describe, it, expect } from 'vitest';
import {
  assertSafeStringId,
  assertSafeIntId,
} from '../src/validation.js';

describe('assertSafeStringId', () => {
  it('accepts valid alphanumeric IDs', () => {
    expect(() => assertSafeStringId('abc123', 'id')).not.toThrow();
    expect(() => assertSafeStringId('my-id_01', 'id')).not.toThrow();
  });

  it('rejects empty string', () => {
    expect(() => assertSafeStringId('', 'id')).toThrow('Invalid id');
  });

  it('rejects path traversal', () => {
    expect(() => assertSafeStringId('../admin', 'id')).toThrow('Invalid id');
    expect(() => assertSafeStringId('../../etc/passwd', 'id')).toThrow(
      'Invalid id',
    );
  });

  it('rejects slashes', () => {
    expect(() => assertSafeStringId('a/b', 'id')).toThrow('Invalid id');
  });

  it('rejects special characters', () => {
    expect(() => assertSafeStringId('id&x=1', 'id')).toThrow('Invalid id');
    expect(() => assertSafeStringId('id?q=1', 'id')).toThrow('Invalid id');
  });
});

describe('assertSafeIntId', () => {
  it('accepts positive integers', () => {
    expect(() => assertSafeIntId(1, 'id')).not.toThrow();
    expect(() => assertSafeIntId(99999, 'id')).not.toThrow();
  });

  it('rejects zero', () => {
    expect(() => assertSafeIntId(0, 'id')).toThrow('Invalid id');
  });

  it('rejects negative', () => {
    expect(() => assertSafeIntId(-1, 'id')).toThrow('Invalid id');
  });

  it('rejects NaN', () => {
    expect(() => assertSafeIntId(NaN, 'id')).toThrow('Invalid id');
  });

  it('rejects Infinity', () => {
    expect(() => assertSafeIntId(Infinity, 'id')).toThrow('Invalid id');
  });

  it('rejects floats', () => {
    expect(() => assertSafeIntId(1.5, 'id')).toThrow('Invalid id');
  });
});
