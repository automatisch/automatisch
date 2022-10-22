import { IGlobalVariable } from '@automatisch/types';

const postMessage = async (
  $: IGlobalVariable,
  channelId: string,
  text: string
) => {
  const params = {
    channel: channelId,
    text,
  };

  const response = await $.http.post('/chat.postMessage', params);

  if (response.data.ok === false) {
    throw new Error(JSON.stringify(response.data));
  }

  const message = {
    raw: response?.data?.message,
  };

  $.setActionItem(message);
};

export default postMessage;
