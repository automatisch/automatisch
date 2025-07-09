import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find incident',
  key: 'findIncident',
  description: 'finds an incident.',
  arguments: [
    {
      label: 'Incident ID',
      key: 'incidentId',
      type: 'string',
      required: true,
      variables: true,
      description: 'ID for querying incidents.',
    },
  ],

  async run($) {
    const incidentId = $.step.parameters.incidentId;

    const response = await $.http.get(`/v2/incidents/${incidentId}`);

    $.setActionItem({ raw: response.data.data });
  },
});
