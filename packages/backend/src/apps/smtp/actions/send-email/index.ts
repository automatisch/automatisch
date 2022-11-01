import { IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import transporter from '../../common/transporter';

export default defineAction({
  name: 'Send an email',
  key: 'sendEmail',
  description: 'Sends an email',
  arguments: [
    {
      label: 'From name',
      key: 'fromName',
      type: 'string' as const,
      required: false,
      description: 'Display name of the sender.',
      variables: true,
    },
    {
      label: 'From email',
      key: 'fromEmail',
      type: 'string' as const,
      required: true,
      description: 'Email address of the sender.',
      variables: true,
    },
    {
      label: 'Reply to',
      key: 'replyTo',
      type: 'string' as const,
      required: false,
      description:
        'Email address to reply to. Defaults to the from email address.',
      variables: true,
    },
    {
      label: 'To',
      key: 'to',
      type: 'string' as const,
      required: true,
      description:
        'Comma seperated list of email addresses to send the email to.',
      variables: true,
    },
    {
      label: 'Cc',
      key: 'cc',
      type: 'string' as const,
      required: false,
      description: 'Comma seperated list of email addresses.',
      variables: true,
    },
    {
      label: 'Bcc',
      key: 'bcc',
      type: 'string' as const,
      required: false,
      description: 'Comma seperated list of email addresses.',
      variables: true,
    },
    {
      label: 'Subject',
      key: 'subject',
      type: 'string' as const,
      required: true,
      description: 'Subject of the email.',
      variables: true,
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string' as const,
      required: true,
      description: 'Body of the email.',
      variables: true,
    },
  ],

  async run($) {
    const info = await transporter($).sendMail({
      from: `${$.step.parameters.fromName} <${$.step.parameters.fromEmail}>`,
      to: ($.step.parameters.to as string).split(','),
      replyTo: $.step.parameters.replyTo as string,
      cc: ($.step.parameters.cc as string).split(','),
      bcc: ($.step.parameters.bcc as string).split(','),
      subject: $.step.parameters.subject as string,
      text: $.step.parameters.body as string,
    });

    $.setActionItem({ raw: info as IJSONObject });
  },
});
