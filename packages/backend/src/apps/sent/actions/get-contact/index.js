import defineAction from '../../../../helpers/define-action.js';
import getProfileHeaders from '../../common/get-profile-headers.js';
import senderProfileArgument from '../../common/sender-profile-argument.js';
import { assertUuid } from '../../common/validators.js';

export default defineAction({
  name: 'Get contact',
  key: 'getContact',
  description:
    'Retrieves a contact by ID, including phone number formats, available channels and opt-out status.',
  arguments: [
    senderProfileArgument,
    {
      label: 'Contact ID',
      key: 'contactId',
      type: 'string',
      required: true,
      description: 'The ID of the contact.',
      variables: true,
    },
  ],

  async run($) {
    const contactId = assertUuid($.step.parameters.contactId, 'Contact ID');
    const headers = getProfileHeaders($.step.parameters.senderProfileId);

    const response = await $.http.get(
      `/v3/contacts/${encodeURIComponent(contactId)}`,
      { headers }
    );

    $.setActionItem({ raw: response.data });
  },
});
