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
    // TODO: remove the `placeholderData` and `enabled` properties once the endpoint is implemented
    enabled: false,
    placeholderData: {
      data: {
        id: '39097c0f-8082-44e2-8ecf-1ac1ff29c221',
        name: 'Copy of Name your flow',
        active: true,
        status: 'published',
        createdAt: 1739349875861,
        updatedAt: 1739350092977,
        steps: [
          {
            id: 'ce4e5447-edd1-45e4-b534-fb1131423934',
            type: 'trigger',
            key: 'catchRawWebhook',
            name: 'trigger',
            appKey: 'webhook',
            iconUrl: 'http://localhost:3000/apps/webhook/assets/favicon.svg',
            webhookUrl:
              'https://touched-grand-pigeon.ngrok-free.app/webhooks/flows/39097c0f-8082-44e2-8ecf-1ac1ff29c221/sync',
            status: 'completed',
            position: 1,
            parameters: {
              workSynchronously: true,
            },
          },
          {
            id: 'edc194e4-386d-49d5-85ea-8dd7755e7c55',
            type: 'action',
            key: 'runJavascript',
            name: 'running js',
            appKey: 'code',
            iconUrl: 'http://localhost:3000/apps/code/assets/favicon.svg',
            webhookUrl: null,
            status: 'completed',
            position: 2,
            parameters: {
              inputs: [
                {
                  key: 'name',
                  value:
                    '{{step.ce4e5447-edd1-45e4-b534-fb1131423934.query.name}}',
                },
                {
                  key: 'action',
                  __id: '20c9a175-98f9-41a7-9be1-9a5da6c3e238',
                  value:
                    '{{step.ce4e5447-edd1-45e4-b534-fb1131423934.query.action}}',
                },
              ],
              codeSnippet:
                "const code = async (inputs) => { \n  if (inputs.action === 'greetings') {\n    return `Hello ${inputs.name}`;\n  }\n\n  return `Unknown action!`;\n};",
            },
          },
          {
            id: '69890a33-e385-4b94-95ca-96af82c4d828',
            type: 'action',
            key: 'text',
            name: 'juggling numbers',
            appKey: 'formatter',
            iconUrl: 'http://localhost:3000/apps/formatter/assets/favicon.svg',
            webhookUrl: null,
            status: 'completed',
            position: 3,
            parameters: {
              input: '{{step.edc194e4-386d-49d5-85ea-8dd7755e7c55.output}}',
              transform: 'stringToBase64',
            },
          },
        ],
      },
      meta: {
        type: 'Flow',
        isArray: false,
        currentPage: 1,
        totalPages: 5,
      },
    },
  });

  return query;
}
