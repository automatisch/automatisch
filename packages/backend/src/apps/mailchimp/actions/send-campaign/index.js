import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Send campaign',
  key: 'sendCampaign',
  description: 'Sends a campaign draft.',
  arguments: [
    {
      label: 'Campaign',
      key: 'campaignId',
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
            value: 'listCampaigns',
          },
        ],
      },
    },
  ],

  async run($) {
    const campaignId = $.step.parameters.campaignId;

    await $.http.post(`/3.0/campaigns/${campaignId}/actions/send`);

    $.setActionItem({
      raw: {
        output: 'sent',
      },
    });
  },
});
