import { apiClient } from '@/shared/api';
import type {
  VolunteerRating,
  VolunteerRatingsAdminResponse,
} from '../model/types';

export const volunteerRatingApi = {
  getRatings: async (volunteerUserId: string): Promise<VolunteerRating[]> => {
    return apiClient.request<VolunteerRating[]>(
      `/volunteers/${volunteerUserId}/ratings`,
    );
  },

  getRatingsAdmin: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<VolunteerRatingsAdminResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search?.trim()) searchParams.set('search', params.search.trim());

    const query = searchParams.toString();
    const url = query ? `/volunteers/ratings/admin?${query}` : '/volunteers/ratings/admin';

    return apiClient.request<VolunteerRatingsAdminResponse>(url);
  },
};
