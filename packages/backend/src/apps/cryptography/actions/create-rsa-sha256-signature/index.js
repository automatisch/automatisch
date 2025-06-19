import crypto from 'node:crypto';
import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create Signature',
  key: 'createSignature',
  description: 'Create a digital signature using the specified algorithm, secret key, and message.',
  arguments: [
    {
      label: 'Algorithm',
      key: 'algorithm',
      type: 'dropdown',
      required: true,
      value: 'RSA-SHA256',
      description: 'Specifies the cryptographic hash function to use for HMAC generation.',
      options: [
        { label: 'RSA-SHA256', value: 'RSA-SHA256' },
      ],
      variables: true,
    },
    {
      label: 'Message',
      key: 'message',
      type: 'string',
      required: true,
      description: 'The input message to be signed.',
      variables: true,
    },
    {
      label: 'Private Key',
      key: 'privateKey',
      type: 'string',
      required: true,
      description: 'The RSA private key in PEM format used for signing.',
      variables: true,
    },
    {
      label: 'Output Encoding',
      key: 'outputEncoding',
      type: 'dropdown',
      required: true,
      value: 'hex',
      description: 'Specifies the encoding format for the digital signature output. This determines how the generated signature will be represented as a string.',
      options: [
        { label: 'base64', value: 'base64' },
        { label: 'base64url', value: 'base64url' },
        { label: 'hex', value: 'hex' },
      ],
      variables: true,
    },
  ],

  async run($) {
    const signer = crypto.createSign($.step.parameters.algorithm);
    signer.update($.step.parameters.message);
    signer.end();
    const signature = signer.sign($.step.parameters.privateKey, $.step.parameters.outputEncoding);

    $.setActionItem({
      raw: {
        signature
      },
    });
  },
});
