export default {
  name: 'List voice XML node attributes',
  key: 'listVoiceXmlNodeAttributes',

  async run($) {
    const nodeName = $.step.parameters.nodeName;

    const conferenceAttributes = [
      { name: 'Beep', value: 'beep' },
      { name: 'Coach', value: 'coach' },
      { name: 'End Conference On Exit', value: 'endConferenceOnExit' },
      { name: 'Event Callback URL', value: 'eventCallbackUrl' },
      { name: 'Max Participants', value: 'maxParticipants' },
      { name: 'Muted', value: 'muted' },
      { name: 'Record', value: 'record' },
      {
        name: 'Recording Status Callback Event',
        value: 'recordingStatusCallbackEvent',
      },
      {
        name: 'Recording Status Callback Method',
        value: 'recordingStatusCallbackMethod',
      },
      { name: 'Recording Status Callback', value: 'recordingStatusCallback' },
      { name: 'Start Conference On Enter', value: 'startConferenceOnEnter' },
      { name: 'Status Callback Event', value: 'statusCallbackEvent' },
      { name: 'Status Callback Method', value: 'statusCallbackMethod' },
      { name: 'Status Callback', value: 'statusCallback' },
      { name: 'Trim', value: 'trim' },
      { name: 'Wait Method', value: 'waitMethod' },
      { name: 'Wait URL', value: 'waitUrl' },
    ];

    const dialAttributes = [
      { name: 'Action', value: 'action' },
      { name: 'Answer On Bridge', value: 'answerOnBridge' },
      { name: 'Caller ID', value: 'callerId' },
      { name: 'Caller Name', value: 'callerName' },
      { name: 'Hangup On Star', value: 'hangupOnStar' },
      { name: 'Method', value: 'method' },
      { name: 'Record', value: 'record' },
      {
        name: 'Recording Status Callback Event',
        value: 'recordingStatusCallbackEvent',
      },
      {
        name: 'Recording Status Callback Method',
        value: 'recordingStatusCallbackMethod',
      },
      { name: 'Recording Status Callback', value: 'recordingStatusCallback' },
      {
        name: 'Recording Storage URL Method',
        value: 'recordingStorageUrlMethod',
      },
      { name: 'Recording Storage URL', value: 'recordingStorageUrl' },
      { name: 'Recording Track', value: 'recordingTrack' },
      { name: 'Ring Tone', value: 'ringTone' },
      { name: 'Time Limit', value: 'timeLimit' },
      { name: 'Timeout', value: 'timeout' },
      { name: 'Trim', value: 'trim' },
    ];

    const echoAttributes = [{ name: 'Timeout', value: 'timeout' }];

    const enqueueAttributes = [
      { name: 'Action', value: 'action' },
      { name: 'Method', value: 'method' },
      { name: 'Wait URL', value: 'waitUrl' },
      { name: 'Wait URL Method', value: 'waitUrlMethod' },
    ];

    const gatherAttributes = [
      { name: 'Action On Empty Result', value: 'actionOnEmptyResult' },
      { name: 'Action', value: 'action' },
      { name: 'Enhanced', value: 'enhanced' },
      { name: 'Finish On Key', value: 'finishOnKey' },
      { name: 'Hints', value: 'hints' },
      { name: 'Input', value: 'input' },
      { name: 'Language', value: 'language' },
      { name: 'Method', value: 'method' },
      { name: 'Num Digits', value: 'numDigits' },
      {
        name: 'Partial Result Callback Method',
        value: 'partialResultCallbackMethod',
      },
      { name: 'Partial Result Callback', value: 'partialResultCallback' },
      { name: 'Profanity Filter', value: 'profanityFilter' },
      { name: 'Speech Model', value: 'speechModel' },
      { name: 'Speech Timeout', value: 'speechTimeout' },
      { name: 'Timeout', value: 'timeout' },
    ];

    const numberAttributes = [
      { name: 'Method', value: 'method' },
      { name: 'Send Digits', value: 'sendDigits' },
      { name: 'Status Callback Event', value: 'statusCallbackEvent' },
      { name: 'Status Callback Method', value: 'statusCallbackMethod' },
      { name: 'Status Callback', value: 'statusCallback' },
      { name: 'URL', value: 'url' },
    ];

    const pauseAttributes = [{ name: 'Length', value: 'length' }];

    const playAttributes = [
      { name: 'Digits', value: 'digits' },
      { name: 'Loop', value: 'loop' },
    ];

    const queueAttributes = [
      { name: 'Method', value: 'method' },
      { name: 'URL', value: 'url' },
    ];

    const recordAttributes = [
      { name: 'Action', value: 'action' },
      { name: 'Finish On Key', value: 'finishOnKey' },
      { name: 'Max Length', value: 'maxLength' },
      { name: 'Method', value: 'method' },
      { name: 'Play Beep', value: 'playBeep' },
      {
        name: 'Recording Status Callback Event',
        value: 'recordingStatusCallbackEvent',
      },
      {
        name: 'Recording Status Callback Method',
        value: 'recordingStatusCallbackMethod',
      },
      { name: 'Recording Status Callback', value: 'recordingStatusCallback' },
      { name: 'Storage URL Method', value: 'storageUrlMethod' },
      { name: 'Storage URL', value: 'storageUrl' },
      { name: 'Timeout', value: 'timeout' },
      { name: 'Transcribe Callback', value: 'transcribeCallback' },
      { name: 'Transcribe', value: 'transcribe' },
      { name: 'Trim', value: 'trim' },
    ];

    const redirectAttributes = [{ name: 'Method', value: 'method' }];

    const referAttributes = [
      { name: 'Action', value: 'action' },
      { name: 'Method', value: 'method' },
    ];

    const rejectAttributes = [{ name: 'Reason', value: 'reason' }];

    const sayAttributes = [
      { name: 'Language', value: 'language' },
      { name: 'Loop', value: 'loop' },
      { name: 'Voice', value: 'voice' },
    ];

    const sipAttributes = [
      { name: 'Codecs', value: 'codecs' },
      { name: 'Method', value: 'method' },
      { name: 'Password', value: 'password' },
      { name: 'Session Timeout', value: 'sessionTimeout' },
      { name: 'Status Callback Event', value: 'statusCallbackEvent' },
      { name: 'Status Callback Method', value: 'statusCallbackMethod' },
      { name: 'Status Callback', value: 'statusCallback' },
      { name: 'URL', value: 'url' },
      { name: 'Username', value: 'username' },
    ];

    const smsAttributes = [
      { name: 'Action', value: 'action' },
      { name: 'From', value: 'from' },
      { name: 'Method', value: 'method' },
      { name: 'Status Callback', value: 'statusCallback' },
      { name: 'To', value: 'to' },
    ];

    const virtualAgentAttributes = [
      { name: 'Connector Name', value: 'connectorName' },
    ];

    const streamAttributes = [
      { name: 'URL', value: 'url' },
      { name: 'Name', value: 'name' },
      { name: 'Track', value: 'track' },
      { name: 'Status Callback', value: 'statusCallback' },
      { name: 'Status Callback Method', value: 'statusCallbackMethod' },
    ];

    if (nodeName === 'Conference') return { data: conferenceAttributes };
    if (nodeName === 'Dial') return { data: dialAttributes };
    if (nodeName === 'Echo') return { data: echoAttributes };
    if (nodeName === 'Enqueue') return { data: enqueueAttributes };
    if (nodeName === 'Gather') return { data: gatherAttributes };
    if (nodeName === 'Number') return { data: numberAttributes };
    if (nodeName === 'Pause') return { data: pauseAttributes };
    if (nodeName === 'Play') return { data: playAttributes };
    if (nodeName === 'Queue') return { data: queueAttributes };
    if (nodeName === 'Record') return { data: recordAttributes };
    if (nodeName === 'Redirect') return { data: redirectAttributes };
    if (nodeName === 'Refer') return { data: referAttributes };
    if (nodeName === 'Reject') return { data: rejectAttributes };
    if (nodeName === 'Say') return { data: sayAttributes };
    if (nodeName === 'Sip') return { data: sipAttributes };
    if (nodeName === 'Sms') return { data: smsAttributes };
    if (nodeName === 'Stream') return { data: streamAttributes };
    if (nodeName === 'VirtualAgent') return { data: virtualAgentAttributes };

    return { data: [] };
  },
};
