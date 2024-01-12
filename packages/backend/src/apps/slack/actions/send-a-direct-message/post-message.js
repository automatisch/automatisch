import { URL } from 'url';

const postMessage = async ($) => {
  const { parameters } = $.step;
  const toUsername = parameters.toUsername;
  const text = parameters.message;
  const sendAsBot = parameters.sendAsBot;
  const botName = parameters.botName;
  const botIcon = parameters.botIcon;

  const data = {
    channel: toUsername,
    text,
  };

  if (sendAsBot) {
    data.username = botName;
    try {
      // challenging the input to check if it is a URL!
      new URL(botIcon);
      data.icon_url = botIcon;
    } catch {
      data.icon_emoji = botIcon;
    }
  }

  const customConfig = {
    sendAsBot,
  };

  const response = await $.http.post('/chat.postMessage', data, {
    additionalProperties: customConfig,
  });

  if (response.data.ok === false) {
    throw new Error(JSON.stringify(response.data));
  }

  const message = {
    raw: response?.data,
  };

  $.setActionItem(message);
};

export default postMessage;
