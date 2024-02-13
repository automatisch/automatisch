//import { URLSearchParams } from 'node:url';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New errors',
  key: 'newErrors',
  pollInterval: 15,
  description: 'Triggers when a new error occurs.',
  arguments: [
    {
      label: 'Project',
      key: 'projectId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listProjects',
          },
        ],
      },
    },
  ],

  async run($) {
    const projectId = $.step.parameters.projectId;

    const params = {
      limit: 100,
      page: 1,
    };

    let next = false;
    do {
      const { data } = await $.http.get(
        `/api/v4/projects/${projectId}/groups`,
        { params }
      );

      if (data.count > params.limit) {
        params.page = params.page + 1;
        next = true;
      } else {
        next = false;
      }

      if (!data?.groups?.length) {
        return;
      }

      for (const group of data.groups) {
        $.pushTriggerItem({
          raw: group,
          meta: {
            internalId: group.id,
          },
        });
      }
    } while (next);
  },
});
