import { useMutation } from '@tanstack/react-query';
import { needyInviteApi } from '@/entities/needy-invite/api/needy-invite-api';

export const useCreateNeedyInvite = () => {
  return useMutation({
    mutationFn: () => needyInviteApi.createInvite(),
  });
};
