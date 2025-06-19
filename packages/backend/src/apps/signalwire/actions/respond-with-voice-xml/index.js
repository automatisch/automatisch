import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Respond with voice XML',
  key: 'respondWithVoiceXml',
  description: 'Respond with defined voice XML document',
  supportsConnections: false,
  arguments: [
    {
      label: 'Nodes',
      key: 'nodes',
      type: 'dynamic',
      required: false,
      description: 'Add or remove nodes for the XML document as needed',
      value: [
        {
          nodeString: '',
        },
      ],
      fields: [
        {
          label: 'Node',
          key: 'nodeString',
          type: 'string',
          required: true,
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      suppressEmptyNode: true,
      preserveOrder: true,
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      preserveOrder: true,
      parseTagValue: false,
    });

    const nodes = $.step.parameters.nodes;
    const computedNodes = nodes.map((node) => node.nodeString);
    const parsedNodes = computedNodes.flatMap((computedNode) =>
      parser.parse(computedNode)
    );

    const xmlString = builder.build([
      {
        Response: parsedNodes,
      },
    ]);

    $.setActionItem({
      raw: {
        body: xmlString,
        statusCode: 200,
        headers: { 'content-type': 'text/xml' },
      },
    });
  },
});
