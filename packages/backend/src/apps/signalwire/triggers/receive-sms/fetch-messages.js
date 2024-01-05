const fetchMessages = async ($) => {
  const toNumber = $.step.parameters.toNumber;

  let response;
  let requestPath = `/api/laml/2010-04-01/Accounts/${$.auth.data.accountSid}/Messages?To=${toNumber}`;

  do {
    response = await $.http.get(requestPath);

    response.data.messages.forEach((message) => {
      const dataItem = {
        raw: message,
        meta: {
          internalId: message.date_sent,
        },
      };

      $.pushTriggerItem(dataItem);
    });

    requestPath = response.data.next_page_uri;
  } while (requestPath);
};

export default fetchMessages;
