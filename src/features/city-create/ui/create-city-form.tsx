import { FC, useState } from 'react';
import { useCreateCity } from '../model';
import { Button, Input } from '@/shared/ui';

export interface CreateCityFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateCityForm: FC<CreateCityFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateCity();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Название города обязательно';
    } else if (name.length > 100) {
      newErrors.name = 'Название не должно превышать 100 символов';
    }

    const latNum = parseFloat(latitude);
    if (!latitude.trim()) {
      newErrors.latitude = 'Широта обязательна';
    } else if (isNaN(latNum)) {
      newErrors.latitude = 'Широта должна быть числом';
    } else if (latNum < -90 || latNum > 90) {
      newErrors.latitude = 'Широта должна быть от -90 до 90';
    }

    const lngNum = parseFloat(longitude);
    if (!longitude.trim()) {
      newErrors.longitude = 'Долгота обязательна';
    } else if (isNaN(lngNum)) {
      newErrors.longitude = 'Долгота должна быть числом';
    } else if (lngNum < -180 || lngNum > 180) {
      newErrors.longitude = 'Долгота должна быть от -180 до 180';
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
          label="Название города *"
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
          placeholder="Например: Tel Aviv"
          maxLength={100}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Широта (Latitude) *"
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
            placeholder="32.0853"
          />
          <p className="mt-1 text-xs text-gray-500">
            Диапазон: от -90 до 90
          </p>
        </div>

        <div>
          <Input
            label="Долгота (Longitude) *"
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
            placeholder="34.7818"
          />
          <p className="mt-1 text-xs text-gray-500">
            Диапазон: от -180 до 180
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium mb-2">
          💡 Примеры координат для израильских городов:
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
            Отмена
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Создание...' : 'Создать город'}
        </Button>
      </div>
    </form>
  );
};
