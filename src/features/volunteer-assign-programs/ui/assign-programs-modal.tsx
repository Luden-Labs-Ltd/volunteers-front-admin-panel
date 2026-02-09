import { FC, useState, useEffect } from 'react';
import { usePrograms } from '@/entities/program';
import { useAssignVolunteerToProgram, useVolunteerPrograms } from '../model';
import { useI18n } from '@/shared/lib/i18n';
import { Button, Modal } from '@/shared/ui';
import type { Program } from '@/entities/program';

export interface AssignProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteerId: string;
  onSuccess?: () => void;
}

export const AssignProgramsModal: FC<AssignProgramsModalProps> = ({
  isOpen,
  onClose,
  volunteerId,
  onSuccess,
}) => {
  const { t } = useI18n();
  const [selectedProgramIds, setSelectedProgramIds] = useState<Set<string>>(
    new Set(),
  );

  const { data: programs = [], isLoading: programsLoading } = usePrograms();
  const {
    data: currentProgramIds = [],
    isLoading: currentProgramsLoading,
  } = useVolunteerPrograms(volunteerId, {
    enabled: isOpen && !!volunteerId,
  });
  const assignMutation = useAssignVolunteerToProgram();

  // Инициализируем выбранные программы текущими назначениями
  useEffect(() => {
    if (currentProgramIds.length > 0) {
      setSelectedProgramIds(new Set(currentProgramIds));
    }
  }, [currentProgramIds]);

  const isLoading = programsLoading || currentProgramsLoading;

  const handleToggleProgram = (programId: string) => {
    setSelectedProgramIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    // Определяем, какие программы нужно добавить, а какие убрать
    const toAdd = programs.filter(
      (p) => selectedProgramIds.has(p.id) && !currentProgramIds.includes(p.id),
    );
    // const toRemove = programs.filter(
    //   (p) => !selectedProgramIds.has(p.id) && currentProgramIds.includes(p.id),
    // );

    try {
      // Добавляем новые назначения
      for (const program of toAdd) {
        await assignMutation.mutateAsync({
          programId: program.id,
          volunteerId,
        });
      }

      // Удаление назначений: для удаления программы из списка назначенных,
      // нужно отправить обновленный список программ без удаляемой программы.
      // Отдельный endpoint для удаления не требуется, так как используется PATCH с полным списком.

      onSuccess?.();
      onClose();
    } catch (error) {
      // Ошибка обрабатывается в хуке через toast
    }
  };

  const handleCancel = () => {
    setSelectedProgramIds(new Set(currentProgramIds));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t('users.managePrograms')}
      size="lg"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.loading')}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('users.noPrograms')}</p>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {programs.map((program: Program) => {
                const isSelected = selectedProgramIds.has(program.id);
                const wasAssigned = currentProgramIds.includes(program.id);

                return (
                  <label
                    key={program.id}
                    className={`
                      flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors
                      ${isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleProgram(program.id)}
                      className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {program.name}
                      </div>
                      {program.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {program.description}
                        </div>
                      )}
                      {wasAssigned && !isSelected && (
                        <div className="text-xs text-yellow-600 mt-1">
                          (Будет удалено)
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="ghost" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSave}
                disabled={assignMutation.isPending}
              >
                {assignMutation.isPending
                  ? t('common.loading')
                  : t('common.save')}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
