import defineAction from '../../../../helpers/define-action.js';
import compactParams from '../../common/compact-params.js';

export default defineAction({
  name: 'Get trends',
  key: 'getTrends',
  description: 'Get trending hashtags and topics by region.',
  arguments: [
    {
      label: 'WOEID',
      key: 'woeid',
      type: 'string',
      required: false,
      variables: true,
      description: 'Region WOEID. Use 1 for worldwide.',
    },
    {
      label: 'Count',
      key: 'count',
      type: 'string',
      required: false,
      variables: true,
      description: 'Number of trends to return, from 1 to 50.',
    },
  ],

  async run($) {
    const params = compactParams({
      woeid: $.step.parameters.woeid,
      count: $.step.parameters.count,
    });

    const { data } = await $.http.get('/x/trends', { params });

    $.setActionItem({
      raw: data,
    });
  },
});
