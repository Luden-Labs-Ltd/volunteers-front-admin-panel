import { FC, useState } from 'react';
import { Button, Modal } from '@/shared/ui';
import { useUnassignVolunteer } from '../model';
import { useI18n } from '@/shared/lib/i18n';

export interface UnassignVolunteerButtonProps {
  taskId: string;
  taskStatus: 'active' | 'in_progress' | 'completed' | 'cancelled';
  onSuccess?: () => void;
}

export const UnassignVolunteerButton: FC<UnassignVolunteerButtonProps> = ({
  taskId,
  taskStatus,
  onSuccess,
}) => {
  const { t } = useI18n();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const unassignMutation = useUnassignVolunteer();

  // Показываем кнопку только для задач со статусом in_progress
  if (taskStatus !== 'in_progress') {
    return null;
  }

  const handleUnassign = async () => {
    try {
      await unassignMutation.mutateAsync(taskId);
      setIsConfirmOpen(false);
      onSuccess?.();
    } catch (error) {
      // Ошибка обрабатывается в хуке через toast
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsConfirmOpen(true)}
        size="sm"
        variant="ghost"
        className="text-red-600 hover:text-red-700 hover:border-red-700"
        disabled={unassignMutation.isPending}
      >
        {t('tasks.unassignVolunteer')}
      </Button>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={t('common.deleteConfirmTitle')}
      >
        <div className="space-y-4">
          <p className="text-gray-700">{t('tasks.unassignConfirm')}</p>
          <p className="text-sm text-gray-500">
            {t('common.deleteIrreversible')}
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsConfirmOpen(false)}
              disabled={unassignMutation.isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleUnassign}
              disabled={unassignMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {unassignMutation.isPending
                ? t('common.deleting')
                : t('tasks.unassignVolunteer')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
