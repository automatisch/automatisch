const unreadMailsInInbox = async ($) => {
  let mailFolderId = 'inbox'; // default mail folder id
  if ($.step.parameters.mailFolderId) {
    mailFolderId = $.step.parameters.mailFolderId;
  }
  const params = {
    '$top': 10, // fetch top 10 emails
    '$orderby': 'receivedDateTime DESC', // order by receivedDateTime
    '$select': 'subject,from,receivedDateTime,bodyPreview', // select fields
    '$filter': 'isRead eq false' // filter unread emails
  };

  let morePagesAvailable = false; // flag to check if more pages are available
  let url = `/v1.0/me/mailfolders/${mailFolderId}/messages`; // API endpoint

  do {
    // request emails
    const response = await $.http.get(url, {
      params,
      headers: {
        'Prefer': 'outlook.body-content-type="text"'// force to get mail body as text
      }
    });

    if (response.data.value?.length) {
      for (const _email of response.data.value) {
        const emailId = _email.id;
        // request specific email
        const emailResponse = await $.http.get(`/v1.0/me/messages/${emailId}`, {
          headers: {
            'Prefer': 'outlook.body-content-type="text"'
          }
        });
        const email = emailResponse.data;
        $.pushTriggerItem({
          raw: email,
          meta: {
            internalId: email.id,
            subject: email.subject,
            from: email.from?.emailAddress?.address,
            receivedDateTime: email.receivedDateTime,
            bodyPreview: email.bodyPreview,
            bodyContent: email.body.content,
            bodyContentType: email.body.contentType,
          },
        });
      }
    }

    // check if more pages are available
    morePagesAvailable = !!response.data['@odata.nextLink'];
    if (morePagesAvailable) {
      url = response.data['@odata.nextLink']; // set next page url
    }

  } while (morePagesAvailable);
};

export default unreadMailsInInbox;
