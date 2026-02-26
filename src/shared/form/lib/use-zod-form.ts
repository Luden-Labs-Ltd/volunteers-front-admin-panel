import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export type ZodSchema<T extends Record<string, unknown>> = z.ZodType<T>;

export interface UseZodFormOptions<T extends Record<string, unknown>>
  extends Omit<UseFormProps<T>, 'resolver'> {
  schema: ZodSchema<T>;
}

/**
 * useForm with zodResolver. Validation runs on blur and on submit.
 * Only the first error per field is shown (react-hook-form default when using resolver).
 */
export function useZodForm<T extends Record<string, unknown>>(
  options: UseZodFormOptions<T>,
): UseFormReturn<T> {
  const { schema, ...rest } = options;
  return useForm<T>({
    ...rest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as UseFormProps<T>['resolver'],
    mode: 'onBlur',
  });
}
