import { FC, useEffect, useState } from 'react';
import { Modal, Button } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useCreateNeedyInvite } from '../model';

export interface InviteNeedyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteNeedyModal: FC<InviteNeedyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useI18n();
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const createInvite = useCreateNeedyInvite();

  useEffect(() => {
    if (isOpen && !url && !createInvite.isPending) {
      createInvite.mutate(undefined, {
        onSuccess: (data) => setUrl(data.url),
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setUrl(null);
      setCopied(false);
      createInvite.reset();
    }
  }, [isOpen]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('users.inviteModal.title')}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {t('users.inviteModal.description')}
        </p>
        {createInvite.isPending ? (
          <p className="text-sm text-gray-500">{t('users.inviteModal.generating')}</p>
        ) : createInvite.isError ? (
          <p className="text-sm text-red-600">
            {createInvite.error instanceof Error
              ? createInvite.error.message
              : t('common.error')}
          </p>
        ) : url ? (
          <>
            <div className="rounded border bg-gray-50 p-2 text-sm break-all">
              {url}
            </div>
            <Button onClick={handleCopy} className="w-full">
              {copied ? t('users.inviteModal.copied') : t('users.inviteModal.copy')}
            </Button>
          </>
        ) : null}
      </div>
    </Modal>
  );
};
