import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const postMessage = async (
  $: IGlobalVariable,
  channelId: string,
  text: string
) => {
  const message: {
    data: IJSONObject | null | undefined;
    error: IJSONObject | null | undefined;
  } = {
    data: null,
    error: null,
  };

  const headers = {
    Authorization: `Bearer ${$.auth.data.accessToken}`,
  };

  const params = {
    channel: channelId,
    text,
  };

  const response = await $.http.post('/chat.postMessage', params, { headers });

  message.error = response?.integrationError;
  message.data = response?.data?.message;

  if (response.data.ok === false) {
    message.error = response.data;
  }

  return message;
};

export default postMessage;
