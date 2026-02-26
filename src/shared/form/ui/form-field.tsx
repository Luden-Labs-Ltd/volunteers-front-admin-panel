import { FC, ReactNode } from 'react';
import { useI18n } from '@/shared/lib/i18n';

export interface FormFieldProps {
  labelKey: string;
  name: string;
  isRequired?: boolean;
  error?: string;
  children: ReactNode;
}

export const FormField: FC<FormFieldProps> = ({
  labelKey,
  name,
  isRequired = false,
  error,
  children,
}) => {
  const { t } = useI18n();
  const label = t(labelKey);
  const labelAlreadyHasAsterisk = label.trimEnd().endsWith('*');
  const showRequiredMarker = isRequired && !labelAlreadyHasAsterisk;

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {showRequiredMarker && ' *'}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 break-words" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
