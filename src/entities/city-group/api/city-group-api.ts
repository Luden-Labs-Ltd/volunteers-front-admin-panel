import { apiClient } from '@/shared/api';
import type {
  CityGroup,
  CreateCityGroupRequest,
  UpdateCityGroupRequest,
  SetCityGroupCitiesRequest,
} from '../model/types';

export const cityGroupApi = {
  getGroups: async (): Promise<CityGroup[]> => {
    return apiClient.request<CityGroup[]>('/city-groups');
  },

  getGroup: async (id: string): Promise<CityGroup> => {
    return apiClient.request<CityGroup>(`/city-groups/${id}`);
  },

  create: async (data: CreateCityGroupRequest): Promise<CityGroup> => {
    return apiClient.request<CityGroup>('/city-groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateCityGroupRequest): Promise<CityGroup> => {
    return apiClient.request<CityGroup>(`/city-groups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.request<void>(`/city-groups/${id}`, {
      method: 'DELETE',
    });
  },

  setCities: async (id: string, data: SetCityGroupCitiesRequest): Promise<CityGroup> => {
    return apiClient.request<CityGroup>(`/city-groups/${id}/cities`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
