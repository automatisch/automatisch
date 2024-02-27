import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Documents Generated',
  key: 'documentsGenerated',
  pollInterval: 15,
  description:
    'Triggers upon the successful completion of document generation.',
  arguments: [
    {
      label: 'Workspace',
      key: 'workspaceId',
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
            value: 'listWorkspaces',
          },
        ],
      },
    },
    {
      label: 'Templates',
      key: 'templateIds',
      type: 'dynamic',
      required: false,
      description: 'Apply this trigger exclusively for particular templates.',
      fields: [
        {
          label: 'Template',
          key: 'templateId',
          type: 'dropdown',
          required: false,
          depensOn: ['parameters.workspaceId'],
          description: '',
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listTemplates',
              },
              {
                name: 'parameters.workspaceId',
                value: '{parameters.workspaceId}',
              },
            ],
          },
        },
      ],
    },
  ],

  async run($) {
    const workspaceId = $.step.parameters.workspaceId;
    const templateIds = $.step.parameters.templateIds;
    const allTemplates = templateIds
      .map((templateId) => templateId.templateId)
      .join(',');

    const params = {
      'page[size]': 100,
      'q[workspace_id]': workspaceId,
      'q[status]': 'success',
    };

    if (!templateIds.length) {
      params['q[document_template_id]'] = allTemplates;
    }

    let next = false;
    do {
      const { data } = await $.http.get('/v1/document_cards', { params });

      if (!data?.document_cards?.length) {
        return;
      }

      next = data.meta.next_page;

      for (const document of data.document_cards) {
        $.pushTriggerItem({
          raw: document,
          meta: {
            internalId: document.id,
          },
        });
      }
    } while (next);
  },
});
