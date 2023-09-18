import defineTrigger from '../../../../helpers/define-trigger';
import isEmpty from 'lodash/isEmpty';

export default defineTrigger({
  name: 'Receive message - Sandbox',
  key: 'receiveMessage',
  type: 'webhook',
  description:
    'Triggers when a message is received from Vonage sandbox number. (+14157386102)',
  arguments: [
    {
      label: 'From Number',
      key: 'fromNumber',
      type: 'string' as const,
      required: true,
      description:
        'The number from which the message was sent. (e.g. 491234567899)',
      variables: true,
    },
  ],

  async testRun($) {
    const lastExecutionStep = await $.getLastExecutionStep();

    if (!isEmpty(lastExecutionStep?.dataOut)) {
      $.pushTriggerItem({
        raw: lastExecutionStep.dataOut,
        meta: {
          internalId: '',
        },
      });
    } else {
      const sampleData = {
        to: '14157386102',
        from: $.step.parameters.fromNumber as string,
        text: 'Tell me how will be the weather tomorrow for Berlin?',
        channel: 'whatsapp',
        profile: {
          name: 'Sample User',
        },
        timestamp: '2023-09-18T19:52:36Z',
        message_type: 'text',
        message_uuid: '318960cc-16ff-4f66-8397-45574333a435',
        context_status: 'none',
      };

      $.pushTriggerItem({
        raw: sampleData,
        meta: {
          internalId: '',
        },
      });
    }
  },

  async registerHook() {
    // void
  },

  async unregisterHook() {
    // void
  },
});
