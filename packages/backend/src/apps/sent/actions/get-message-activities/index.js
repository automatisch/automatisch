import defineAction from '../../../../helpers/define-action.js';
import getProfileHeaders from '../../common/get-profile-headers.js';
import senderProfileArgument from '../../common/sender-profile-argument.js';
import { assertUuid } from '../../common/validators.js';

export default defineAction({
  name: 'Get message activities',
  key: 'getMessageActivities',
  description:
    'Retrieves the activity log of a message (queued, routed, sent, delivered, read, failed, blocked and more).',
  arguments: [
    senderProfileArgument,
    {
      label: 'Message ID',
      key: 'messageId',
      type: 'string',
      required: true,
      description: 'The message ID returned by Send message.',
      variables: true,
    },
  ],

  async run($) {
    const messageId = assertUuid($.step.parameters.messageId, 'Message ID');
    const headers = getProfileHeaders($.step.parameters.senderProfileId);

    const response = await $.http.get(
      `/v3/messages/${encodeURIComponent(messageId)}/activities`,
      { headers }
    );

    $.setActionItem({ raw: response.data });
  },
});
