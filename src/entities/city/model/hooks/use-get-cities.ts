import { useQuery } from '@tanstack/react-query';
import { cityApi } from '../../api/city-api';
import type { City } from '../types';

export function useGetCities() {
  return useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: () => cityApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 минут - города не меняются часто
  });
}
