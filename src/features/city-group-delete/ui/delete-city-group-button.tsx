import { FC, useState } from 'react';
import { useDeleteCityGroup } from '@/entities/city-group';
import { Button, Modal } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { showToast } from '@/shared/lib/toast';
import type { CityGroup } from '@/entities/city-group';

export interface DeleteCityGroupButtonProps {
  group: CityGroup;
  onDeleted?: () => void;
}

export const DeleteCityGroupButton: FC<DeleteCityGroupButtonProps> = ({
  group,
  onDeleted,
}) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteCityGroup();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(group.id);
      showToast.success(t('cityGroups.deleteSuccess'));
      setOpen(false);
      onDeleted?.();
    } catch (err) {
      showToast.error((err as Error).message || t('common.error'));
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:bg-red-50"
      >
        {t('common.delete')}
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t('common.deleteConfirmTitle')}
      >
        <p className="text-gray-600 mb-4">
          {t('cityGroups.deleteConfirmMessage', { name: group.name })}
        </p>
        <p className="text-sm text-gray-500 mb-4">{t('common.deleteIrreversible')}</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? t('common.deleting') : t('common.confirm')}
          </Button>
        </div>
      </Modal>
    </>
  );
};
