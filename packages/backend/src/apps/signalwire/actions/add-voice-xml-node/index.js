import { XMLBuilder } from 'fast-xml-parser';
import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Add voice XML node',
  key: 'addVoiceXmlNode',
  description: 'Add a voice XML node in the XML document',
  supportsConnections: false,
  arguments: [
    {
      label: 'Node name',
      key: 'nodeName',
      type: 'dropdown',
      required: true,
      description: 'The name of the node to be added.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listVoiceXmlNodes',
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
                value: '{parameters.nodeName}',
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
                value: '{parameters.nodeName}',
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
    {
      label: 'Add children node',
      key: 'hasChildrenNodes',
      type: 'dropdown',
      required: true,
      description: 'Add a nested node to the main node',
      value: false,
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listNodeFields',
          },
          {
            name: 'parameters.hasChildrenNodes',
            value: '{parameters.hasChildrenNodes}',
          },
        ],
      },
    },
  ],

  async run($) {
    const nodeName = $.step.parameters.nodeName;
    const nodeValue = $.step.parameters.nodeValue;
    const attributes = $.step.parameters.attributes;
    const childrenNodes = $.step.parameters.childrenNodes;
    const hasChildrenNodes = $.step.parameters.hasChildrenNodes;

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      suppressEmptyNode: true,
      preserveOrder: true,
    });

    const computeAttributes = (attributes) =>
      attributes
        .filter((attribute) => attribute.key || attribute.value)
        .reduce(
          (result, attribute) => ({
            ...result,
            [`@_${attribute.key}`]: attribute.value,
          }),
          {}
        );

    const computeTextNode = (nodeValue) => ({
      '#text': nodeValue,
    });

    const computedChildrenNodes = hasChildrenNodes
      ? childrenNodes.map((childNode) => ({
          [childNode.nodeName]: [computeTextNode(childNode.nodeValue)],
          ':@': computeAttributes(childNode.attributes),
        }))
      : [];

    const xmlObject = {
      [nodeName]: [computeTextNode(nodeValue), ...computedChildrenNodes],
      ':@': computeAttributes(attributes),
    };

    const xmlString = builder.build([xmlObject]);

    $.setActionItem({ raw: { stringNode: xmlString } });
  },
});
