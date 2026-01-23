import { FC, useState } from 'react';
import { useDeleteTask } from '@/entities/task';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal } from '@/shared/ui';
import type { TaskStatus } from '@/entities/task';

export interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle: string;
  taskStatus: TaskStatus;
  onSuccess?: () => void;
}

export const DeleteTaskButton: FC<DeleteTaskButtonProps> = ({
  taskId,
  taskTitle,
  taskStatus,
  onSuccess,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const deleteMutation = useDeleteTask();

  // Не показываем кнопку удаления для отмененных задач
  if (taskStatus === 'cancelled') {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(taskId);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  return (
    <>
      <Button
        variant="ghost"
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
            {t('tasks.delete.confirm', { name: taskTitle })}
          </p>
          <p className="text-sm text-gray-500">
            {t('common.deleteIrreversible')}
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
              variant="danger"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending
                ? t('common.deleting')
                : t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
