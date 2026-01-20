import { FC } from 'react';
import { cn } from '@/shared/lib/utils';
import { isValidSvg } from '@/shared/lib/utils/svg-validation';

export interface SvgPreviewProps {
  svgCode: string;
  className?: string;
  size?: number;
}

export const SvgPreview: FC<SvgPreviewProps> = ({
  svgCode,
  className,
  size = 48,
}) => {
  const isValid = isValidSvg(svgCode);

  if (!isValid) {
    return (
      <div
        className={cn(
          'flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50 text-gray-400 text-sm',
          className,
        )}
        style={{ width: size, height: size }}
      >
        Нет иконки
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
};
