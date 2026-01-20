import { FC, useState } from 'react';
import { useCreateSkill } from '@/entities/skill';
import { useCategories } from '@/entities/category';
import { SvgPreview } from '@/features/svg-preview';
import { useI18n } from '@/shared/lib/i18n';
import { validateSvg } from '@/shared/lib/utils';
import { Button, Input, Select, Textarea } from '@/shared/ui';

export interface CreateSkillFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateSkillForm: FC<CreateSkillFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [iconSvg, setIconSvg] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateSkill();
  const { data: categories = [] } = useCategories();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('skills.form.nameRequired');
    } else if (name.length > 255) {
      newErrors.name = t('skills.form.nameTooLong');
    }

    if (!categoryId) {
      newErrors.categoryId = t('skills.form.categoryRequired');
    }

    if (!iconSvg.trim()) {
      newErrors.iconSvg = t('skills.form.iconRequired');
    } else {
      const svgValidation = validateSvg(iconSvg);
      if (!svgValidation.isValid) {
        newErrors.iconSvg =
          svgValidation.error || t('skills.form.iconInvalidFallback');
      }
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
      await createMutation.mutateAsync({
        name: name.trim(),
        iconSvg: iconSvg.trim(),
        categoryId,
      });
      onSuccess();
      // Сброс формы
      setName('');
      setIconSvg('');
      setCategoryId('');
      setErrors({});
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label={`${t('skills.form.name')} *`}
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

      <div>
        <Select
          label={`${t('skills.form.category')} *`}
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            if (errors.categoryId) {
              setErrors((prev) => ({ ...prev, categoryId: '' }));
            }
          }}
          error={errors.categoryId}
          required
          disabled={createMutation.isPending}
          options={[
            { value: '', label: t('skills.form.selectCategory') },
            ...categories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('skills.form.iconLabel')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Textarea
              value={iconSvg}
              onChange={(e) => {
                setIconSvg(e.target.value);
                if (errors.iconSvg) {
                  setErrors((prev) => ({ ...prev, iconSvg: '' }));
                }
              }}
              error={errors.iconSvg}
              disabled={createMutation.isPending}
              rows={8}
              placeholder="<svg>...</svg>"
            />
          </div>
          <div className="flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50">
            <SvgPreview svgCode={iconSvg} size={64} />
          </div>
        </div>
        {errors.iconSvg && (
          <p className="mt-1 text-sm text-red-600">{errors.iconSvg}</p>
        )}
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
          {createMutation.isPending ? t('common.creating') : t('skills.create')}
        </Button>
      </div>
    </form>
  );
};
