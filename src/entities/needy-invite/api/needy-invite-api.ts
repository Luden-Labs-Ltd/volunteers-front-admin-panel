import { apiClient } from '@/shared/api';

export interface CreateNeedyInviteResponse {
  url: string;
}

export const needyInviteApi = {
  createInvite: async (): Promise<CreateNeedyInviteResponse> => {
    return apiClient.request<CreateNeedyInviteResponse>('/needy/invite', {
      method: 'POST',
    });
  },
};
