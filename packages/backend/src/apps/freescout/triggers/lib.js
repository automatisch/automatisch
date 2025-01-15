export const getRegisterHookFn = (key) => async ($) => {
  // https://api-docs.freescout.net/#create-webhook

  const { data } = await $.http.post(
    'api/webhooks',
    {
      url: $.webhookUrl,
      events: [key]
    }
  );

  console.log('getRegisterHookFn data', data)

  await $.flow.setRemoteWebhookId(data.id.toString());
};

export const unregisterHook = async ($) => {
  // https://api-docs.freescout.net/#delete-webhook
  await $.http.delete(
    `/api/webhooks/${$.flow.remoteWebhookId}`
  );
};
