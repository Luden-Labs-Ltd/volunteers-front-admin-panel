import { FC } from 'react';
import { useCreateProgram } from '@/entities/program';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Textarea } from '@/shared/ui';
import { z } from 'zod';

const createProgramSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'programs.form.nameRequired' })
    .max(255, { message: 'programs.form.nameTooLong' }),
  description: z.string().max(2000),
  isActive: z.boolean(),
});

type CreateProgramFormValues = z.infer<typeof createProgramSchema>;

const defaultValues: CreateProgramFormValues = {
  name: '',
  description: '',
  isActive: true,
};

export interface CreateProgramFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateProgramForm: FC<CreateProgramFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<CreateProgramFormValues>({
    schema: createProgramSchema,
    defaultValues,
  });
  const createMutation = useCreateProgram();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        description: data.description?.trim() || undefined,
        isActive: data.isActive,
      });
      form.reset(defaultValues);
      onSuccess();
    } catch {
      // Backend errors handled in mutation / setError in hook if needed
    }
  });

  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        labelKey="programs.form.nameLabel"
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
        labelKey="programs.form.descriptionLabel"
        name="description"
        error={getDisplayErrorMessage(err.description?.message, t)}
      >
        <Textarea
          id="description"
          {...form.register('description')}
          disabled={createMutation.isPending}
          rows={4}
        />
      </FormField>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          {...form.register('isActive')}
          disabled={createMutation.isPending}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          {t('programs.form.isActiveLabel')}
        </label>
      </div>

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
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? t('common.creating') : t('programs.create')}
        </Button>
      </div>
    </form>
  );
};
