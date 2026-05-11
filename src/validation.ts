export function assertSafeStringId(value: string, name: string): void {
  if (!value || /[^a-zA-Z0-9_-]/.test(value)) {
    throw new Error(
      `Invalid ${name}: must be a non-empty alphanumeric string`,
    );
  }
}

export function assertSafeIntId(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Invalid ${name}: must be a positive integer`);
  }
}
