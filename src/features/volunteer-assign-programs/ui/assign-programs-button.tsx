import { FC, useState } from 'react';
import { Button } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { AssignProgramsModal } from './assign-programs-modal';

export interface AssignProgramsButtonProps {
  volunteerId: string;
  onSuccess?: () => void;
}

export const AssignProgramsButton: FC<AssignProgramsButtonProps> = ({
  volunteerId,
  onSuccess,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="ghost"
      >
        {t('users.managePrograms')}
      </Button>
      <AssignProgramsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        volunteerId={volunteerId}
        onSuccess={() => {
          setIsOpen(false);
          onSuccess?.();
        }}
      />
    </>
  );
};
