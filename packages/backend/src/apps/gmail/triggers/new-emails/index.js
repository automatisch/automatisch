import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New emails',
  key: 'newEmails',
  pollInterval: 15,
  description:
    'Triggers when a new email is received in the specified mailbox.',
  arguments: [
    {
      label: 'Label',
      key: 'labelId',
      type: 'dropdown',
      required: false,
      description:
        "If you don't choose a label, this Zap will trigger for all emails, including Drafts.",
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
    const userId = $.auth.data.userId;
    const labelId = $.step.parameters.labelId;

    const params = {
      maxResults: 500,
      pageToken: undefined,
    };

    if (labelId) {
      params.labelIds = labelId;
    }

    do {
      const { data } = await $.http.get(`/gmail/v1/users/${userId}/messages`, {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (!data?.messages?.length) {
        return;
      }

      for (const message of data.messages) {
        const { data: messageData } = await $.http.get(
          `/gmail/v1/users/${userId}/messages/${message.id}`
        );

        $.pushTriggerItem({
          raw: messageData,
          meta: {
            internalId: messageData.id,
          },
        });
      }
    } while (params.pageToken);
  },
});
