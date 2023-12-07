import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Acknowledge incident',
  key: 'acknowledgeIncident',
  description: 'Acknowledges an incident.',
  arguments: [
    {
      label: 'Incident ID',
      key: 'incidentId',
      type: 'string',
      required: true,
      variables: true,
      description:
        'This serves as the incident ID that requires your acknowledgment.',
    },
    {
      label: 'Acknowledged by',
      key: 'acknowledgedBy',
      type: 'string',
      required: false,
      variables: true,
      description:
        "This refers to the individual's name, email, or another form of identification that the person who acknowledged the incident has provided.",
    },
  ],

  async run($) {
    const acknowledgedBy = $.step.parameters.acknowledgedBy;
    const incidentId = $.step.parameters.incidentId;

    const body = {
      acknowledged_by: acknowledgedBy,
    };

    const response = await $.http.post(
      `/v2/incidents/${incidentId}/acknowledge`,
      body
    );

    $.setActionItem({ raw: response.data.data });
  },
});
