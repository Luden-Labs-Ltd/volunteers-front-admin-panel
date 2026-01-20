import { FC, useState } from 'react';
import { useCreateTask } from '@/entities/task';
import { usePrograms } from '@/entities/program';
import { useCategories } from '@/entities/category';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Input, Select, Textarea } from '@/shared/ui';

export interface CreateTaskFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const CreateTaskForm: FC<CreateTaskFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useI18n();
  const [programId, setProgramId] = useState('');
  const [needyId, setNeedyId] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [points, setPoints] = useState<number>(10);
  const [categoryId, setCategoryId] = useState('');
  const [firstResponseMode, setFirstResponseMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateTask();
  const { data: programs = [] } = usePrograms();
  const { data: categories = [] } = useCategories();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!programId.trim()) {
      newErrors.programId = t('tasks.form.programRequired');
    }
    if (!needyId.trim()) {
      newErrors.needyId = t('tasks.form.needyRequired');
    }
    if (!type.trim()) {
      newErrors.type = t('tasks.form.typeRequired');
    }
    if (!title.trim()) {
      newErrors.title = t('tasks.form.titleRequired');
    } else if (title.length > 500) {
      newErrors.title = t('tasks.form.titleTooLong');
    }
    if (!description.trim()) {
      newErrors.description = t('tasks.form.descriptionRequired');
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
        programId: programId.trim(),
        needyId: needyId.trim(),
        type: type.trim(),
        title: title.trim(),
        description: description.trim(),
        details: details.trim() || undefined,
        points: points || 10,
        categoryId: categoryId || undefined,
        firstResponseMode,
      });
      onSuccess();
      // Сброс формы
      setProgramId('');
      setNeedyId('');
      setType('');
      setTitle('');
      setDescription('');
      setDetails('');
      setPoints(10);
      setCategoryId('');
      setFirstResponseMode(false);
      setErrors({});
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select
          label={t('tasks.form.program')}
          value={programId}
          onChange={(e) => {
            setProgramId(e.target.value);
            if (errors.programId) {
              setErrors((prev) => ({ ...prev, programId: '' }));
            }
          }}
          error={errors.programId}
          required
          disabled={createMutation.isPending}
          options={[
            { value: '', label: t('tasks.form.selectProgram') },
            ...programs.map((program) => ({
              value: program.id,
              label: program.name,
            })),
          ]}
        />
      </div>

      <div>
        <Input
          label={t('tasks.form.needyId')}
          value={needyId}
          onChange={(e) => {
            setNeedyId(e.target.value);
            if (errors.needyId) {
              setErrors((prev) => ({ ...prev, needyId: '' }));
            }
          }}
          error={errors.needyId}
          required
          disabled={createMutation.isPending}
          placeholder="UUID нуждающегося"
        />
      </div>

      <div>
        <Input
          label={t('tasks.form.type')}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            if (errors.type) {
              setErrors((prev) => ({ ...prev, type: '' }));
            }
          }}
          error={errors.type}
          required
          disabled={createMutation.isPending}
          placeholder={t('tasks.form.typePlaceholder')}
        />
      </div>

      <div>
        <Input
          label={t('tasks.form.title')}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: '' }));
            }
          }}
          error={errors.title}
          required
          disabled={createMutation.isPending}
        />
      </div>

      <div>
        <Textarea
          label={t('tasks.form.description')}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: '' }));
            }
          }}
          error={errors.description}
          required
          disabled={createMutation.isPending}
          rows={4}
        />
      </div>

      <div>
        <Textarea
          label={t('tasks.form.details')}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          disabled={createMutation.isPending}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label={t('tasks.form.points')}
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value) || 10)}
            disabled={createMutation.isPending}
            min={0}
          />
        </div>

        <div>
          <Select
            label={t('tasks.form.category')}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={createMutation.isPending}
            options={[
              { value: '', label: t('tasks.form.selectCategory') },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="firstResponseMode"
          checked={firstResponseMode}
          onChange={(e) => setFirstResponseMode(e.target.checked)}
          disabled={createMutation.isPending}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="firstResponseMode" className="text-sm text-gray-700">
          {t('tasks.form.firstResponseMode')}
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
          {createMutation.isPending
            ? t('common.creating')
            : t('tasks.create')}
        </Button>
      </div>
    </form>
  );
};
