import { FC } from 'react';
import { useCreateCity } from '../model';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input } from '@/shared/ui';
import { z } from 'zod';

const latLongSchema = z
  .string()
  .trim()
  .min(1, { message: 'cities.form.latitudeRequired' })
  .refine((v) => !Number.isNaN(Number(v)), {
    message: 'cities.form.latitudeInvalid',
  })
  .refine((v) => {
    const n = Number(v);
    return n >= -90 && n <= 90;
  }, { message: 'cities.form.latitudeInvalid' });

const lngSchema = z
  .string()
  .trim()
  .min(1, { message: 'cities.form.longitudeRequired' })
  .refine((v) => !Number.isNaN(Number(v)), {
    message: 'cities.form.longitudeInvalid',
  })
  .refine((v) => {
    const n = Number(v);
    return n >= -180 && n <= 180;
  }, { message: 'cities.form.longitudeInvalid' });

const createCitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'cities.form.nameRequired' })
    .max(100, { message: 'cities.form.nameTooLong' }),
  latitude: latLongSchema,
  longitude: lngSchema,
});

type CreateCityFormValues = z.infer<typeof createCitySchema>;

const defaultValues: CreateCityFormValues = {
  name: '',
  latitude: '',
  longitude: '',
};

export interface CreateCityFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateCityForm: FC<CreateCityFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<CreateCityFormValues>({
    schema: createCitySchema,
    defaultValues,
  });
  const createMutation = useCreateCity();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      });
      form.reset(defaultValues);
      onSuccess();
    } catch {
      // Backend errors handled in mutation
    }
  });

  const handleCancel = () => {
    form.reset(defaultValues);
    onCancel?.();
  };

  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        labelKey="cities.form.name"
        name="name"
        isRequired
        error={getDisplayErrorMessage(err.name?.message, t)}
      >
        <Input
          id="name"
          {...form.register('name')}
          disabled={createMutation.isPending}
          placeholder={t('cities.form.namePlaceholder')}
          maxLength={100}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          labelKey="cities.form.latitude"
          name="latitude"
          isRequired
          error={getDisplayErrorMessage(err.latitude?.message, t)}
        >
          <Input
            id="latitude"
            type="number"
            step="any"
            {...form.register('latitude')}
            disabled={createMutation.isPending}
            placeholder={t('cities.form.latitudePlaceholder')}
          />
        </FormField>

        <FormField
          labelKey="cities.form.longitude"
          name="longitude"
          isRequired
          error={getDisplayErrorMessage(err.longitude?.message, t)}
        >
          <Input
            id="longitude"
            type="number"
            step="any"
            {...form.register('longitude')}
            disabled={createMutation.isPending}
            placeholder={t('cities.form.longitudePlaceholder')}
          />
        </FormField>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium mb-2">
          💡 {t('cities.form.coordinatesExamplesTitle')}
        </p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>{t('cities.form.exampleTelAviv')}</li>
          <li>{t('cities.form.exampleJerusalem')}</li>
          <li>{t('cities.form.exampleHaifa')}</li>
          <li>{t('cities.form.exampleBeerSheva')}</li>
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
