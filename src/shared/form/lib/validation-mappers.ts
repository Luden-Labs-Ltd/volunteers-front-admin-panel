/**
 * Maps validation error codes (from zod or backend) to i18n keys.
 * Fallback key used when code is unknown (see locales: common.validationErrorFallback).
 */
const CODE_TO_I18N_KEY: Record<string, string> = {
  required: 'common.validationErrorFallback',
  invalid_type: 'common.validationErrorFallback',
  too_small: 'common.validationErrorFallback',
  too_big: 'common.validationErrorFallback',
  invalid_string: 'common.validationErrorFallback',
  invalid_enum_value: 'common.validationErrorFallback',
  invalid_date: 'common.validationErrorFallback',
  custom: 'common.validationErrorFallback',
};

const FALLBACK_KEY = 'common.validationErrorFallback';

/** Substrings that indicate a raw Zod default message (not an i18n key). */
const RAW_ZOD_MESSAGE_MARKERS = [
  'Invalid input',
  'expected',
  'received',
  'Expected',
  'Received',
];

function isRawZodMessage(message: string): boolean {
  return RAW_ZOD_MESSAGE_MARKERS.some((marker) => message.includes(marker));
}

export interface ValidationErrorInput {
  code?: string;
  fieldName?: string;
  /** Optional pre-resolved i18n key (e.g. from zod schema message) */
  i18nKey?: string;
}

/**
 * Returns i18n key for a validation error. Use with t() to get translated message.
 * If i18nKey is provided, use it; else map code to key; else return fallback key.
 */
export function getValidationErrorI18nKey(input: ValidationErrorInput): string {
  if (input.i18nKey) {
    return input.i18nKey;
  }
  const code = input.code ?? 'unknown';
  return CODE_TO_I18N_KEY[code] ?? FALLBACK_KEY;
}

export type TranslateFn = (key: string) => string;

/**
 * Returns a display-ready error message: never shows raw Zod text, always translated.
 * - If message is undefined, returns undefined.
 * - If message looks like raw Zod (e.g. "Invalid input: expected string, received undefined"), returns t('common.validationErrorFallback').
 * - Otherwise treats message as i18n key and returns t(message).
 */
export function getDisplayErrorMessage(
  message: string | undefined,
  t: TranslateFn,
): string | undefined {
  if (message == null || message === '') {
    return undefined;
  }
  if (isRawZodMessage(message)) {
    return t(FALLBACK_KEY);
  }
  return t(message);
}
