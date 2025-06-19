export default {
  name: 'List node fields',
  key: 'listNodeFields',

  async run($) {
    const hasChildrenNodes = $.step.parameters.hasChildrenNodes;

    if (!hasChildrenNodes) {
      return [];
    }

    return [
      {
        label: 'Children nodes',
        key: 'childrenNodes',
        type: 'dynamic',
        required: false,
        description: 'Add or remove nested node as needed',
        value: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
        fields: [
          {
            label: 'Node name',
            key: 'nodeName',
            type: 'dropdown',
            required: false,
            description: 'The name of the node to be added.',
            variables: true,
            source: {
              type: 'query',
              name: 'getDynamicData',
              arguments: [
                {
                  name: 'key',
                  value: 'listVoiceXmlChildrenNodes',
                },
                {
                  name: 'parameters.parentNodeName',
                  value: '{parameters.nodeName}',
                },
              ],
            },
          },
          {
            label: 'Node value',
            key: 'nodeValue',
            type: 'string',
            required: false,
            description: 'The value of the node to be added.',
            variables: true,
          },
          {
            label: 'Attributes',
            key: 'attributes',
            type: 'dynamic',
            required: false,
            description: 'Add or remove attributes for the node as needed',
            value: [
              {
                key: '',
                value: '',
              },
            ],
            fields: [
              {
                label: 'Attribute name',
                key: 'key',
                type: 'dropdown',
                required: false,
                variables: true,
                source: {
                  type: 'query',
                  name: 'getDynamicData',
                  arguments: [
                    {
                      name: 'key',
                      value: 'listVoiceXmlNodeAttributes',
                    },
                    {
                      name: 'parameters.nodeName',
                      value: '{outerScope.nodeName}',
                    },
                  ],
                },
              },
              {
                label: 'Attribute value',
                key: 'value',
                type: 'dropdown',
                required: false,
                variables: true,
                source: {
                  type: 'query',
                  name: 'getDynamicData',
                  arguments: [
                    {
                      name: 'key',
                      value: 'listVoiceXmlNodeAttributeValues',
                    },
                    {
                      name: 'parameters.nodeName',
                      value: '{outerScope.nodeName}',
                    },
                    {
                      name: 'parameters.attributeKey',
                      value: '{fieldsScope.key}',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ];
  },
};
