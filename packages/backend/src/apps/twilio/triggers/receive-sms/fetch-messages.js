import getIncomingPhoneNumber from '../../common/get-incoming-phone-number.js';

const fetchMessages = async ($) => {
  const incomingPhoneNumber = await getIncomingPhoneNumber($);

  let response;
  let requestPath = `/2010-04-01/Accounts/${$.auth.data.accountSid}/Messages.json?To=${incomingPhoneNumber.phone_number}`;

  do {
    response = await $.http.get(requestPath);

    response.data.messages.forEach((message) => {
      const computedMessage = {
        To: message.to,
        Body: message.body,
        From: message.from,
        SmsSid: message.sid,
        NumMedia: message.num_media,
        SmsStatus: message.status,
        AccountSid: message.account_sid,
        ApiVersion: message.api_version,
        NumSegments: message.num_segments,
      };

      const dataItem = {
        raw: computedMessage,
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
