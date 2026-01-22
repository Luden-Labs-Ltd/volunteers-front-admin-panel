import { FC, useState } from 'react';
import { useCreateNeedy } from '../model';
import { usePrograms } from '@/entities/program';
import { Button, Input, Select, Textarea } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

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
  const [photo, setPhoto] = useState('');
  const [about, setAbout] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateNeedy();
  const { data: programs = [], isLoading: programsLoading } = usePrograms();

  // Фильтруем только активные программы
  const activePrograms = programs.filter((program) => program.isActive);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = t('needy.form.firstNameRequired') || 'Имя обязательно';
    } else if (firstName.length > 100) {
      newErrors.firstName =
        t('needy.form.firstNameTooLong') || 'Имя не должно превышать 100 символов';
    }

    if (!lastName.trim()) {
      newErrors.lastName =
        t('needy.form.lastNameRequired') || 'Фамилия обязательна';
    } else if (lastName.length > 100) {
      newErrors.lastName =
        t('needy.form.lastNameTooLong') ||
        'Фамилия не должна превышать 100 символов';
    }

    if (!phone.trim()) {
      newErrors.phone = t('needy.form.phoneRequired') || 'Телефон обязателен';
    }

    if (!programId) {
      newErrors.programId =
        t('needy.form.programRequired') || 'Программа обязательна';
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
      setPhoto('');
      setAbout('');
      setErrors({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Обработка ошибки уникальности телефона
      if (
        error?.response?.data?.message?.includes('already exists') ||
        error?.response?.data?.message?.includes('уже существует')
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
          label={t('needy.form.firstName') || 'Имя *'}
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
          label={t('needy.form.lastName') || 'Фамилия *'}
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
        label={t('needy.form.phone') || 'Телефон *'}
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
        label={t('needy.form.program') || 'Программа *'}
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
          { value: '', label: t('needy.form.selectProgram') || 'Выберите программу' },
          ...activePrograms.map((program) => ({
            value: program.id,
            label: program.name,
          })),
        ]}
      />

      {activePrograms.length === 0 && !programsLoading && (
        <p className="text-sm text-gray-500">
          {t('needy.form.noPrograms') || 'Нет доступных программ'}
        </p>
      )}

      <Input
        label={t('needy.form.photo') || 'Фото (URL)'}
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        disabled={createMutation.isPending}
        placeholder="https://example.com/photo.jpg"
      />

      <Textarea
        label={t('needy.form.about') || 'Описание'}
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
            {t('common.cancel') || 'Отмена'}
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending
            ? t('needy.form.creating') || 'Создание...'
            : t('needy.form.create') || 'Создать'}
        </Button>
      </div>
    </form>
  );
};
