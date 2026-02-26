import { FC, useEffect } from 'react';
import { useUpdateProgram, type Program } from '@/entities/program';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Textarea } from '@/shared/ui';
import { z } from 'zod';

const editProgramSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'programs.form.nameRequired' })
    .max(255, { message: 'programs.form.nameTooLong' }),
  description: z.string().max(2000),
  isActive: z.boolean(),
});

type EditProgramFormValues = z.infer<typeof editProgramSchema>;

function toDefaultValues(program: Program): EditProgramFormValues {
  return {
    name: program.name,
    description: program.description ?? '',
    isActive: program.isActive,
  };
}

export interface EditProgramFormProps {
  program: Program;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const EditProgramForm: FC<EditProgramFormProps> = ({
  program,
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<EditProgramFormValues>({
    schema: editProgramSchema,
    defaultValues: toDefaultValues(program),
  });
  const updateMutation = useUpdateProgram();

  useEffect(() => {
    form.reset(toDefaultValues(program));
  }, [program.id, program.name, program.description, program.isActive, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: program.id,
        data: {
          name: data.name,
          description: data.description?.trim() || undefined,
          isActive: data.isActive,
        },
      });
      onSuccess();
    } catch {
      // Backend errors: setError in catch if API exposes field errors
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
          disabled={updateMutation.isPending}
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
          disabled={updateMutation.isPending}
          rows={4}
        />
      </FormField>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          {...form.register('isActive')}
          disabled={updateMutation.isPending}
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
            disabled={updateMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};
