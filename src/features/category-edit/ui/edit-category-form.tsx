import { FC, useEffect, useState } from 'react';
import { useUpdateCategory, type Category } from '@/entities/category';
import { imageApi, useUploadImage } from '@/entities/image';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, ImageUpload } from '@/shared/ui';
import { z } from 'zod';

const editCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'categories.form.nameRequired' })
    .max(255, { message: 'categories.form.nameTooLong' }),
});

type EditCategoryFormValues = z.infer<typeof editCategorySchema>;

function toDefaultValues(category: Category): EditCategoryFormValues {
  return { name: category.name };
}

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
  const { t } = useI18n();
  const [imageId, setImageId] = useState<string>(
    category.imageId || category.image?.id || '',
  );
  const [imageUrl, setImageUrl] = useState<string>(
    category.image?.url || '',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useZodForm<EditCategoryFormValues>({
    schema: editCategorySchema,
    defaultValues: toDefaultValues(category),
  });
  const updateMutation = useUpdateCategory();
  const uploadImageMutation = useUploadImage();

  useEffect(() => {
    form.reset(toDefaultValues(category));
    setImageId(category.imageId || category.image?.id || '');
    setImageUrl(category.image?.url || '');
    setSelectedFile(null);
  }, [category.id, category.name, category.imageId, category.image?.id, category.image?.url, form]);

  useEffect(() => {
    if (imageId && !imageUrl) {
      imageApi
        .getById(imageId)
        .then((image) => setImageUrl(image.url))
        .catch(() => {});
    }
  }, [imageId, imageUrl]);

  const onSubmit = form.handleSubmit(async (data) => {
    let finalImageId = imageId;
    if (selectedFile) {
      const uploadedImage = await uploadImageMutation.mutateAsync({
        file: selectedFile,
        folder: 'categories',
      });
      finalImageId = uploadedImage.id;
    }

    try {
      await updateMutation.mutateAsync({
        id: category.id,
        data: {
          name: data.name,
          ...(finalImageId ? { imageId: finalImageId } : {}),
        },
      });
      onSuccess();
    } catch {
      // Backend errors handled in mutation
    }
  });

  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        labelKey="categories.form.nameLabel"
        name="name"
        isRequired
        error={getDisplayErrorMessage(err.name?.message, t)}
      >
        <Input
          id="name"
          {...form.register('name')}
          disabled={updateMutation.isPending}
        />
      </FormField>

      <FormField
        labelKey="categories.form.imageLabel"
        name="image"
      >
        <ImageUpload
          value={imageUrl}
          onChange={(url) => {
            if (url && !url.startsWith('data:')) setImageUrl(url);
          }}
          onFileSelect={(file) => setSelectedFile(file)}
          disabled={updateMutation.isPending || uploadImageMutation.isPending}
          folder="categories"
        />
      </FormField>

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
        <Button
          type="submit"
          disabled={updateMutation.isPending || uploadImageMutation.isPending}
        >
          {updateMutation.isPending || uploadImageMutation.isPending
            ? t('common.saving')
            : t('common.save')}
        </Button>
      </div>
    </form>
  );
};
