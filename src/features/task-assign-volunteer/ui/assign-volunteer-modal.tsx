import { FC, useState } from 'react';
import { useProgramVolunteers } from '@/entities/program';
import { useAssignVolunteer } from '../model';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal } from '@/shared/ui';
import type { User } from '@/entities/user';

export interface AssignVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  programId: string;
  currentVolunteerId?: string;
  onSuccess?: () => void;
}

export const AssignVolunteerModal: FC<AssignVolunteerModalProps> = ({
  isOpen,
  onClose,
  taskId,
  programId,
  currentVolunteerId,
  onSuccess,
}) => {
  const { t } = useI18n();
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>('');
  const [showReplaceWarning, setShowReplaceWarning] = useState(false);

  // Получаем волонтеров конкретной программы
  const { data: volunteers = [], isLoading, error } = useProgramVolunteers(programId);
  const assignMutation = useAssignVolunteer();

  // Логируем ошибки для отладки
  if (error) {
    console.error('Error loading volunteers:', error);
  }

  const handleSelectVolunteer = (volunteerId: string) => {
    setSelectedVolunteerId(volunteerId);
    // Если уже есть назначенный волонтер, показываем предупреждение
    if (currentVolunteerId && currentVolunteerId !== volunteerId) {
      setShowReplaceWarning(true);
    } else {
      setShowReplaceWarning(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedVolunteerId) return;

    try {
      await assignMutation.mutateAsync({
        taskId,
        volunteerId: selectedVolunteerId,
      });
      setSelectedVolunteerId('');
      setShowReplaceWarning(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      // Ошибка обрабатывается в хуке через toast
    }
  };

  const handleCancel = () => {
    setSelectedVolunteerId('');
    setShowReplaceWarning(false);
    onClose();
  };

  const getVolunteerDisplayName = (volunteer: User): string => {
    const name = `${volunteer.firstName || ''} ${volunteer.lastName || ''}`.trim();
    if (name) {
      return `${name}${volunteer.email ? ` (${volunteer.email})` : ''}${volunteer.phone ? ` - ${volunteer.phone}` : ''}`;
    }
    return volunteer.email || volunteer.phone || volunteer.id;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t('tasks.selectVolunteer')}
      size="lg"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">
              {t('common.error') || 'Ошибка загрузки волонтеров'}
            </p>
            <p className="text-sm text-gray-500">
              {error instanceof Error ? error.message : 'Неизвестная ошибка'}
            </p>
          </div>
        ) : volunteers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('tasks.noVolunteers')}</p>
          </div>
        ) : (
          <>
            {showReplaceWarning && currentVolunteerId && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  {t('tasks.replaceVolunteerWarning')}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {volunteers.map((volunteer) => (
                <button
                  key={volunteer.id}
                  type="button"
                  onClick={() => handleSelectVolunteer(volunteer.id)}
                  className={`
                    w-full text-left p-3 rounded-lg border-2 transition-colors
                    ${selectedVolunteerId === volunteer.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {getVolunteerDisplayName(volunteer)}
                      </div>
                      <div className="flex items-center gap-2">
                        {volunteer.email && (
                          <>
                            <span>{t('common.emailLabel')}</span>
                            <div className="text-sm text-gray-500">
                              {volunteer.email}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {volunteer.phone && (
                          <>
                            <span>{t('common.phoneLabel')}</span>
                            <div className="text-sm text-gray-500">
                              {volunteer.phone}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {selectedVolunteerId === volunteer.id && (
                      <div className="text-primary-600">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="ghost" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!selectedVolunteerId || assignMutation.isPending}
              >
                {assignMutation.isPending
                  ? t('common.loading')
                  : showReplaceWarning
                    ? t('common.confirm')
                    : t('tasks.assignVolunteer')}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
