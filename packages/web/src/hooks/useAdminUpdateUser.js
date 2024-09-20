import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function useAdminUpdateUser(userId) {
  const queryClient = useQueryClient();
  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();

  const query = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(`/v1/admin/users/${userId}`, payload);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users'],
      });
    },
    onError: () => {
      enqueueSnackbar(formatMessage('editUser.error'), {
        variant: 'error',
        persist: true,
        SnackbarProps: {
          'data-test': 'snackbar-error',
        },
      });
    },
  });

  return query;
}
