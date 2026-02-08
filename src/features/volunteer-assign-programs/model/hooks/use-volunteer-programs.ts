import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { usePrograms, programApi } from '@/entities/program';
import { useMemo } from 'react';

/**
 * Hook для получения списка ID программ, на которые назначен волонтер
 * Использует GET /program для всех программ и GET /program/:id/volunteers для каждой программы
 * чтобы определить, на какие программы назначен волонтер
 * 
 * ВАЖНО: Это временное решение. В будущем лучше создать отдельный endpoint GET /volunteer/:volunteerId/programs
 */
export function useVolunteerPrograms(
  volunteerId: string,
  options?: Omit<UseQueryOptions<Map<string, string[]>, Error>, 'queryKey' | 'queryFn'>,
) {
  const { data: allPrograms = [], isLoading: programsLoading } = usePrograms();

  // Исключаем enabled из options, чтобы избежать дублирования
  const { enabled: optionsEnabled, ...restOptions } = options || {};
  const isEnabled = (optionsEnabled !== false) && allPrograms.length > 0 && !!volunteerId;

  // Для каждой программы делаем запрос на получение волонтеров
  // Используем Promise.all для параллельных запросов
  const { data: programVolunteersMap, isLoading: volunteersLoading } = useQuery({
    queryKey: ['volunteer-programs', volunteerId, allPrograms.map((p) => p.id)],
    queryFn: async () => {
      if (allPrograms.length === 0) return new Map<string, string[]>();

      // Получаем волонтеров для каждой программы параллельно
      const results = await Promise.all(
        allPrograms.map(async (program) => {
          try {
            const volunteers = await programApi.getVolunteers(program.id);
            return {
              programId: program.id,
              volunteerIds: volunteers.map((v) => v.id),
            };
          } catch {
            return {
              programId: program.id,
              volunteerIds: [],
            };
          }
        }),
      );

      // Создаем Map для быстрого поиска
      const map = new Map<string, string[]>();
      results.forEach(({ programId, volunteerIds }) => {
        map.set(programId, volunteerIds);
      });

      return map;
    },
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000, // 2 минуты
    gcTime: 10 * 60 * 1000, // 10 минут - время жизни кеша
    refetchOnMount: false, // Не делать запрос при монтировании, если данные свежие
    refetchOnWindowFocus: false, // Не делать запрос при фокусе окна
    refetchOnReconnect: false, // Не делать запрос при переподключении
    ...restOptions,
  });

  // Извлекаем ID программ, где волонтер присутствует
  const assignedProgramIds = useMemo(() => {
    if (!programVolunteersMap) return [];

    return Array.from(programVolunteersMap.entries())
      .filter(([_, volunteerIds]) => volunteerIds.includes(volunteerId))
      .map(([programId]) => programId);
  }, [programVolunteersMap, volunteerId]);

  return {
    data: assignedProgramIds,
    isLoading: programsLoading || volunteersLoading,
    isError: false, // Ошибки обрабатываются внутри queryFn
  };
}
