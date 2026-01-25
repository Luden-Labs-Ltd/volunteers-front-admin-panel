import { FC, useState } from 'react';
import { useDeleteProgram } from '@/entities/program';
import { Button, Modal } from '@/shared/ui';

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
  const [isOpen, setIsOpen] = useState(false);
  const deleteMutation = useDeleteProgram();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(programId);
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
        Удалить
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Подтверждение удаления"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Вы уверены, что хотите удалить программу{' '}
            <strong>{programName}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            Это действие нельзя отменить. Если к программе привязаны волонтеры
            или нуждающиеся, удаление будет невозможно.
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
