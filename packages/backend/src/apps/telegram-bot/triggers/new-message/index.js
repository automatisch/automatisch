import Crypto from 'crypto';
import appConfig from '../../../../config/app.js';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New message',
  key: 'newMessage',
  type: 'webhook',
  description: 'Triggers when a new message is sent to the bot.',
  arguments: [
    {
      label: 'Allowed Update Types',
      key: 'allowedUpdates',
      type: 'dropdown',
      required: false,
      description:
        'Select which update types you want to receive. Leave empty to receive all updates except chat_member, message_reaction, and message_reaction_count.',
      variables: false,
      options: [
        { label: 'Message', value: 'message' },
        { label: 'Edited Message', value: 'edited_message' },
        { label: 'Channel Post', value: 'channel_post' },
        { label: 'Edited Channel Post', value: 'edited_channel_post' },
        { label: 'Business Connection', value: 'business_connection' },
        { label: 'Business Message', value: 'business_message' },
        { label: 'Edited Business Message', value: 'edited_business_message' },
        {
          label: 'Deleted Business Messages',
          value: 'deleted_business_messages',
        },
        { label: 'Message Reaction', value: 'message_reaction' },
        { label: 'Message Reaction Count', value: 'message_reaction_count' },
        { label: 'Inline Query', value: 'inline_query' },
        { label: 'Chosen Inline Result', value: 'chosen_inline_result' },
        { label: 'Callback Query', value: 'callback_query' },
        { label: 'Shipping Query', value: 'shipping_query' },
        { label: 'Pre-checkout Query', value: 'pre_checkout_query' },
        { label: 'Purchased Paid Media', value: 'purchased_paid_media' },
        { label: 'Poll', value: 'poll' },
        { label: 'Poll Answer', value: 'poll_answer' },
        { label: 'My Chat Member', value: 'my_chat_member' },
        { label: 'Chat Member', value: 'chat_member' },
        { label: 'Chat Join Request', value: 'chat_join_request' },
        { label: 'Chat Boost', value: 'chat_boost' },
        { label: 'Removed Chat Boost', value: 'removed_chat_boost' },
      ],
    },
  ],

  async run($) {
    const dataItem = {
      raw: $.request.body,
      meta: {
        internalId: $.request.body.update_id?.toString() || Crypto.randomUUID(),
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const lastExecutionStep = await $.getLastExecutionStep();

    if (lastExecutionStep?.dataOut) {
      $.pushTriggerItem({
        raw: lastExecutionStep.dataOut,
        meta: {
          internalId: Crypto.randomUUID(),
        },
      });
      return;
    }

    const sampleData = {
      update_id: 123456789,
      message: {
        message_id: 42,
        from: {
          id: 987654321,
          is_bot: false,
          first_name: 'John',
          last_name: 'Doe',
          username: 'johndoe',
          language_code: 'en',
        },
        chat: {
          id: 987654321,
          first_name: 'John',
          last_name: 'Doe',
          username: 'johndoe',
          type: 'private',
        },
        date: Math.floor(Date.now() / 1000),
        text: 'Hello, bot!',
      },
    };

    $.pushTriggerItem({
      raw: sampleData,
      meta: {
        internalId: sampleData.update_id.toString(),
      },
    });
  },

  async registerHook($) {
    const webhookPayload = {
      url: $.webhookUrl,
      secret_token: appConfig.webhookSecretKey,
      allowed_updates: $.step.parameters.allowedUpdates
        ? [$.step.parameters.allowedUpdates]
        : [],
    };

    await $.http.post('/setWebhook', webhookPayload);
  },

  async unregisterHook($) {
    await $.http.post('/deleteWebhook');
  },
});
