import { FC, useEffect } from 'react';
import { useCategories } from '@/entities/category';
import { type Skill, useUpdateSkill } from '@/entities/skill';
import { SvgPreview } from '@/features/svg-preview';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Select, Textarea } from '@/shared/ui';
import { z } from 'zod';

const editSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'skills.form.nameRequired' })
    .max(255, { message: 'skills.form.nameTooLong' }),
  categoryId: z.string().min(1, { message: 'skills.form.categoryRequired' }),
  iconSvg: z
    .string()
    .trim()
    .min(1, { message: 'skills.form.iconRequired' }),
});

type EditSkillFormValues = z.infer<typeof editSkillSchema>;

function toDefaultValues(skill: Skill): EditSkillFormValues {
  return {
    name: skill.name,
    categoryId: skill.categoryId,
    iconSvg: skill.iconSvg,
  };
}

export interface EditSkillFormProps {
  skill: Skill;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const EditSkillForm: FC<EditSkillFormProps> = ({
  skill,
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<EditSkillFormValues>({
    schema: editSkillSchema,
    defaultValues: toDefaultValues(skill),
  });
  const updateMutation = useUpdateSkill();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    form.reset(toDefaultValues(skill));
  }, [skill.id, skill.name, skill.categoryId, skill.iconSvg, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: skill.id,
        data: {
          name: data.name,
          iconSvg: data.iconSvg,
          categoryId: data.categoryId,
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
        labelKey="skills.form.name"
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
        labelKey="skills.form.category"
        name="categoryId"
        isRequired
        error={getDisplayErrorMessage(err.categoryId?.message, t)}
      >
        <Select
          id="categoryId"
          {...form.register('categoryId')}
          disabled={updateMutation.isPending}
          options={[
            { value: '', label: t('skills.form.selectCategory') },
            ...categories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          ]}
        />
      </FormField>

      <FormField
        labelKey="skills.form.iconLabel"
        name="iconSvg"
        isRequired
        error={getDisplayErrorMessage(err.iconSvg?.message, t)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Textarea
              id="iconSvg"
              {...form.register('iconSvg')}
              disabled={updateMutation.isPending}
              rows={8}
              placeholder="<svg>...</svg>"
            />
          </div>
          <div className="flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50">
            <SvgPreview svgCode={form.watch('iconSvg')} size={64} />
          </div>
        </div>
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
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};
