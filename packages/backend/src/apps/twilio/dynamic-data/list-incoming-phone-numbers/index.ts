import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type TResponse = {
  data: IJSONObject[];
  error?: IJSONObject;
};

type TIncomingPhoneNumber = {
  phone_number: string;
  friendly_name: string;
  sid: string;
  capabilities: {
    sms: boolean;
  };
};

type TResponseData = {
  incoming_phone_numbers: TIncomingPhoneNumber[];
  next_page_uri: string;
};

export default {
  name: 'List incoming phone numbers',
  key: 'listIncomingPhoneNumbers',

  async run($: IGlobalVariable) {
    const valueType = $.step.parameters.valueType as string;
    const isSid = valueType === 'sid';

    const aggregatedResponse: TResponse = { data: [] };
    let pathname = `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers.json`;

    do {
      const response = await $.http.get<TResponseData>(pathname);

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
