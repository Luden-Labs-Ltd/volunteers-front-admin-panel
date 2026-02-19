import { FC, useState, useEffect } from 'react';
import { useUpdateCategory, type Category } from '@/entities/category';
import { Button, Input, ImageUpload } from '@/shared/ui';
import { useUploadImage } from '@/entities/image';
import { imageApi } from '@/entities/image';
import { useI18n } from '@/shared/lib/i18n';

export interface EditCategoryFormProps {
  category: Category;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const EditCategoryForm: FC<EditCategoryFormProps> = ({
  category,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(category.name);
  const [imageId, setImageId] = useState<string>(category.imageId || category.image?.id || '');
  const [imageUrl, setImageUrl] = useState<string>(category.image?.url || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { t } = useI18n();
  const updateMutation = useUpdateCategory();
  const uploadImageMutation = useUploadImage();

  useEffect(() => {
    setName(category.name);
    setImageId(category.imageId || category.image?.id || '');
    setImageUrl(category.image?.url || '');
    setSelectedFile(null);
    setErrors({});
  }, [category]);

  // Загружаем URL изображения если есть imageId
  useEffect(() => {
    if (imageId && !imageUrl) {
      imageApi.getById(imageId).then((image) => {
        setImageUrl(image.url);
      }).catch(() => {
        // Игнорируем ошибки загрузки
      });
    }
  }, [imageId, imageUrl]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('categories.form.nameRequired');
    } else if (name.length > 255) {
      newErrors.name = t('categories.form.nameTooLong');
    }

    // Изображение не обязательно при редактировании (может остаться старое)
    // Но если выбрано новое, оно должно быть валидным

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

      await updateMutation.mutateAsync({
        id: category.id,
        data: {
          name: name.trim(),
          ...(finalImageId ? { imageId: finalImageId } : {}),
        },
      });
      onSuccess();
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
          disabled={updateMutation.isPending}
        />
      </div>

      <ImageUpload
        label={t('categories.form.imageLabel')}
        value={imageUrl}
        onChange={(url) => {
          // Если это URL, сохраняем его для preview
          if (url && !url.startsWith('data:')) {
            setImageUrl(url);
          }
        }}
        onFileSelect={(file) => {
          setSelectedFile(file);
          if (errors.image) {
            setErrors((prev) => ({ ...prev, image: '' }));
          }
        }}
        disabled={updateMutation.isPending || uploadImageMutation.isPending}
        folder="categories"
        error={errors.image}
      />

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={updateMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={updateMutation.isPending || uploadImageMutation.isPending}>
          {updateMutation.isPending || uploadImageMutation.isPending ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};
