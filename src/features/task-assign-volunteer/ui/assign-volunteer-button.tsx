import { FC, useState } from 'react';
import { Button } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { AssignVolunteerModal } from './assign-volunteer-modal';

export interface AssignVolunteerButtonProps {
  taskId: string;
  programId: string;
  currentVolunteerId?: string;
  taskStatus: 'active' | 'in_progress' | 'completed' | 'cancelled';
  onSuccess?: () => void;
}

export const AssignVolunteerButton: FC<AssignVolunteerButtonProps> = ({
  taskId,
  programId,
  currentVolunteerId,
  taskStatus,
  onSuccess,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  // Показываем кнопку только для задач со статусом active или in_progress
  if (taskStatus === 'completed' || taskStatus === 'cancelled') {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="ghost"
      >
        {t('tasks.assignVolunteer')}
      </Button>
      <AssignVolunteerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        taskId={taskId}
        programId={programId}
        currentVolunteerId={currentVolunteerId}
        onSuccess={() => {
          setIsOpen(false);
          onSuccess?.();
        }}
      />
    </>
  );
};
