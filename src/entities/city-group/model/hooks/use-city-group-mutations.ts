import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cityGroupApi } from '../../api/city-group-api';
import type {
  CreateCityGroupRequest,
  UpdateCityGroupRequest,
  SetCityGroupCitiesRequest,
} from '../types';
import { CITY_GROUPS_QUERY_KEY } from './use-get-city-groups';

export function useCreateCityGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCityGroupRequest) => cityGroupApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITY_GROUPS_QUERY_KEY });
    },
  });
}

export function useUpdateCityGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCityGroupRequest }) =>
      cityGroupApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITY_GROUPS_QUERY_KEY });
    },
  });
}

export function useDeleteCityGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cityGroupApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITY_GROUPS_QUERY_KEY });
    },
  });
}

export function useSetGroupCities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SetCityGroupCitiesRequest }) =>
      cityGroupApi.setCities(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITY_GROUPS_QUERY_KEY });
    },
  });
}
