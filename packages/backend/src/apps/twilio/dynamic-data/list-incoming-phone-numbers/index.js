export default {
  name: 'List incoming phone numbers',
  key: 'listIncomingPhoneNumbers',

  async run($) {
    const valueType = $.step.parameters.valueType;
    const isSid = valueType === 'sid';

    const aggregatedResponse = { data: [] };
    let pathname = `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers.json`;

    do {
      const response = await $.http.get(pathname);

      for (const incomingPhoneNumber of response.data.incoming_phone_numbers) {
        if (incomingPhoneNumber.capabilities.sms === false) {
          continue;
        }

        const friendlyName = incomingPhoneNumber.friendly_name;
        const phoneNumber = incomingPhoneNumber.phone_number;
        const name = [friendlyName, phoneNumber].filter(Boolean).join(' - ');

        aggregatedResponse.data.push({
          value: isSid ? incomingPhoneNumber.sid : phoneNumber,
          name,
        });
      }

      pathname = response.data.next_page_uri;
    } while (pathname);

    return aggregatedResponse;
  },
};
