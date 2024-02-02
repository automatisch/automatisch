const postMessage = async ($) => {
  const { parameters } = $.step;
  const channel_id = parameters.channel;
  const message = parameters.message;

  const data = {
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
