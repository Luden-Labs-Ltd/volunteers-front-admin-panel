import { FC, useState } from 'react';
import { useCreateCategory } from '@/entities/category';
import { Button, Input, ImageUpload } from '@/shared/ui';
import { useUploadImage } from '@/entities/image';

export interface CreateCategoryFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateCategoryForm: FC<CreateCategoryFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [imageId, setImageId] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateCategory();
  const uploadImageMutation = useUploadImage();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Название обязательно';
    } else if (name.length > 255) {
      newErrors.name = 'Название не должно превышать 255 символов';
    }

    if (!imageId && !selectedFile) {
      newErrors.image = 'Изображение обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // Если есть выбранный файл, загружаем его
      let finalImageId = imageId;
      if (selectedFile) {
        const uploadedImage = await uploadImageMutation.mutateAsync({
          file: selectedFile,
          folder: 'categories',
        });
        finalImageId = uploadedImage.id;
      }

      if (!finalImageId) {
        setErrors({ image: 'Изображение обязательно' });
        return;
      }

      await createMutation.mutateAsync({
        name: name.trim(),
        imageId: finalImageId,
      });
      onSuccess();
      // Сброс формы
      setName('');
      setImageId('');
      setImagePreview('');
      setSelectedFile(null);
      setErrors({});
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Название *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: '' }));
            }
          }}
          error={errors.name}
          required
          disabled={createMutation.isPending}
        />
      </div>

      <ImageUpload
        label="Изображение категории *"
        value={imagePreview}
        onChange={(url) => {
          // Сохраняем preview URL
          setImagePreview(url);
        }}
        onFileSelect={(file) => {
          setSelectedFile(file);
          if (errors.image) {
            setErrors((prev) => ({ ...prev, image: '' }));
          }
        }}
        disabled={createMutation.isPending || uploadImageMutation.isPending}
        folder="categories"
        error={errors.image}
      />

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createMutation.isPending}
          >
            Отмена
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending || uploadImageMutation.isPending}>
          {createMutation.isPending || uploadImageMutation.isPending ? 'Создание...' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};
