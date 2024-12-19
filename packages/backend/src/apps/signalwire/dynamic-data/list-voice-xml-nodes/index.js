export default {
  name: 'List voice XML nodes',
  key: 'listVoiceXmlNodes',

  async run() {
    const nodes = {
      data: [
        { name: 'Conference', value: 'Conference' },
        { name: 'Connect', value: 'Connect' },
        { name: 'Denoise', value: 'Denoise' },
        { name: 'Dial', value: 'Dial' },
        { name: 'Echo', value: 'Echo' },
        { name: 'Enqueue', value: 'Enqueue' },
        { name: 'Gather', value: 'Gather' },
        { name: 'Hangup', value: 'Hangup' },
        { name: 'Leave', value: 'Leave' },
        { name: 'Number', value: 'Number' },
        { name: 'Pause', value: 'Pause' },
        { name: 'Play', value: 'Play' },
        { name: 'Queue', value: 'Queue' },
        { name: 'Record', value: 'Record' },
        { name: 'Redirect', value: 'Redirect' },
        { name: 'Refer', value: 'Refer' },
        { name: 'Reject', value: 'Reject' },
        { name: 'Room', value: 'Room' },
        { name: 'Say', value: 'Say' },
        { name: 'Sip', value: 'Sip' },
        { name: 'Sms', value: 'Sms' },
        { name: 'Stream', value: 'Stream' },
        { name: 'Verto', value: 'Verto' },
        { name: 'VirtualAgent', value: 'VirtualAgent' },
      ],
    };

    return nodes;
  },
};
