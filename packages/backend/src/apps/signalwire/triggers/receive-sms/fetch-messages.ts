import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const fetchMessages = async ($: IGlobalVariable) => {
  const toNumber = $.step.parameters.toNumber as string;

  let response;
  let requestPath = 'https://' + $.auth.data.spaceName + '.' + $.auth.data.spaceRegion + 'signalwire.com' + `/api/laml/2010-04-01/Accounts/${$.auth.data.accountSid}/Messages?To=${toNumber}`;

  do {
    response = await $.http.get(requestPath);

    response.data.messages.forEach((message: IJSONObject) => {
      const dataItem = {
        raw: message,
        meta: {
          internalId: message.date_sent as string,
        },
      };

      $.pushTriggerItem(dataItem);
    });

    requestPath = 'https://' + $.auth.data.spaceName + '.' + $.auth.data.spaceRegion + 'signalwire.com' + response.data.next_page_uri;
  } while (requestPath);
};

export default fetchMessages;
