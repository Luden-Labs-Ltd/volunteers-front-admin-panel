import { FC, useState, useEffect } from 'react';
import { useSetGroupCities } from '@/entities/city-group';
import { useGetCities } from '@/entities/city';
import { Button } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';
import type { CityGroup } from '@/entities/city-group';

export interface ManageCitiesFormProps {
  group: CityGroup;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const ManageCitiesForm: FC<ManageCitiesFormProps> = ({
  group,
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);

  const setCitiesMutation = useSetGroupCities();
  const { data: cities = [] } = useGetCities();

  useEffect(() => {
    setSelectedCityIds(group.cities?.map((c) => c.id) ?? []);
  }, [group.id, group.cities]);

  const toggleCity = (id: string) => {
    setSelectedCityIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setCitiesMutation.mutateAsync({
        id: group.id,
        data: { cityIds: selectedCityIds },
      });
      showToast.success(t('cityGroups.citiesUpdateSuccess'));
      onSuccess();
    } catch (err) {
      showToast.error((err as Error).message || t('common.error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('cityGroups.form.citiesLabel')}
        </label>
        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-1">
          {cities.map((city) => (
            <label
              key={city.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
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
        <Button type="submit" disabled={setCitiesMutation.isPending}>
          {setCitiesMutation.isPending ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};
