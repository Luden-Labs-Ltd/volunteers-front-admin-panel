import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

type TextareaPropsWithRef = TextareaProps & {
  ref?: React.Ref<HTMLTextAreaElement>;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, refFromForward) => {
    const { ref: refProp, ...rest } = props as TextareaPropsWithRef;
    const ref = refFromForward ?? refProp;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed resize-none',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
