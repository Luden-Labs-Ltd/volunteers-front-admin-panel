import { FC, useState } from 'react';
import { useDeleteProgram } from '@/entities/program';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal } from '@/shared/ui';
import { DEFAULT_PROGRAM_ID } from '@/shared/config/constants';

export interface DeleteProgramButtonProps {
  programId: string;
  programName: string;
  onSuccess?: () => void;
}

export const DeleteProgramButton: FC<DeleteProgramButtonProps> = ({
  programId,
  programName,
  onSuccess,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const deleteMutation = useDeleteProgram();

  if (programId === DEFAULT_PROGRAM_ID) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(programId);
      setIsOpen(false);
      onSuccess?.();
    } catch {
      // Error is handled in the hook
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
            {t('programs.delete.confirmMessage', { programName })}
          </p>
          <p className="text-sm text-gray-500">
            {t('programs.delete.confirmNote')}
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
