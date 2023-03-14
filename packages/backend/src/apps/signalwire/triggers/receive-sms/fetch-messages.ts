import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const fetchMessages = async ($: IGlobalVariable) => {
  const toNumber = $.step.parameters.toNumber as string;

  let response;
  let requestPath = `/api/laml/2010-04-01/Accounts/${$.auth.data.accountSid}/Messages?To=${toNumber}`;

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

    requestPath = response.data.next_page_uri;
  } while (requestPath);
};

export default fetchMessages;
