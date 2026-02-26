import { FC } from 'react';
import { useCreateNeedy } from '../model';
import { useGetCities } from '@/entities/city';
import { usePrograms } from '@/entities/program';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Select, Textarea } from '@/shared/ui';
import { z } from 'zod';

const createNeedySchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'needy.form.firstNameRequired' })
    .max(100, { message: 'needy.form.firstNameTooLong' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'needy.form.lastNameRequired' })
    .max(100, { message: 'needy.form.lastNameTooLong' }),
  phone: z.string().trim().min(1, { message: 'needy.form.phoneRequired' }),
  programId: z.preprocess(
    (v: unknown) => (v === undefined || v === null ? '' : v),
    z.string().min(1, { message: 'needy.form.programRequired' }),
  ),
  cityId: z.preprocess(
    (v: unknown) => (v === undefined || v === null ? '' : v),
    z.string().min(1, { message: 'needy.form.cityRequired' }),
  ),
  address: z
    .string()
    .trim()
    .min(1, { message: 'needy.form.addressRequired' })
    .max(500, { message: 'needy.form.addressTooLong' }),
  photo: z.string().optional(),
  about: z.string().optional(),
});

type CreateNeedyFormValues = z.infer<typeof createNeedySchema>;

const defaultValues: CreateNeedyFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  programId: '',
  cityId: '',
  address: '',
  photo: '',
  about: '',
};

export interface CreateNeedyFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateNeedyForm: FC<CreateNeedyFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<CreateNeedyFormValues>({
    schema: createNeedySchema,
    defaultValues,
  });
  const createMutation = useCreateNeedy();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const { data: cities = [], isLoading: citiesLoading } = useGetCities();

  const activePrograms = programs.filter((p) => p.isActive);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        programId: data.programId,
        cityId: data.cityId,
        address: data.address,
        photo: data.photo?.trim() || undefined,
        about: data.about?.trim() || undefined,
        role: 'needy',
        status: 'approved',
      });
      form.reset(defaultValues);
      onSuccess();
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof (error.response.data as { message: string }).message === 'string' &&
        ((error.response.data as { message: string }).message.includes('already exists') ||
          (error.response.data as { message: string }).message.includes('уже существует'))
      ) {
        form.setError('phone', {
          type: 'manual',
          message: 'needy.form.phoneExists',
        });
      }
    }
  });

  const handleCancel = () => onCancel?.();
  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          labelKey="needy.form.firstName"
          name="firstName"
          isRequired
          error={getDisplayErrorMessage(err.firstName?.message, t)}
        >
          <Input
            id="firstName"
            {...form.register('firstName')}
            disabled={createMutation.isPending}
            maxLength={100}
          />
        </FormField>

        <FormField
          labelKey="needy.form.lastName"
          name="lastName"
          isRequired
          error={getDisplayErrorMessage(err.lastName?.message, t)}
        >
          <Input
            id="lastName"
            {...form.register('lastName')}
            disabled={createMutation.isPending}
            maxLength={100}
          />
        </FormField>
      </div>

      <FormField
        labelKey="needy.form.phone"
        name="phone"
        isRequired
        error={getDisplayErrorMessage(err.phone?.message, t)}
      >
        <Input
          id="phone"
          {...form.register('phone')}
          disabled={createMutation.isPending}
          placeholder={t('needy.form.phonePlaceholder')}
        />
      </FormField>

      <FormField
        labelKey="needy.form.program"
        name="programId"
        isRequired
        error={getDisplayErrorMessage(err.programId?.message, t)}
      >
        <Select
          id="programId"
          {...form.register('programId')}
          disabled={createMutation.isPending || programsLoading}
          options={[
            { value: '', label: t('needy.form.selectProgram') },
            ...activePrograms.map((program) => ({
              value: program.id,
              label: program.name,
            })),
          ]}
        />
      </FormField>

      {activePrograms.length === 0 && !programsLoading && (
        <p className="text-sm text-gray-500">{t('needy.form.noPrograms')}</p>
      )}

      <FormField
        labelKey="needy.form.city"
        name="cityId"
        isRequired
        error={getDisplayErrorMessage(err.cityId?.message, t)}
      >
        <Select
          id="cityId"
          {...form.register('cityId')}
          disabled={createMutation.isPending || citiesLoading}
          options={[
            { value: '', label: t('needy.form.selectCity') },
            ...cities.map((city) => ({
              value: city.id,
              label: city.name,
            })),
          ]}
        />
      </FormField>

      {cities.length === 0 && !citiesLoading && (
        <p className="text-sm text-gray-500">{t('needy.form.noCities')}</p>
      )}

      <FormField
        labelKey="needy.form.address"
        name="address"
        isRequired
        error={getDisplayErrorMessage(err.address?.message, t)}
      >
        <Input
          id="address"
          {...form.register('address')}
          disabled={createMutation.isPending}
          placeholder={t('needy.form.addressPlaceholder')}
          maxLength={500}
        />
      </FormField>

      <FormField labelKey="needy.form.photo" name="photo">
        <Input
          id="photo"
          {...form.register('photo')}
          disabled={createMutation.isPending}
          placeholder={t('needy.form.photoPlaceholder')}
        />
      </FormField>

      <FormField labelKey="needy.form.about" name="about">
        <Textarea
          id="about"
          {...form.register('about')}
          disabled={createMutation.isPending}
          rows={4}
        />
      </FormField>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={createMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending
            ? t('needy.form.creating')
            : t('needy.form.create')}
        </Button>
      </div>
    </form>
  );
};
