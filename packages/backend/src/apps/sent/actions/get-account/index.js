import defineAction from '../../../../helpers/define-action.js';
import getProfileHeaders from '../../common/get-profile-headers.js';
import senderProfileArgument from '../../common/sender-profile-argument.js';

export default defineAction({
  name: 'Get account',
  key: 'getAccount',
  description:
    'Retrieves the account behind the connection, including its type, channels, sending number and sender profiles.',
  arguments: [senderProfileArgument],

  async run($) {
    const headers = getProfileHeaders($.step.parameters.senderProfileId);
    const response = await $.http.get('/v3/me', { headers });

    $.setActionItem({ raw: response.data });
  },
});
