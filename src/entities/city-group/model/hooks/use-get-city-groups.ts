import { useQuery } from '@tanstack/react-query';
import { cityGroupApi } from '../../api/city-group-api';

const CITY_GROUPS_QUERY_KEY = ['city-groups'];

export function useGetCityGroups() {
  return useQuery({
    queryKey: CITY_GROUPS_QUERY_KEY,
    queryFn: () => cityGroupApi.getGroups(),
  });
}

export { CITY_GROUPS_QUERY_KEY };
