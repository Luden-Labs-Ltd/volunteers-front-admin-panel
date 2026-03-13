import { FC, useState } from 'react';
import { Button } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { InviteNeedyModal } from './invite-needy-modal';

export const InviteNeedyButton: FC = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}   className="w-full sm:w-auto min-h-[44px] sm:min-h-0 shrink-0"  variant="outline">
        {t('users.inviteNeedyLink')}
      </Button>
      <InviteNeedyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
