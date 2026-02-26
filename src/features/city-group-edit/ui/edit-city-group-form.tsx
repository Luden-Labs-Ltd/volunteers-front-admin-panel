import { FC, useEffect } from 'react';
import { useUpdateCityGroup, type CityGroup } from '@/entities/city-group';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';
import { Button, Input } from '@/shared/ui';
import { z } from 'zod';

const editCityGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'cityGroups.form.nameRequired' })
    .max(255, { message: 'cityGroups.form.nameTooLong' }),
});

type EditCityGroupFormValues = z.infer<typeof editCityGroupSchema>;

function toDefaultValues(group: CityGroup): EditCityGroupFormValues {
  return { name: group.name };
}

export interface EditCityGroupFormProps {
  group: CityGroup;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const EditCityGroupForm: FC<EditCityGroupFormProps> = ({
  group,
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<EditCityGroupFormValues>({
    schema: editCityGroupSchema,
    defaultValues: toDefaultValues(group),
  });
  const updateMutation = useUpdateCityGroup();

  useEffect(() => {
    form.reset(toDefaultValues(group));
  }, [group.id, group.name, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: group.id,
        data: { name: data.name },
      });
      showToast.success(t('cityGroups.updateSuccess'));
      onSuccess();
    } catch (err) {
      showToast.error((err as Error).message || t('common.error'));
    }
  });

  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        labelKey="cityGroups.form.nameLabel"
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
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
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
