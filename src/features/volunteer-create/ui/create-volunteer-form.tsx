import { FC } from 'react';
import { useCreateVolunteer } from '../model';
import { useGetCities } from '@/entities/city';
import { useSkills } from '@/entities/skill';
import { FormField, getDisplayErrorMessage, useZodForm } from '@/shared/form';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Select, Textarea } from '@/shared/ui';
import { z } from 'zod';

const createVolunteerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'volunteer.form.firstNameRequired' })
    .max(100, { message: 'volunteer.form.firstNameTooLong' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'volunteer.form.lastNameRequired' })
    .max(100, { message: 'volunteer.form.lastNameTooLong' }),
  phone: z.string().trim().min(1, { message: 'volunteer.form.phoneRequired' }),
  cityId: z.preprocess(
    (v: unknown) => (v === undefined || v === null ? '' : v),
    z.string().min(1, { message: 'volunteer.form.cityRequired' }),
  ),
  skills: z.array(z.string()).optional(),
  photo: z.string().optional(),
  about: z.string().optional(),
});

type CreateVolunteerFormValues = z.infer<typeof createVolunteerSchema>;

const defaultValues: CreateVolunteerFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  cityId: '',
  skills: [],
  photo: '',
  about: '',
};

export interface CreateVolunteerFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateVolunteerForm: FC<CreateVolunteerFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const form = useZodForm<CreateVolunteerFormValues>({
    schema: createVolunteerSchema,
    defaultValues,
  });
  const createMutation = useCreateVolunteer();
  const { data: cities = [], isLoading: citiesLoading } = useGetCities();
  const { data: skills = [], isLoading: skillsLoading } = useSkills();

  const selectedSkills = form.watch('skills') ?? [];
  const handleToggleSkill = (skillId: string) => {
    const next = selectedSkills.includes(skillId)
      ? selectedSkills.filter((id) => id !== skillId)
      : [...selectedSkills, skillId];
    form.setValue('skills', next);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        cityId: data.cityId,
        skills: data.skills?.length ? data.skills : undefined,
        photo: data.photo?.trim() || undefined,
        about: data.about?.trim() || undefined,
        role: 'volunteer',
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
          message: 'volunteer.form.phoneExists',
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
          labelKey="volunteer.form.firstName"
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
          labelKey="volunteer.form.lastName"
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
        labelKey="volunteer.form.phone"
        name="phone"
        isRequired
        error={getDisplayErrorMessage(err.phone?.message, t)}
      >
        <Input
          id="phone"
          {...form.register('phone')}
          disabled={createMutation.isPending}
          placeholder={t('volunteer.form.phonePlaceholder')}
        />
      </FormField>

      <FormField
        labelKey="volunteer.form.city"
        name="cityId"
        isRequired
        error={getDisplayErrorMessage(err.cityId?.message, t)}
      >
        <Select
          id="cityId"
          {...form.register('cityId')}
          disabled={createMutation.isPending || citiesLoading}
          options={[
            { value: '', label: t('volunteer.form.selectCity') },
            ...cities.map((city) => ({
              value: city.id,
              label: city.name,
            })),
          ]}
        />
      </FormField>

      {cities.length === 0 && !citiesLoading && (
        <p className="text-sm text-gray-500">{t('volunteer.form.noCities')}</p>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('volunteer.form.skills')}
        </label>
        {skillsLoading ? (
          <p className="text-sm text-gray-500">{t('common.loading')}</p>
        ) : skills.length === 0 ? (
          <p className="text-sm text-gray-500">{t('volunteer.form.noSkills')}</p>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg border border-gray-200 p-3">
            {skills.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              return (
                <label
                  key={skill.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSkill(skill.id)}
                    disabled={createMutation.isPending}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">{skill.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <FormField labelKey="volunteer.form.photo" name="photo">
        <Input
          id="photo"
          {...form.register('photo')}
          disabled={createMutation.isPending}
          placeholder={t('volunteer.form.photoPlaceholder')}
        />
      </FormField>

      <FormField labelKey="volunteer.form.about" name="about">
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
            ? t('volunteer.form.creating')
            : t('volunteer.form.create')}
        </Button>
      </div>
    </form>
  );
};
