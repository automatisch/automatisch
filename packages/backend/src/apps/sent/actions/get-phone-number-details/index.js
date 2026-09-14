import defineAction from '../../../../helpers/define-action.js';
import getProfileHeaders from '../../common/get-profile-headers.js';
import senderProfileArgument from '../../common/sender-profile-argument.js';
import { parsePhoneNumbers } from '../../common/validators.js';

export default defineAction({
  name: 'Get phone number details',
  key: 'getPhoneNumberDetails',
  description:
    'Looks up a phone number and returns its validity, country, carrier, line type, porting and VoIP information.',
  arguments: [
    senderProfileArgument,
    {
      label: 'Phone Number',
      key: 'phoneNumber',
      type: 'string',
      required: true,
      description: 'Phone number in E.164 format (for example +14155550100).',
      variables: true,
    },
  ],

  async run($) {
    const [phoneNumber] = parsePhoneNumbers(
      $.step.parameters.phoneNumber,
      'Phone number'
    );

    const headers = getProfileHeaders($.step.parameters.senderProfileId);

    const response = await $.http.get(
      `/v3/numbers/lookup/${encodeURIComponent(phoneNumber)}`,
      { headers }
    );

    $.setActionItem({ raw: response.data });
  },
});
