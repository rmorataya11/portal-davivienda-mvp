export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^[+()\s.-]*\d[\d+()\s.-]{6,}$/;

const DOCUMENT_TYPES = new Set(['cc', 'ce', 'nit', 'pasaporte', 'ppt']);

export function readTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value);
}

export function isValidDocumentId(value: string): boolean {
  return value.length > 0;
}

export function isValidDocumentType(value: string): boolean {
  return DOCUMENT_TYPES.has(value);
}

export function isExplicitTrue(value: unknown): boolean {
  return value === true;
}
