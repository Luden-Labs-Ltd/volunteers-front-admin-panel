import { useQuery } from '@tanstack/react-query';
import { volunteerRatingApi } from '../../api';
import type { VolunteerRating } from '../types';

export function useVolunteerRatings(
  volunteerUserId: string | null,
  enabled = true,
) {
  return useQuery<VolunteerRating[]>({
    queryKey: ['volunteer-ratings', volunteerUserId],
    queryFn: () => {
      if (!volunteerUserId) {
        throw new Error('volunteerUserId is required');
      }
      return volunteerRatingApi.getRatings(volunteerUserId);
    },
    enabled: Boolean(volunteerUserId) && enabled,
    staleTime: 60 * 1000,
  });
}
