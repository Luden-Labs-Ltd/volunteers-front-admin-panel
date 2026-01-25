import { toast as sonnerToast } from 'sonner';

// import { Language } from './i18n';

type Translate = (key: string) => string;

interface ToastWithI18n {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  successKey: (t: Translate, key: string) => void;
  errorKey: (t: Translate, key: string) => void;
  infoKey: (t: Translate, key: string) => void;
  warningKey: (t: Translate, key: string) => void;
}

export const toast: ToastWithI18n = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
  info: (message: string) => sonnerToast.info(message),
  warning: (message: string) => sonnerToast.warning(message),
  successKey: (t: Translate, key: string) => sonnerToast.success(t(key)),
  errorKey: (t: Translate, key: string) => sonnerToast.error(t(key)),
  infoKey: (t: Translate, key: string) => sonnerToast.info(t(key)),
  warningKey: (t: Translate, key: string) => sonnerToast.warning(t(key)),
};

// Алиас для обратной совместимости
export const showToast = toast;
