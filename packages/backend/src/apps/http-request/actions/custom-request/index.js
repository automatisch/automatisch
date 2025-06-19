import defineAction from '../../../../helpers/define-action.js';

function isPossiblyTextBased(contentType) {
  if (!contentType) return false;

  return (
    contentType.startsWith('application/json') ||
    contentType.startsWith('text/')
  );
}

function throwIfFileSizeExceedsLimit(contentLength) {
  const maxFileSize = 25 * 1024 * 1024; // 25MB

  if (Number(contentLength) > maxFileSize) {
    throw new Error(
      `Response is too large. Maximum size is 25MB. Actual size is ${contentLength}`
    );
  }
}

export default defineAction({
  name: 'Custom request',
  key: 'customRequest',
  description: 'Makes a custom HTTP request by providing raw details.',
  arguments: [
    {
      label: 'Method',
      key: 'method',
      type: 'dropdown',
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
      type: 'string',
      required: true,
      description: 'Any URL with a querystring will be re-encoded properly.',
      variables: true,
    },
    {
      label: 'Data',
      key: 'data',
      type: 'string',
      required: false,
      description: 'Place raw JSON data here.',
      variables: true,
    },
    {
      label: 'Headers',
      key: 'headers',
      type: 'dynamic',
      required: false,
      description: 'Add or remove headers as needed',
      value: [
        {
          key: 'Content-Type',
          value: 'application/json',
        },
      ],
      fields: [
        {
          label: 'Key',
          key: 'key',
          type: 'string',
          required: true,
          description: 'Header key',
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: true,
          description: 'Header value',
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    const method = $.step.parameters.method;
    const data = $.step.parameters.data || null;
    const url = $.step.parameters.url;
    const headers = $.step.parameters.headers;

    const headersObject = headers.reduce((result, entry) => {
      const key = entry.key?.toLowerCase();
      const value = entry.value;

      if (key && value) {
        return {
          ...result,
          [entry.key?.toLowerCase()]: entry.value,
        };
      }

      return result;
    }, {});

    let expectedResponseContentType = headersObject.accept;

    // in case HEAD request is not supported by the URL
    try {
      const metadataResponse = await $.http.head(url, {
        headers: headersObject,
      });

      if (!expectedResponseContentType) {
        expectedResponseContentType = metadataResponse.headers['content-type'];
      }

      throwIfFileSizeExceedsLimit(metadataResponse.headers['content-length']);
      // eslint-disable-next-line no-empty
    } catch {}

    const requestData = {
      url,
      method,
      data,
      headers: headersObject,
    };

    if (!isPossiblyTextBased(expectedResponseContentType)) {
      requestData.responseType = 'arraybuffer';
    }

    const response = await $.http.request(requestData);

    throwIfFileSizeExceedsLimit(response.headers['content-length']);

    let responseData = response.data;

    if (!isPossiblyTextBased(expectedResponseContentType)) {
      responseData = Buffer.from(responseData).toString('base64');
    }

    $.setActionItem({
      raw: {
        data: responseData,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText
      }
    });
  },
});
