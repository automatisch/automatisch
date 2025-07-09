import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create incident',
  key: 'createIncident',
  description: 'Creates an incident that informs the team.',
  arguments: [
    {
      label: 'Brief Summary',
      key: 'briefSummary',
      type: 'string',
      required: true,
      variables: true,
      description: 'A short description outlining the issue.',
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string',
      required: false,
      variables: true,
      description:
        'An elaborate description of the situation, offering insights into what is occurring, along with instructions to reproduce the problem.',
    },
    {
      label: 'Requester Email',
      key: 'requesterEmail',
      type: 'string',
      required: true,
      variables: true,
      description:
        'This represents the email address of the individual who initiated the incident request.',
    },
    {
      label: 'Alert Settings - Call',
      key: 'alertSettingsCall',
      type: 'dropdown',
      required: true,
      description: 'Should we call the on-call person?',
      variables: true,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      label: 'Alert Settings - Text',
      key: 'alertSettingsText',
      type: 'dropdown',
      required: true,
      description: 'Should we text the on-call person?',
      variables: true,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      label: 'Alert Settings - Email',
      key: 'alertSettingsEmail',
      type: 'dropdown',
      required: true,
      description: 'Should we email the on-call person?',
      variables: true,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      label: 'Alert Settings - Push Notification',
      key: 'alertSettingsPushNotification',
      type: 'dropdown',
      required: true,
      description: 'Should we send a push notification to the on-call person?',
      variables: true,
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      label: 'Team Alert Wait Time',
      key: 'teamAlertWaitTime',
      type: 'string',
      required: true,
      variables: true,
      description:
        "What is the time threshold for acknowledgment before escalating to the entire team? (Specify in seconds) - Use a negative value to indicate no team alert if the on-call person doesn't respond, and use 0 for an immediate alert to the entire team.",
    },
  ],

  async run($) {
    const {
      briefSummary,
      description,
      requesterEmail,
      alertSettingsCall,
      alertSettingsText,
      alertSettingsEmail,
      alertSettingsPushNotification,
      teamAlertWaitTime,
    } = $.step.parameters;

    const body = {
      summary: briefSummary,
      description,
      requester_email: requesterEmail,
      call: alertSettingsCall,
      sms: alertSettingsText,
      email: alertSettingsEmail,
      push: alertSettingsPushNotification,
      team_wait: teamAlertWaitTime,
    };

    const response = await $.http.post('/v2/incidents', body);

    $.setActionItem({ raw: response.data.data });
  },
});
