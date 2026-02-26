import { FC, useEffect } from 'react';
import { useUpdateTask, type Task } from '@/entities/task';
import { usePrograms } from '@/entities/program';
import { useCategories } from '@/entities/category';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Select, Textarea } from '@/shared/ui';
import { z } from 'zod';

const editTaskSchema = z.object({
  programId: z.string().optional(),
  type: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, { message: 'tasks.form.titleRequired' })
    .max(500, { message: 'tasks.form.titleTooLong' }),
  description: z.string().trim().min(1, { message: 'tasks.form.descriptionRequired' }),
  details: z.string().optional(),
  points: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  firstResponseMode: z.boolean().optional(),
});

type EditTaskFormValues = z.infer<typeof editTaskSchema>;

function toDefaultValues(task: Task): EditTaskFormValues {
  return {
    programId: task.programId ?? '',
    type: '',
    title: task.title,
    description: task.description,
    details: '',
    points: 10,
    categoryId: task.categoryId ?? '',
    firstResponseMode: false,
  };
}

export interface EditTaskFormProps {
  task: Task;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const EditTaskForm: FC<EditTaskFormProps> = ({
  task,
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<EditTaskFormValues>({
    schema: editTaskSchema,
    defaultValues: toDefaultValues(task),
  });
  const updateMutation = useUpdateTask();
  const { data: programs = [] } = usePrograms();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    form.reset(toDefaultValues(task));
  }, [task.id, task.programId, task.title, task.description, task.categoryId, form, task]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: task.id,
        data: {
          programId: data.programId || undefined,
          type: data.type || undefined,
          title: data.title,
          description: data.description,
          details: data.details?.trim() || undefined,
          points: data.points ?? undefined,
          categoryId: data.categoryId || undefined,
          firstResponseMode: data.firstResponseMode,
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
        labelKey="tasks.form.program"
        name="programId"
        error={getDisplayErrorMessage(err.programId?.message, t)}
      >
        <Select
          id="programId"
          {...form.register('programId')}
          disabled={updateMutation.isPending}
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
        labelKey="tasks.form.type"
        name="type"
        error={getDisplayErrorMessage(err.type?.message, t)}
      >
        <Input
          id="type"
          {...form.register('type')}
          disabled={updateMutation.isPending}
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
          disabled={updateMutation.isPending}
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
          disabled={updateMutation.isPending}
          rows={4}
        />
      </FormField>

      <FormField labelKey="tasks.form.details" name="details">
        <Textarea
          id="details"
          {...form.register('details')}
          disabled={updateMutation.isPending}
          rows={3}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField labelKey="tasks.form.points" name="points">
          <Input
            id="points"
            type="number"
            {...form.register('points', { valueAsNumber: true })}
            disabled={updateMutation.isPending}
            min={0}
          />
        </FormField>

        <FormField labelKey="tasks.form.category" name="categoryId">
          <Select
            id="categoryId"
            {...form.register('categoryId')}
            disabled={updateMutation.isPending}
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
          disabled={updateMutation.isPending}
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
