import { FC } from 'react';
import { cn } from '@/shared/lib/utils';

export interface ImagePreviewProps {
  imageUrl: string;
  className?: string;
  size?: number;
}

export const ImagePreview: FC<ImagePreviewProps> = ({
  imageUrl,
  className,
  size = 100,
}) => {
  return (
    <img
      className={cn(
        'block object-cover rounded-lg border-2 border-gray-200 shadow-sm',
        className,
      )}
      style={{ width: size, height: size }}
      src={imageUrl}
      alt="Image Preview"
    />
  );
};
