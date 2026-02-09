import { FC, useState, useEffect } from 'react';
import { useUpdateCityGroup } from '@/entities/city-group';
import { Button, Input } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';
import type { CityGroup } from '@/entities/city-group';

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
  const [name, setName] = useState(group.name);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateCityGroup();

  useEffect(() => {
    setName(group.name);
  }, [group.id, group.name]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = t('cityGroups.form.nameRequired');
    } else if (name.length > 255) {
      newErrors.name = t('cityGroups.form.nameTooLong');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await updateMutation.mutateAsync({ id: group.id, data: { name: name.trim() } });
      showToast.success(t('cityGroups.updateSuccess'));
      onSuccess();
    } catch (err) {
      showToast.error((err as Error).message || t('common.error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('cityGroups.form.nameLabel')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />
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
