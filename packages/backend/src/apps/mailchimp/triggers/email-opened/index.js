import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Email opened',
  key: 'emailOpened',
  pollInterval: 15,
  description:
    'Triggers when a recipient opens an email as part of a particular campaign.',
  arguments: [
    {
      label: 'Audience',
      key: 'audienceId',
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
            value: 'listAudiences',
          },
        ],
      },
    },
    {
      label: 'Campaign Type',
      key: 'campaignType',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      options: [
        {
          label: 'Campaign',
          value: 'campaign',
        },
      ],
    },
    {
      label: 'Campaign',
      key: 'campaignId',
      type: 'dropdown',
      required: true,
      dependsOn: ['parameters.audienceId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCampaigns',
          },
          {
            name: 'parameters.audienceId',
            value: '{parameters.audienceId}',
          },
        ],
      },
    },
  ],

  async run($) {
    const campaignId = $.step.parameters.campaignId;
    let hasMore = false;

    const params = {
      count: 1000,
      offset: 0,
    };

    do {
      const { data } = await $.http.get(
        `/3.0/reports/${campaignId}/open-details`,
        { params }
      );
      params.offset = params.offset + params.count;

      if (data.members?.length) {
        for (const member of data.members) {
          $.pushTriggerItem({
            raw: member,
            meta: {
              internalId: member.email_id,
            },
          });
        }
      }

      if (data.total_items > params.offset) {
        hasMore = true;
      } else {
        hasMore = false;
      }
    } while (hasMore);
  },
});
