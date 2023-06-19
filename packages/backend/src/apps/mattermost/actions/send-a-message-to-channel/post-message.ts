import { IGlobalVariable } from '@automatisch/types';

type TData = {
  channel_id: string;
  message: string;
};

const postMessage = async ($: IGlobalVariable) => {
  const { parameters } = $.step;
  const channel_id = parameters.channel as string;
  const message = parameters.message as string;

  const data: TData = {
    channel_id,
    message,
  };

  const response = await $.http.post('/api/v4/posts', data);

  const actionData = {
    raw: response?.data,
  };

  $.setActionItem(actionData);
};

export default postMessage;
