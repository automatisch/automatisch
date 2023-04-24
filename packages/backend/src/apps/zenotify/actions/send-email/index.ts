import logger from '../../../../helpers/logger';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'send an email',
  key: 'sendEmail',
  description: 'send an email with a predetermined template, provider and recipients.',
  arguments: [
    {
      label: 'Notify ID',
      key: 'notifyId',
      type: 'string' as const,
      required: true,
      description: 'The ID of the notification which contains the email that is needed to be sent.',
      variables: true,
    },
  ],

  async run($) {
      
    const requestPath = '/send/email';
    const notifyId = $.step.parameters.notifyId;

    const response = await $.http.post(
      requestPath,
      { notificationId: notifyId },
    );

    $.setActionItem({ raw: response.data });

},
});
