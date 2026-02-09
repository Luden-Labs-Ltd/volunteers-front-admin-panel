import { useQuery } from '@tanstack/react-query';
import { cityGroupApi } from '../../api/city-group-api';
import { CITY_GROUPS_QUERY_KEY } from './use-get-city-groups';

export function useGetCityGroup(id: string | null) {
  return useQuery({
    queryKey: [...CITY_GROUPS_QUERY_KEY, id],
    queryFn: () => (id ? cityGroupApi.getGroup(id) : Promise.reject(new Error('No id'))),
    enabled: !!id,
  });
}
