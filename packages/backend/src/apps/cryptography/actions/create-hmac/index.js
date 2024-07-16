import { createHmac } from 'node:crypto';
import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create HMAC',
  key: 'createHmac',
  description: 'Create a Hash-based Message Authentication Code (HMAC) using the specified algorithm, secret key, and message.',
  arguments: [
    {
      label: 'Algorithm',
      key: 'algorithm',
      type: 'dropdown',
      required: true,
      value: 'sha256',
      description: 'Specifies the cryptographic hash function to use for HMAC generation.',
      options: [
        { label: 'SHA-256', value: 'sha256' },
      ],
      variables: true,
    },
    {
      label: 'Message',
      key: 'message',
      type: 'string',
      required: true,
      description: 'The input message to be hashed. This is the value that will be processed to generate the HMAC.',
      variables: true,
    },
    {
      label: 'Secret key',
      key: 'secretKey',
      type: 'string',
      required: true,
      description: 'The secret key used to create the HMAC.',
      variables: true,
    },
  ],

  async run($) {
    const hash = createHmac($.step.parameters.algorithm, $.step.parameters.secretKey)
      .update($.step.parameters.message)
      .digest('hex');

    $.setActionItem({
      raw: {
        hash
      },
    });
  },
});
