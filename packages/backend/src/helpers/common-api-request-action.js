import defineAction from './define-action.js';

export default defineAction({
  name: 'API Request',
  key: 'apiRequest',
  description: "Make a custom API request using this app's authentication",
  arguments: [
    {
      label: 'Method',
      key: 'method',
      type: 'dropdown',
      required: true,
      variables: true,
      value: 'get',
      options: [
        { label: 'GET', value: 'get' },
        { label: 'POST', value: 'post' },
        { label: 'PUT', value: 'put' },
        { label: 'PATCH', value: 'patch' },
        { label: 'DELETE', value: 'delete' },
      ],
    },
    {
      label: 'Endpoint',
      key: 'endpoint',
      type: 'string',
      required: true,
      variables: true,
      description: 'API endpoint path (e.g., /users/123 or /v1/items)',
      placeholder: '/v1/endpoint',
    },
    {
      label: 'Query Parameters',
      key: 'queryParams',
      type: 'dynamic',
      required: false,
      description: 'Add or remove query parameters as needed',
      fields: [
        {
          label: 'Key',
          key: 'key',
          type: 'string',
          required: true,
          description: 'Parameter key',
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: true,
          description: 'Parameter value',
          variables: true,
        },
      ],
    },
    {
      label: 'Request Headers',
      key: 'headers',
      type: 'dynamic',
      required: false,
      description: 'Add or remove headers as needed',
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
    {
      label: 'Request Body',
      key: 'data',
      type: 'string',
      required: false,
      variables: true,
      description:
        'Request body in JSON format. If not valid JSON, it will be sent as raw text.',
      placeholder: '{"key": "value"}',
    },
  ],

  async run($) {
    const { method, endpoint, queryParams, headers, data } = $.step.parameters;

    const requestOptions = {
      method,
      url: endpoint,
    };

    if (Array.isArray(queryParams)) {
      requestOptions.params = {};

      for (const queryParam of queryParams) {
        if (queryParam.key) {
          requestOptions.params[queryParam.key] = queryParam.value;
        }
      }
    }

    if (Array.isArray(headers)) {
      requestOptions.headers = {};

      for (const header of headers) {
        if (header.key) {
          requestOptions.headers[header.key] = header.value;
        }
      }
    }

    if (data) {
      try {
        requestOptions.data = JSON.parse(data);
      } catch (error) {
        requestOptions.data = data;
      }
    }

    const response = await $.http(requestOptions);

    $.setActionItem({
      raw: {
        data: response.data,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      },
    });
  },
});
