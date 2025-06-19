export default {
  name: 'List messages',
  key: 'listMessages',

  async run($) {
    const messages = {
      data: [],
    };
    const userId = $.auth.data.userId;

    const { data } = await $.http.get(`/gmail/v1/users/${userId}/messages`);

    if (data.messages) {
      for (const message of data.messages) {
        const { data: messageData } = await $.http.get(
          `/gmail/v1/users/${userId}/messages/${message.id}`
        );
        const subject = messageData.payload.headers.find(
          (header) => header.name === 'Subject'
        );

        messages.data.push({
          value: message.id,
          name: subject?.value,
        });
      }
    }

    return messages;
  },
};
