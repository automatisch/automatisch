import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Reply to email',
  key: 'replyToEmail',
  description: 'Respond to an email.',
  arguments: [
    {
      label: 'Thread',
      key: 'threadId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listThreads',
          },
        ],
      },
    },
    {
      label: 'TOs',
      key: 'tos',
      type: 'dynamic',
      required: false,
      description: 'Who will receive this email?',
      fields: [
        {
          label: 'To',
          key: 'to',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
    },
    {
      label: 'CCs',
      key: 'ccs',
      type: 'dynamic',
      required: false,
      description:
        'Who else needs to be included in the CC field of this email?',
      fields: [
        {
          label: 'CC',
          key: 'cc',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
    },
    {
      label: 'BCCs',
      key: 'bccs',
      type: 'dynamic',
      required: false,
      description:
        'Who else needs to be included in the BCC field of this email?',
      fields: [
        {
          label: 'BCC',
          key: 'bcc',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
    },
    {
      label: 'From',
      key: 'from',
      type: 'dropdown',
      required: false,
      description:
        'Choose an email address or alias from your Gmail Account. This defaults to the primary email address.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listEmails',
          },
        ],
      },
    },
    {
      label: 'From Name',
      key: 'fromName',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Reply To',
      key: 'replyTo',
      type: 'string',
      required: false,
      description: 'Specify a single reply address other than your own.',
      variables: true,
    },
    {
      label: 'Body Type',
      key: 'bodyType',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        {
          label: 'plain',
          value: 'plain',
        },
        {
          label: 'html',
          value: 'html',
        },
      ],
    },
    {
      label: 'Body',
      key: 'emailBody',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Label',
      key: 'labelId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLabels',
          },
        ],
      },
    },
  ],

  async run($) {
    const {
      tos,
      ccs,
      bccs,
      from,
      fromName,
      replyTo,
      threadId,
      bodyType,
      emailBody,
      labelId,
    } = $.step.parameters;
    const userId = $.auth.data.userId;

    const allTos = tos?.map((entry) => entry.to);
    const allCcs = ccs?.map((entry) => entry.cc);
    const allBccs = bccs?.map((entry) => entry.bcc);
    const contentType =
      bodyType === 'html'
        ? 'text/html; charset="UTF-8"'
        : 'text/plain; charset="UTF-8"';

    const email =
      'From: ' +
      fromName +
      ' <' +
      from +
      '>' +
      '\r\n' +
      'In-Reply-To: ' +
      threadId +
      '\r\n' +
      'References: ' +
      threadId +
      '\r\n' +
      'Reply-To: ' +
      replyTo +
      '\r\n' +
      'To: ' +
      allTos.join(',') +
      '\r\n' +
      'Cc: ' +
      allCcs.join(',') +
      '\r\n' +
      'Bcc: ' +
      allBccs.join(',') +
      '\r\n' +
      'Content-Type: ' +
      contentType +
      '\r\n' +
      '\r\n' +
      emailBody;

    const base64EncodedEmailBody = Buffer.from(email).toString('base64');

    const body = {
      threadId: threadId,
      labelIds: [labelId],
      raw: base64EncodedEmailBody,
    };

    const { data } = await $.http.post(
      `/gmail/v1/users/${userId}/messages/send`,
      body
    );

    $.setActionItem({
      raw: data,
    });
  },
});
