import { setErrorMap } from 'zod';

const FALLBACK_I18N_KEY = 'common.validationErrorFallback';

/**
 * Sets global Zod error map so that default Zod messages (e.g. "Invalid input: expected string, received undefined")
 * are replaced with an i18n key. Forms then pass this key to t() for translation.
 * Call once at app init (e.g. in index.tsx or App.tsx).
 */
export function initZodI18n(): void {
  setErrorMap(() => ({ message: FALLBACK_I18N_KEY }));
}
