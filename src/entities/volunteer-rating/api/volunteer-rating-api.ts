import { apiClient } from '@/shared/api';
import type { VolunteerRating } from '../model/types';

export const volunteerRatingApi = {
  getRatings: async (volunteerUserId: string): Promise<VolunteerRating[]> => {
    return apiClient.request<VolunteerRating[]>(
      `/volunteers/${volunteerUserId}/ratings`,
    );
  },
};
