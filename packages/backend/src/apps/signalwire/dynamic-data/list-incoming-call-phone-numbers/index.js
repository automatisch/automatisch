export default {
  name: 'List incoming call phone numbers',
  key: 'listIncomingCallPhoneNumbers',

  async run($) {
    let requestPath = `/api/laml/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers`;

    const aggregatedResponse = {
      data: [],
    };

    do {
      const { data } = await $.http.get(requestPath);

      const voiceCapableIncomingPhoneNumbers = data.incoming_phone_numbers
        .filter((incomingPhoneNumber) => {
          return incomingPhoneNumber.capabilities.voice;
        })
        .map((incomingPhoneNumber) => {
          const friendlyName = incomingPhoneNumber.friendly_name;
          const phoneNumber = incomingPhoneNumber.phone_number;
          const name = [friendlyName, phoneNumber].filter(Boolean).join(' - ');

          return {
            value: incomingPhoneNumber.sid,
            name,
          };
        });

      aggregatedResponse.data.push(...voiceCapableIncomingPhoneNumbers);

      requestPath = data.next_page_uri;
    } while (requestPath);

    return aggregatedResponse;
  },
};
