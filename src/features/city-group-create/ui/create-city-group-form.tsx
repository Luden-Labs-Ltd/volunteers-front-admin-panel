import { FC, useState } from 'react';
import { useCreateCityGroup } from '@/entities/city-group';
import { useGetCities } from '@/entities/city';
import { Button, Input } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';

export interface CreateCityGroupFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateCityGroupForm: FC<CreateCityGroupFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateCityGroup();
  const { data: cities = [] } = useGetCities();

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
      await createMutation.mutateAsync({
        name: name.trim(),
        cityIds: selectedCityIds.length ? selectedCityIds : undefined,
      });
      showToast.success(t('cityGroups.createSuccess'));
      onSuccess();
    } catch (err) {
      showToast.error((err as Error).message || t('common.error'));
    }
  };

  const toggleCity = (id: string) => {
    setSelectedCityIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('cityGroups.form.citiesLabel')}
        </label>
        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-1">
          {cities.map((city) => (
            <label key={city.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selectedCityIds.includes(city.id)}
                onChange={() => toggleCity(city.id)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{city.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? t('common.creating') : t('common.create')}
        </Button>
      </div>
    </form>
  );
};
