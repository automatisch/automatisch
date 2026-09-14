import defineAction from '../../../../helpers/define-action.js';
import getProfileHeaders from '../../common/get-profile-headers.js';
import getIdempotencyKey from '../../common/get-idempotency-key.js';
import senderProfileArgument from '../../common/sender-profile-argument.js';
import { collectTemplateParameters } from '../../common/template-parameters.js';
import {
  assertUuid,
  channelOptions,
  parseChannels,
  parsePhoneNumbers,
} from '../../common/validators.js';

const buildContent = (parameters) => {
  const { contentType, text, templateId } = parameters;

  if (contentType === 'text') {
    if (typeof text !== 'string' || text.trim() === '') {
      throw new Error(
        'Message text is required when the content type is "Text message".'
      );
    }

    return { text };
  }

  if (contentType === 'template') {
    if (!templateId) {
      throw new Error(
        'A template is required when the content type is "Approved template".'
      );
    }

    const template = { id: assertUuid(templateId, 'Template') };
    const templateParameters = collectTemplateParameters(parameters);

    if (Object.keys(templateParameters).length > 0) {
      template.parameters = templateParameters;
    }

    return { template };
  }

  throw new Error(
    'Content type must be either "Text message" or "Approved template".'
  );
};

export default defineAction({
  name: 'Send message',
  key: 'sendMessage',
  description:
    'Sends an SMS, WhatsApp or RCS message to one or more recipients. Sent accepts the message for delivery (HTTP 202); track delivery with Get message status, Get message activities or the New event trigger.',
  arguments: [
    senderProfileArgument,
    {
      label: 'Recipient Phone Numbers',
      key: 'to',
      type: 'string',
      required: true,
      description:
        'One or more phone numbers in E.164 format (for example +14155550100), separated by commas.',
      variables: true,
    },
    {
      label: 'Channel',
      key: 'channel',
      type: 'dropdown',
      required: true,
      description:
        'Automatic routing lets Sent pick SMS, WhatsApp or RCS per recipient and fall back between channels. Pinning a channel never falls back. Several channels separated by commas send one message per channel.',
      variables: true,
      value: 'sent',
      options: channelOptions,
    },
    {
      label: 'Content Type',
      key: 'contentType',
      type: 'dropdown',
      required: true,
      description:
        'Approved templates can always be sent. Free-form text needs an open conversation: for SMS, RCS and automatic routing the contact must have replied before or received an approved template in the last 7 days; for WhatsApp the contact must have messaged you in the last 24 hours.',
      variables: false,
      value: 'text',
      options: [
        { label: 'Text message', value: 'text' },
        { label: 'Approved template', value: 'template' },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listMessageContentFields',
          },
          {
            name: 'parameters.contentType',
            value: '{parameters.contentType}',
          },
        ],
      },
    },
    {
      label: 'Sandbox',
      key: 'sandbox',
      type: 'dropdown',
      required: false,
      description:
        'Validate the request and return a simulated response without sending anything or charging your balance.',
      variables: false,
      value: false,
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
    {
      label: 'Idempotency Key',
      key: 'idempotencyKey',
      type: 'string',
      required: false,
      description:
        'Optional. Sent returns the original response for repeated sends with the same key within 24 hours (letters, digits, hyphens and underscores). When empty, a key derived from this execution is used.',
      variables: true,
    },
  ],

  async run($) {
    const parameters = $.step.parameters;

    const payload = {
      to: parsePhoneNumbers(parameters.to),
      channel: parseChannels(parameters.channel),
      ...buildContent(parameters),
    };

    if (parameters.sandbox === true || parameters.sandbox === 'true') {
      payload.sandbox = true;
    }

    const headers = getProfileHeaders(parameters.senderProfileId);
    const idempotencyKey = getIdempotencyKey($);

    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await $.http.post('/v3/messages', payload, { headers });

    $.setActionItem({ raw: response.data });
  },
});
