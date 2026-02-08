import { FC, useState } from 'react';
import { useCreateProgram } from '@/entities/program';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Textarea } from '@/shared/ui';

export interface CreateProgramFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateProgramForm: FC<CreateProgramFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateProgram();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('programs.form.nameRequired');
    } else if (name.length > 255) {
      newErrors.name = t('programs.form.nameTooLong');
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
        description: description.trim() || undefined,
        isActive,
      });
      onSuccess();
      // Сброс формы
      setName('');
      setDescription('');
      setIsActive(true);
      setErrors({});
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label={t('programs.form.nameLabel')}
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
        />
      </div>

      <div>
        <Textarea
          label={t('programs.form.descriptionLabel')}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: '' }));
            }
          }}
          error={errors.description}
          disabled={createMutation.isPending}
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          disabled={createMutation.isPending}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          {t('programs.form.isActiveLabel')}
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? t('common.creating') : t('programs.create')}
        </Button>
      </div>
    </form>
  );
};
