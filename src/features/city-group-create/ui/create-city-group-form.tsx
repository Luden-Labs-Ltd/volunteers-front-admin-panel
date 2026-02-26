import { FC, useState } from 'react';
import { useCreateCityGroup } from '@/entities/city-group';
import { useGetCities } from '@/entities/city';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';
import { Button, Input } from '@/shared/ui';
import { z } from 'zod';

const createCityGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'cityGroups.form.nameRequired' })
    .max(255, { message: 'cityGroups.form.nameTooLong' }),
});

type CreateCityGroupFormValues = z.infer<typeof createCityGroupSchema>;

export interface CreateCityGroupFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateCityGroupForm: FC<CreateCityGroupFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);

  const form = useZodForm<CreateCityGroupFormValues>({
    schema: createCityGroupSchema,
    defaultValues: { name: '' },
  });
  const createMutation = useCreateCityGroup();
  const { data: cities = [] } = useGetCities();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        cityIds: selectedCityIds.length ? selectedCityIds : undefined,
      });
      showToast.success(t('cityGroups.createSuccess'));
      form.reset({ name: '' });
      setSelectedCityIds([]);
      onSuccess();
    } catch (err) {
      showToast.error((err as Error).message || t('common.error'));
    }
  });

  const toggleCity = (id: string) => {
    setSelectedCityIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

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
          disabled={createMutation.isPending}
        />
      </FormField>
      <FormField
        labelKey="cityGroups.form.citiesLabel"
        name="cities"
      >
        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-1">
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
      </FormField>
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
