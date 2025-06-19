import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminTemplate(templateId) {
  const query = useQuery({
    queryKey: ['admin', 'templates', templateId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/admin/templates/${templateId}`, {
        signal,
      });

      return data;
    },
  });

  return query;
}
