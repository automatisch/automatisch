import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';

export default function useUpdateFlowStatus(flowId) {
  const queryClient = useQueryClient();
  const enqueueSnackbar = useEnqueueSnackbar();

  const query = useMutation({
    mutationFn: async (active) => {
      const { data } = await api.patch(`/v1/flows/${flowId}/status`, {
        active,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['flows', flowId],
      });
    },
    onError: (error) => {
      const errors = Object.values(
        error.response.data.errors || [['Failed while updating flow status!']],
      );

      for (const [error] of errors) {
        enqueueSnackbar(error, {
          variant: 'error',
          SnackbarProps: {
            'data-test': 'snackbar-error',
          },
        });
      }
    }
  });

  return query;
}
