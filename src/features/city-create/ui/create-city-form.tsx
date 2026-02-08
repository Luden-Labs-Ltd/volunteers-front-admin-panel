import { FC, useState } from 'react';
import { useCreateCity } from '../model';
import { Button, Input } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export interface CreateCityFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateCityForm: FC<CreateCityFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateCity();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('cities.form.nameRequired');
    } else if (name.length > 100) {
      newErrors.name = t('cities.form.nameTooLong');
    }

    const latNum = parseFloat(latitude);
    if (!latitude.trim()) {
      newErrors.latitude = t('cities.form.latitudeRequired');
    } else if (isNaN(latNum)) {
      newErrors.latitude = t('cities.form.latitudeInvalid');
    } else if (latNum < -90 || latNum > 90) {
      newErrors.latitude = t('cities.form.latitudeInvalid');
    }

    const lngNum = parseFloat(longitude);
    if (!longitude.trim()) {
      newErrors.longitude = t('cities.form.longitudeRequired');
    } else if (isNaN(lngNum)) {
      newErrors.longitude = t('cities.form.longitudeInvalid');
    } else if (lngNum < -180 || lngNum > 180) {
      newErrors.longitude = t('cities.form.longitudeInvalid');
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
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      onSuccess();
      // Сброс формы
      setName('');
      setLatitude('');
      setLongitude('');
      setErrors({});
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  const handleCancel = () => {
    setName('');
    setLatitude('');
    setLongitude('');
    setErrors({});
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label={t('cities.form.name')}
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
          placeholder={t('cities.form.namePlaceholder')}
          maxLength={100}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label={t('cities.form.latitude')}
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => {
              setLatitude(e.target.value);
              if (errors.latitude) {
                setErrors((prev) => ({ ...prev, latitude: '' }));
              }
            }}
            error={errors.latitude}
            required
            disabled={createMutation.isPending}
            placeholder={t('cities.form.latitudePlaceholder')}
          />
        </div>

        <div>
          <Input
            label={t('cities.form.longitude')}
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => {
              setLongitude(e.target.value);
              if (errors.longitude) {
                setErrors((prev) => ({ ...prev, longitude: '' }));
              }
            }}
            error={errors.longitude}
            required
            disabled={createMutation.isPending}
            placeholder={t('cities.form.longitudePlaceholder')}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium mb-2">
          💡 {t('cities.form.coordinatesExamplesTitle')}
        </p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>Tel Aviv: 32.0853, 34.7818</li>
          <li>Jerusalem: 31.7683, 35.2137</li>
          <li>Haifa: 32.7940, 34.9896</li>
          <li>Be'er Sheva: 31.2530, 34.7915</li>
        </ul>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={createMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending 
            ? t('cities.form.creating')
            : t('cities.form.create')}
        </Button>
      </div>
    </form>
  );
};
