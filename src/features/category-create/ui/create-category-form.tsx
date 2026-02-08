import { FC, useState } from 'react';
import { useCreateCategory } from '@/entities/category';
import { Button, Input, ImageUpload } from '@/shared/ui';
import { useUploadImage } from '@/entities/image';
import { useI18n } from '@/shared/lib/i18n';

export interface CreateCategoryFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateCategoryForm: FC<CreateCategoryFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
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
      newErrors.name = t('categories.form.nameRequired');
    } else if (name.length > 255) {
      newErrors.name = t('categories.form.nameTooLong');
    }

    if (!imageId && !selectedFile) {
      newErrors.image = t('categories.form.imageRequired');
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
        setErrors({ image: t('categories.form.imageRequired') });
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
          label={t('categories.form.nameLabel')}
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
        label={t('categories.form.imageLabel')}
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
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending || uploadImageMutation.isPending}>
          {createMutation.isPending || uploadImageMutation.isPending ? t('common.creating') : t('common.create')}
        </Button>
      </div>
    </form>
  );
};
