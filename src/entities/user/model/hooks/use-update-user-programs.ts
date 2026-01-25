import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../api';
import { programApi } from '@/entities/program/api';

interface UpdateUserProgramsParams {
  userId: string;
  programIds?: string[]; // Для волонтеров - новые программы для назначения
  programId?: string; // Для нуждающихся
}

export function useUpdateUserPrograms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, programIds, programId }: UpdateUserProgramsParams) => {
      if (programId !== undefined) {
        // Для нуждающихся - просто обновляем programId
        return userApi.update(userId, { programId });
      }
      
      if (programIds !== undefined) {
        // Для волонтеров - назначаем каждую программу через programApi
        // Примечание: это только добавляет программы, не удаляет существующие
        // Для полной синхронизации нужно будет использовать другой подход
        await Promise.all(
          programIds.map((programId) =>
            programApi.assignVolunteerToProgram(programId, userId)
          )
        );
        // После назначения обновляем данные пользователя
        return userApi.getById(userId);
      }
      
      throw new Error('Either programId or programIds must be provided');
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}
