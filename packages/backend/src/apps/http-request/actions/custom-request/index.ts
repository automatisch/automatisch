import defineAction from '../../../../helpers/define-action';

type TMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export default defineAction({
  name: 'Custom Request',
  key: 'customRequest',
  description: 'Makes a custom HTTP request by providing raw details.',
  arguments: [
    {
      label: 'Method',
      key: 'method',
      type: 'dropdown' as const,
      required: true,
      description: `The HTTP method we'll use to perform the request.`,
      value: 'GET',
      options: [
        { label: 'DELETE', value: 'DELETE' },
        { label: 'GET', value: 'GET' },
        { label: 'PATCH', value: 'PATCH' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
      ],
    },
    {
      label: 'URL',
      key: 'url',
      type: 'string' as const,
      required: true,
      description: 'Any URL with a querystring will be re-encoded properly.',
      variables: true,
    },
    {
      label: 'Data',
      key: 'data',
      type: 'string' as const,
      required: false,
      description: 'Place raw JSON data here.',
      variables: true,
    },
  ],

  async run($) {
    const method = $.step.parameters.method as TMethod;
    const data = $.step.parameters.data as string;
    const url = $.step.parameters.url as string;
    const maxFileSize = 25 * 1024 * 1024; // 25MB

    const metadataResponse = await $.http.head(url);

    if (Number(metadataResponse.headers['content-length']) > maxFileSize) {
      throw new Error(
        `Response is too large. Maximum size is 25MB. Actual size is ${metadataResponse.headers['content-length']}`
      );
    }

    const response = await $.http.request({
      url,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let responseData = response.data;

    if (typeof response.data === 'string') {
      responseData = response.data.replaceAll('\u0000', '');
    }

    $.setActionItem({ raw: { data: responseData } });
  },
});
