import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Resolve incident',
  key: 'resolveIncident',
  description: 'Resolves an incident.',
  arguments: [
    {
      label: 'Incident ID',
      key: 'incidentId',
      type: 'string',
      required: true,
      variables: true,
      description:
        'This represents the identification for an incident that requires resolution.',
    },
    {
      label: 'Resolved by',
      key: 'resolvedBy',
      type: 'string',
      required: false,
      variables: true,
      description:
        "This refers to the individual's name, email, or another form of identification that the person who resolved the incident has provided.",
    },
  ],

  async run($) {
    const resolvedBy = $.step.parameters.resolvedBy;
    const incidentId = $.step.parameters.incidentId;

    const body = {
      resolved_by: resolvedBy,
    };

    const response = await $.http.post(
      `/v2/incidents/${incidentId}/resolve`,
      body
    );

    $.setActionItem({ raw: response.data.data });
  },
});
