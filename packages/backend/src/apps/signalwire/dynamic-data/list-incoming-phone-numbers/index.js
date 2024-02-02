export default {
  name: 'List incoming phone numbers',
  key: 'listIncomingPhoneNumbers',

  async run($) {
    let requestPath = `/api/laml/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers`;

    const aggregatedResponse = {
      data: [],
    };

    do {
      const { data } = await $.http.get(requestPath);

      const smsCapableIncomingPhoneNumbers = data.incoming_phone_numbers
        .filter((incomingPhoneNumber) => {
          return incomingPhoneNumber.capabilities.sms;
        })
        .map((incomingPhoneNumber) => {
          const friendlyName = incomingPhoneNumber.friendly_name;
          const phoneNumber = incomingPhoneNumber.phone_number;
          const name = [friendlyName, phoneNumber].filter(Boolean).join(' - ');

          return {
            value: phoneNumber,
            name,
          };
        });
      aggregatedResponse.data.push(...smsCapableIncomingPhoneNumbers);

      requestPath = data.next_page_uri;
    } while (requestPath);

    return aggregatedResponse;
  },
};
