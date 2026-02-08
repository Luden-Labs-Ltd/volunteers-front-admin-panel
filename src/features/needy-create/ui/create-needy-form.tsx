import { FC, useState } from 'react';
import { useCreateNeedy } from '../model';
import { usePrograms } from '@/entities/program';
import { Button, Input, Select, Textarea } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useGetCities } from '@/entities/city';

export interface CreateNeedyFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateNeedyForm: FC<CreateNeedyFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [programId, setProgramId] = useState('');
  const [cityId, setCityId] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');
  const [about, setAbout] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateNeedy();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const { data: cities = [], isLoading: citiesLoading } = useGetCities();

  // Фильтруем только активные программы
  const activePrograms = programs.filter((program) => program.isActive);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = t('needy.form.firstNameRequired');
    } else if (firstName.length > 100) {
      newErrors.firstName =
        t('needy.form.firstNameTooLong');
    }

    if (!lastName.trim()) {
      newErrors.lastName =
        t('needy.form.lastNameRequired');
    } else if (lastName.length > 100) {
      newErrors.lastName =
        t('needy.form.lastNameTooLong') ||
        'Фамилия не должна превышать 100 символов';
    }

    if (!phone.trim()) {
      newErrors.phone = t('needy.form.phoneRequired');
    }

    if (!programId) {
      newErrors.programId =
        t('needy.form.programRequired');
    }

    if (!cityId) {
      newErrors.cityId =
        t('needy.form.cityRequired');
    }

    if (!address.trim()) {
      newErrors.address =
        t('needy.form.addressRequired');
    } else if (address.length > 500) {
      newErrors.address =
        t('needy.form.addressTooLong');
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
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        programId,
        cityId,
        address: address.trim(),
        photo: photo.trim() || undefined,
        about: about.trim() || undefined,
        role: 'needy',
        status: 'approved',
      });
      onSuccess();
      // Сброс формы
      setFirstName('');
      setLastName('');
      setPhone('');
      setProgramId('');
      setCityId('');
      setAddress('');
      setPhoto('');
      setAbout('');
      setErrors({});
    } catch (error: unknown) {
      // Обработка ошибки уникальности телефона
      if (
        error instanceof Error &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string' &&
        (error.response.data.message.includes('already exists') ||
          error.response.data.message.includes('уже существует'))
      ) {
        setErrors({
          phone:
            t('needy.form.phoneExists') ||
            'Телефон уже используется другим пользователем',
        });
      }
      // Остальные ошибки обрабатываются в хуке через toast
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('needy.form.firstName')}
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            if (errors.firstName) {
              setErrors((prev) => ({ ...prev, firstName: '' }));
            }
          }}
          error={errors.firstName}
          required
          disabled={createMutation.isPending}
          maxLength={100}
        />

        <Input
          label={t('needy.form.lastName')}
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            if (errors.lastName) {
              setErrors((prev) => ({ ...prev, lastName: '' }));
            }
          }}
          error={errors.lastName}
          required
          disabled={createMutation.isPending}
          maxLength={100}
        />
      </div>

      <Input
        label={t('needy.form.phone')}
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          if (errors.phone) {
            setErrors((prev) => ({ ...prev, phone: '' }));
          }
        }}
        error={errors.phone}
        required
        disabled={createMutation.isPending}
        placeholder="+79991234567"
      />

      <Select
        label={t('needy.form.program')}
        value={programId}
        onChange={(e) => {
          setProgramId(e.target.value);
          if (errors.programId) {
            setErrors((prev) => ({ ...prev, programId: '' }));
          }
        }}
        error={errors.programId}
        required
        disabled={createMutation.isPending || programsLoading}
        options={[
          { value: '', label: t('needy.form.selectProgram') },
          ...activePrograms.map((program) => ({
            value: program.id,
            label: program.name,
          })),
        ]}
      />

      {activePrograms.length === 0 && !programsLoading && (
        <p className="text-sm text-gray-500">
          {t('needy.form.noPrograms')}
        </p>
      )}

      <Select
        label={t('needy.form.city')}
        value={cityId}
        onChange={(e) => {
          setCityId(e.target.value);
          if (errors.cityId) {
            setErrors((prev) => ({ ...prev, cityId: '' }));
          }
        }}
        error={errors.cityId}
        required
        disabled={createMutation.isPending || citiesLoading}
        options={[
          { value: '', label: t('needy.form.selectCity') },
          ...cities.map((city) => ({
            value: city.id,
            label: city.name,
          })),
        ]}
      />

      {cities.length === 0 && !citiesLoading && (
        <p className="text-sm text-gray-500">
          {t('needy.form.noCities')}
        </p>
      )}

      <Input
        label={t('needy.form.address')}
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          if (errors.address) {
            setErrors((prev) => ({ ...prev, address: '' }));
          }
        }}
        error={errors.address}
        required
        disabled={createMutation.isPending}
        placeholder={t('needy.form.addressPlaceholder')}
        maxLength={500}
      />

      <Input
        label={t('needy.form.photo')}
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        disabled={createMutation.isPending}
        placeholder={t('needy.form.photoPlaceholder')}
      />

      <Textarea
        label={t('needy.form.about')}
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        disabled={createMutation.isPending}
        rows={4}
      />

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
