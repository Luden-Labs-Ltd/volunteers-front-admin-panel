import { FC, useState } from 'react';
import { Button } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { InviteNeedyModal } from './invite-needy-modal';

export const InviteNeedyButton: FC = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
        {t('users.inviteNeedyLink')}
      </Button>
      <InviteNeedyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
