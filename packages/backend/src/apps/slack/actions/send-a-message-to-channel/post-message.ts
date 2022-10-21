import { IGlobalVariable, IActionOutput } from '@automatisch/types';

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

  const message: IActionOutput = {
    data: {
      raw: response?.data?.message,
    },
    error: response?.httpError,
  };

  if (response.data.ok === false) {
    message.error = response.data;
  }

  return message;
};

export default postMessage;
