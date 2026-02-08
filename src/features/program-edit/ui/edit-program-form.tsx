import { FC, useState, useEffect } from 'react';
import { useUpdateProgram, type Program } from '@/entities/program';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Textarea } from '@/shared/ui';

export interface EditProgramFormProps {
  program: Program;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const EditProgramForm: FC<EditProgramFormProps> = ({
  program,
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState(program.name);
  const [description, setDescription] = useState(program.description || '');
  const [isActive, setIsActive] = useState(program.isActive);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateProgram();

  useEffect(() => {
    setName(program.name);
    setDescription(program.description || '');
    setIsActive(program.isActive);
    setErrors({});
  }, [program]);

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
      await updateMutation.mutateAsync({
        id: program.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          isActive,
        },
      });
      onSuccess();
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
          disabled={updateMutation.isPending}
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
          disabled={updateMutation.isPending}
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          disabled={updateMutation.isPending}
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
            disabled={updateMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};
