import { FC, useState } from 'react';
import { useCreateCategory } from '@/entities/category';
import { useUploadImage } from '@/entities/image';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, ImageUpload } from '@/shared/ui';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.preprocess(
    (v: unknown) => (v === undefined || v === null ? '' : v),
    z
      .string()
      .trim()
      .min(1, { message: 'categories.form.nameRequired' })
      .max(255, { message: 'categories.form.nameTooLong' }),
  ),
  image: z.string().optional(), // not registered; setError used for validation
});

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export interface CreateCategoryFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateCategoryForm: FC<CreateCategoryFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [imageId, setImageId] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useZodForm<CreateCategoryFormValues>({
    schema: createCategorySchema,
    defaultValues: { name: '', image: undefined },
  });
  const createMutation = useCreateCategory();
  const uploadImageMutation = useUploadImage();

  const onSubmit = form.handleSubmit(async (data) => {
    if (!imageId && !selectedFile) {
      form.setError('image', {
        type: 'manual',
        message: 'categories.form.imageRequired',
      });
      return;
    }
    form.clearErrors('image');

    let finalImageId = imageId;
    if (selectedFile) {
      const uploadedImage = await uploadImageMutation.mutateAsync({
        file: selectedFile,
        folder: 'categories',
      });
      finalImageId = uploadedImage.id;
    }

    if (!finalImageId) {
      form.setError('image', {
        type: 'manual',
        message: 'categories.form.imageRequired',
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: data.name,
        imageId: finalImageId,
      });
      form.reset({ name: '', image: undefined });
      setImageId('');
      setImagePreview('');
      setSelectedFile(null);
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
          disabled={createMutation.isPending}
        />
      </FormField>

      <FormField
        labelKey="categories.form.imageLabel"
        name="image"
        isRequired
        error={getDisplayErrorMessage(err.image?.message, t)}
      >
        <ImageUpload
          value={imagePreview}
          onChange={(url) => setImagePreview(url)}
          onFileSelect={(file) => {
            setSelectedFile(file);
            form.clearErrors('image');
          }}
          disabled={createMutation.isPending || uploadImageMutation.isPending}
          folder="categories"
        />
      </FormField>

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
        <Button
          type="submit"
          disabled={createMutation.isPending || uploadImageMutation.isPending}
        >
          {createMutation.isPending || uploadImageMutation.isPending
            ? t('common.creating')
            : t('common.create')}
        </Button>
      </div>
    </form>
  );
};
