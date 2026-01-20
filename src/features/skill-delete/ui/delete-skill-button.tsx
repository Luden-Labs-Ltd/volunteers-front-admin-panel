import { FC, useState } from 'react';

import { useDeleteSkill } from '@/entities/skill';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal } from '@/shared/ui';

export interface DeleteSkillButtonProps {
  skillId: string;
  skillName: string;
  onSuccess?: () => void;
}

export const DeleteSkillButton: FC<DeleteSkillButtonProps> = ({
  skillId,
  skillName,
  onSuccess,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const deleteMutation = useDeleteSkill();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(skillId);
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
            {t('skills.delete.confirm', { name: skillName })}
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
              variant="default"
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
