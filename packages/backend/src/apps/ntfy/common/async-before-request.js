const asyncBeforeRequest = async ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skip)
    return requestConfig;

  const response = await $.http.post(
    'http://localhost:3000/webhooks/flows/8a040f4e-817f-4076-80ba-3c1c0af7e65e/sync',
    null,
    {
      additionalProperties: {
        skip: true,
      },
    }
  );

  console.log(response);
  requestConfig.additionalProperties = {
    extraData: response.data
  }

  return requestConfig;
};

export default asyncBeforeRequest;
