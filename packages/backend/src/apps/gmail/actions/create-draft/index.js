import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create draft',
  key: 'createDraft',
  description: 'Create a new draft email message.',
  arguments: [
    {
      label: 'Subject',
      key: 'subject',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'TOs',
      key: 'tos',
      type: 'dynamic',
      required: false,
      description: '',
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
      description: '',
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
      description: '',
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
        'Select an email address or alias from your Gmail Account. Defaults to the primary email address.',
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
      label: 'Signature',
      key: 'signature',
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
            value: 'listSignatures',
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
      subject,
      bodyType,
      emailBody,
      signature,
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
      'To: ' +
      allTos.join(',') +
      '\r\n' +
      'Cc: ' +
      allCcs.join(',') +
      '\r\n' +
      'Bcc: ' +
      allBccs.join(',') +
      '\r\n' +
      'Subject: ' +
      subject +
      '\r\n' +
      'Content-Type: ' +
      contentType +
      '\r\n' +
      '\r\n' +
      emailBody +
      '\r\n' +
      '\r\n' +
      signature;

    const base64EncodedEmailBody = Buffer.from(email).toString('base64');

    const body = {
      message: {
        raw: base64EncodedEmailBody,
      },
    };

    const { data } = await $.http.post(
      `/gmail/v1/users/${userId}/drafts`,
      body
    );

    $.setActionItem({
      raw: data,
    });
  },
});
