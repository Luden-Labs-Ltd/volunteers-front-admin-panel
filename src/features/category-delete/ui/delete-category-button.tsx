import { FC, useState } from 'react';
import { useDeleteCategory } from '@/entities/category';
import { Button, Modal } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

export interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  onSuccess?: () => void;
}

export const DeleteCategoryButton: FC<DeleteCategoryButtonProps> = ({
  categoryId,
  categoryName,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteMutation = useDeleteCategory();
  const { t } = useI18n();
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(categoryId);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      // Ошибка обрабатывается в хуке
      // Если ошибка связана с зависимостями, модальное окно остается открытым
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={deleteMutation.isPending}
        className="text-red-600 hover:text-red-700 hover:border-red-700"
      >
        {t('common.delete')}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t('common.deleteConfirmTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {t('categories.delete.confirm', { name: categoryName })}
            <strong>{categoryName}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            {t('categories.delete.confirmNote')}
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={deleteMutation.isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? t('common.deleting') : t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
