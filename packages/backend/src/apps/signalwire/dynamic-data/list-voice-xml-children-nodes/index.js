export default {
  name: 'List voice XML children nodes',
  key: 'listVoiceXmlChildrenNodes',

  async run($) {
    const parentNodeName = $.step.parameters.parentNodeName;

    const parentChildrenNodeMap = {
      Dial: [
        { name: 'Number', value: 'Number' },
        { name: 'Conference', value: 'Conference' },
        { name: 'Queue', value: 'Queue' },
        { name: 'Sip', value: 'Sip' },
        { name: 'Verto', value: 'Verto' },
      ],
      Gather: [
        { name: 'Say', value: 'Say' },
        { name: 'Play', value: 'Play' },
        { name: 'Pause', value: 'Pause' },
      ],
      Refer: [{ name: 'Sip', value: 'Sip' }],
      Connect: [
        { name: 'Room', value: 'Room' },
        { name: 'Stream', value: 'Stream' },
        { name: 'VirtualAgent', value: 'VirtualAgent' },
      ],
    };

    const childrenNodes = parentChildrenNodeMap[parentNodeName] || [];

    const nodes = {
      data: childrenNodes,
    };

    return nodes;
  },
};
