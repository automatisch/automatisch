import { IGlobalVariable } from '@automatisch/types';
import { URL } from 'url';

type TData = {
  channel: string;
  text: string;
  username?: string;
  icon_url?: string;
  icon_emoji?: string;
};

const postMessage = async ($: IGlobalVariable) => {
  const { parameters } = $.step;
  const channelId = parameters.channel as string;
  const text = parameters.message as string;
  const sendAsBot = parameters.sendAsBot as boolean;
  const botName = parameters.botName as string;
  const botIcon = parameters.botIcon as string;

  const data: TData = {
    channel: channelId,
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
