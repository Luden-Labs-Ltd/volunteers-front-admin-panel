import { FC, useState, useEffect } from 'react';
import { useUpdateCategory, type Category } from '@/entities/category';
import { Button, Input, Textarea } from '@/shared/ui';
import { SvgPreview } from '@/features/svg-preview';
import { validateSvg } from '@/shared/lib/utils';

export interface EditCategoryFormProps {
  category: Category;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const EditCategoryForm: FC<EditCategoryFormProps> = ({
  category,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(category.name);
  const [iconSvg, setIconSvg] = useState(category.iconSvg);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateCategory();

  useEffect(() => {
    setName(category.name);
    setIconSvg(category.iconSvg);
    setErrors({});
  }, [category]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Название обязательно';
    } else if (name.length > 255) {
      newErrors.name = 'Название не должно превышать 255 символов';
    }

    if (!iconSvg.trim()) {
      newErrors.iconSvg = 'SVG иконка обязательна';
    } else {
      const svgValidation = validateSvg(iconSvg);
      if (!svgValidation.isValid) {
        newErrors.iconSvg = svgValidation.error || 'Невалидный SVG код';
      }
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
        id: category.id,
        data: {
          name: name.trim(),
          iconSvg: iconSvg.trim(),
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
          label="Название *"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SVG Иконка * (предпросмотр в реальном времени)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Textarea
              value={iconSvg}
              onChange={(e) => {
                setIconSvg(e.target.value);
                if (errors.iconSvg) {
                  setErrors((prev) => ({ ...prev, iconSvg: '' }));
                }
              }}
              error={errors.iconSvg}
              disabled={updateMutation.isPending}
              rows={8}
              placeholder="<svg>...</svg>"
            />
          </div>
          <div className="flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50">
            <SvgPreview svgCode={iconSvg} size={64} />
          </div>
        </div>
        {errors.iconSvg && (
          <p className="mt-1 text-sm text-red-600">{errors.iconSvg}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={updateMutation.isPending}
          >
            Отмена
          </Button>
        )}
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
};
