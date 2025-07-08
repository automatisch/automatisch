import defineAction from '../../../../helpers/define-action.js';
import transporter from '../../common/transporter.js';

export default defineAction({
  name: 'Send an email',
  key: 'sendEmail',
  description: 'Sends an email',
  arguments: [
    {
      label: 'From name',
      key: 'fromName',
      type: 'string',
      required: false,
      description: 'Display name of the sender.',
      variables: true,
    },
    {
      label: 'From email',
      key: 'fromEmail',
      type: 'string',
      required: true,
      description: 'Email address of the sender.',
      variables: true,
    },
    {
      label: 'Reply to',
      key: 'replyTo',
      type: 'string',
      required: false,
      description:
        'Email address to reply to. Defaults to the from email address.',
      variables: true,
    },
    {
      label: 'To',
      key: 'to',
      type: 'string',
      required: true,
      description:
        'Comma separated list of email addresses to send the email to.',
      variables: true,
    },
    {
      label: 'Cc',
      key: 'cc',
      type: 'string',
      required: false,
      description: 'Comma separated list of email addresses.',
      variables: true,
    },
    {
      label: 'Bcc',
      key: 'bcc',
      type: 'string',
      required: false,
      description: 'Comma separated list of email addresses.',
      variables: true,
    },
    {
      label: 'Subject',
      key: 'subject',
      type: 'string',
      required: true,
      description: 'Subject of the email.',
      variables: true,
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string',
      required: false,
      description: 'Body of the email.',
      variables: true,
    },
    {
      label: 'HTML Body',
      key: 'html',
      type: 'string',
      required: false,
      description: 'Body of the email in HTML.',
      variables: true,
    },
  ],

  async run($) {
    const info = await transporter($).sendMail({
      from: `${$.step.parameters.fromName} <${$.step.parameters.fromEmail}>`,
      to: $.step.parameters.to.split(','),
      replyTo: $.step.parameters.replyTo,
      cc: $.step.parameters.cc.split(','),
      bcc: $.step.parameters.bcc.split(','),
      subject: $.step.parameters.subject,
      text: $.step.parameters.body,
      html: $.step.parameters.html,
    });

    $.setActionItem({ raw: info });
  },
});
