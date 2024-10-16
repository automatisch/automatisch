import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';
import { enqueueSnackbar } from 'notistack';

export default function useAdminUpdateSamlAuthProvider(samlAuthProviderId) {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/v1/admin/saml-auth-providers/${samlAuthProviderId}`,
        payload,
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'samlAuthProviders'],
      });
    },
    onError: (error) => {
      const errors = Object.entries(
        error.response.data.errors || [['', 'Failed while saving!']],
      );

      for (const error of errors) {
        enqueueSnackbar(`${error[0] ? error[0] + ': ' : ''} ${error[1]}`, {
          variant: 'error',
          SnackbarProps: {
            'data-test': 'snackbar-update-saml-auth-provider-error',
          },
        });
      }
    },
  });

  return query;
}
