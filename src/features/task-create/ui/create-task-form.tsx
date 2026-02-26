import { FC } from 'react';
import { useCreateTask } from '@/entities/task';
import { usePrograms } from '@/entities/program';
import { useCategories } from '@/entities/category';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Select, Textarea } from '@/shared/ui';
import { z } from 'zod';

const createTaskSchema = z.object({
  programId: z.string().min(1, { message: 'tasks.form.programRequired' }),
  needyId: z.string().trim().min(1, { message: 'tasks.form.needyRequired' }),
  type: z.string().trim().min(1, { message: 'tasks.form.typeRequired' }),
  title: z
    .string()
    .trim()
    .min(1, { message: 'tasks.form.titleRequired' })
    .max(500, { message: 'tasks.form.titleTooLong' }),
  description: z.string().trim().min(1, { message: 'tasks.form.descriptionRequired' }),
  details: z.string().optional(),
  points: z.number().min(0),
  categoryId: z.string().optional(),
  firstResponseMode: z.boolean(),
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

const defaultValues: CreateTaskFormValues = {
  programId: '',
  needyId: '',
  type: '',
  title: '',
  description: '',
  details: '',
  points: 10,
  categoryId: '',
  firstResponseMode: false,
};

export interface CreateTaskFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateTaskForm: FC<CreateTaskFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<CreateTaskFormValues>({
    schema: createTaskSchema,
    defaultValues,
  });
  const createMutation = useCreateTask();
  const { data: programs = [] } = usePrograms();
  const { data: categories = [] } = useCategories();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync({
        programId: data.programId,
        needyId: data.needyId,
        type: data.type,
        title: data.title,
        description: data.description,
        details: data.details?.trim() || undefined,
        points: data.points ?? 10,
        categoryId: data.categoryId || undefined,
        firstResponseMode: data.firstResponseMode,
      });
      form.reset(defaultValues);
      onSuccess();
    } catch {
      // Backend errors handled in mutation
    }
  });

  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        labelKey="tasks.form.program"
        name="programId"
        isRequired
        error={getDisplayErrorMessage(err.programId?.message, t)}
      >
        <Select
          id="programId"
          {...form.register('programId')}
          disabled={createMutation.isPending}
          options={[
            { value: '', label: t('tasks.form.selectProgram') },
            ...programs.map((program) => ({
              value: program.id,
              label: program.name,
            })),
          ]}
        />
      </FormField>

      <FormField
        labelKey="tasks.form.needyId"
        name="needyId"
        isRequired
        error={getDisplayErrorMessage(err.needyId?.message, t)}
      >
        <Input
          id="needyId"
          {...form.register('needyId')}
          disabled={createMutation.isPending}
          placeholder="UUID"
        />
      </FormField>

      <FormField
        labelKey="tasks.form.type"
        name="type"
        isRequired
        error={getDisplayErrorMessage(err.type?.message, t)}
      >
        <Input
          id="type"
          {...form.register('type')}
          disabled={createMutation.isPending}
          placeholder={t('tasks.form.typePlaceholder')}
        />
      </FormField>

      <FormField
        labelKey="tasks.form.title"
        name="title"
        isRequired
        error={getDisplayErrorMessage(err.title?.message, t)}
      >
        <Input
          id="title"
          {...form.register('title')}
          disabled={createMutation.isPending}
        />
      </FormField>

      <FormField
        labelKey="tasks.form.description"
        name="description"
        isRequired
        error={getDisplayErrorMessage(err.description?.message, t)}
      >
        <Textarea
          id="description"
          {...form.register('description')}
          disabled={createMutation.isPending}
          rows={4}
        />
      </FormField>

      <FormField labelKey="tasks.form.details" name="details">
        <Textarea
          id="details"
          {...form.register('details')}
          disabled={createMutation.isPending}
          rows={3}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField labelKey="tasks.form.points" name="points">
          <Input
            id="points"
            type="number"
            {...form.register('points', { valueAsNumber: true })}
            disabled={createMutation.isPending}
            min={0}
          />
        </FormField>

        <FormField labelKey="tasks.form.category" name="categoryId">
          <Select
            id="categoryId"
            {...form.register('categoryId')}
            disabled={createMutation.isPending}
            options={[
              { value: '', label: t('tasks.form.selectCategory') },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />
        </FormField>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="firstResponseMode"
          {...form.register('firstResponseMode')}
          disabled={createMutation.isPending}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="firstResponseMode" className="text-sm text-gray-700">
          {t('tasks.form.firstResponseMode')}
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
          {createMutation.isPending ? t('common.creating') : t('tasks.create')}
        </Button>
      </div>
    </form>
  );
};
