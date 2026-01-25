import { FC, useState, useRef, useEffect } from 'react';
import { Button } from '../button';
import { cn } from '@/shared/lib/utils';

export interface ImageUploadProps {
  label?: string;
  value?: string; // URL изображения или imageId
  onChange?: (url: string) => void;
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
  error?: string;
  accept?: string;
  folder?: string;
  className?: string;
}

export const ImageUpload: FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  onFileSelect,
  disabled = false,
  error,
  accept = 'image/*',
  folder: _folder,
  className,
}) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Обновляем preview при изменении value
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Валидация типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Валидация размера (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Размер файла не должен превышать 10MB');
      return;
    }

    // Создаем preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      if (onChange) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);

    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClick}
                disabled={disabled}
              >
                Изменить
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="text-red-600 hover:text-red-700 hover:border-red-700"
              >
                Удалить
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              disabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : error
                  ? 'border-red-300 hover:border-red-400'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
            )}
          >
            <div className="space-y-2">
              <div className="text-4xl">📷</div>
              <div className="text-sm text-gray-600">
                Нажмите для выбора изображения
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG, GIF до 10MB
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
