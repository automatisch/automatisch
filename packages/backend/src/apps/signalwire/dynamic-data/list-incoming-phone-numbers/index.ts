import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type TAggregatedResponse = {
  data: IJSONObject[];
  error?: IJSONObject;
};

type TResponse = {
  incoming_phone_numbers: TIncomingPhoneNumber[];
  next_page_uri: string;
};

type TIncomingPhoneNumber = {
  capabilities: {
    sms: boolean;
  };
  sid: string;
  friendly_name: string;
  phone_number: string;
};

export default {
  name: 'List incoming phone numbers',
  key: 'listIncomingPhoneNumbers',

  async run($: IGlobalVariable) {
    let requestPath = `/api/laml/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers`;

    const aggregatedResponse: TAggregatedResponse = {
      data: [],
    };

    do {
      const { data } = await $.http.get<TResponse>(requestPath);

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
        })
      aggregatedResponse.data.push(...smsCapableIncomingPhoneNumbers)

      requestPath = data.next_page_uri;
    } while (requestPath);

    return aggregatedResponse;
  },
};
