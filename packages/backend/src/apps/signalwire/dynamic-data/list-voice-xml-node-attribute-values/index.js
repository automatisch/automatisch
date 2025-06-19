export default {
  name: 'List voice XML node attribute values',
  key: 'listVoiceXmlNodeAttributeValues',

  async run($) {
    const nodeName = $.step.parameters.nodeName;
    const attributeKey = $.step.parameters.attributeKey;

    // Node: Conference
    const conferenceMutedAttributeValues = [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
      },
    ];

    const conferenceBeepAttributeValues = [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
      },
      {
        name: 'On Enter Only',
        value: 'onEnter',
      },
      {
        name: 'On Exit Only',
        value: 'onExit',
      },
    ];

    const conferenceStartConferenceOnEnterAttributeValues = [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
      },
    ];

    const conferenceEndConferenceOnExitAttributeValues = [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
      },
    ];

    const conferenceWaitMethodAttributeValues = [
      {
        name: 'POST',
        value: 'POST',
      },
      {
        name: 'GET',
        value: 'GET',
      },
    ];

    const conferenceRecordAttributeValues = [
      {
        name: 'Record From Start',
        value: 'record-from-start',
      },
      {
        name: 'Do Not Record',
        value: 'do-not-record',
      },
    ];

    const conferenceTrimAttributeValues = [
      {
        name: 'Trim Silence',
        value: 'trim-silence',
      },
      {
        name: 'Do Not Trim',
        value: 'do-not-trim',
      },
    ];

    const conferenceJitterBufferAttributeValues = [
      {
        name: 'Off',
        value: 'off',
      },
      {
        name: 'Fixed',
        value: 'fixed',
      },
      {
        name: 'Adaptive',
        value: 'adaptive',
      },
    ];

    const conference = {
      muted: conferenceMutedAttributeValues,
      beep: conferenceBeepAttributeValues,
      startConferenceOnEnter: conferenceStartConferenceOnEnterAttributeValues,
      endConferenceOnExit: conferenceEndConferenceOnExitAttributeValues,
      waitMethod: conferenceWaitMethodAttributeValues,
      record: conferenceRecordAttributeValues,
      trim: conferenceTrimAttributeValues,
      jitterBuffer: conferenceJitterBufferAttributeValues,
    };

    // NODE: Say
    const sayVoiceAttributeValues = [
      { name: 'Man', value: 'man' },
      { name: 'Woman', value: 'woman' },
      { name: 'Polly Man', value: 'Polly.man' },
      { name: 'Polly Woman', value: 'Polly.woman' },
      { name: 'Polly Man Neural', value: 'Polly.man-Neural' },
      { name: 'Polly Woman Neural', value: 'Polly.woman-Neural' },
      { name: 'Google Cloud Man', value: 'gcloud.man' },
      { name: 'Google Cloud Woman', value: 'gcloud.woman' },
    ];

    const sayLoopAttributeValues = [
      { name: 'Infinite', value: 0 },
      { name: 'One Time', value: 1 },
      { name: 'Two Times', value: 2 },
      { name: 'Three Times', value: 3 },
      { name: 'Four Times', value: 4 },
      { name: 'Five Times', value: 5 },
    ];

    const sayLanguageAttributeValues = [
      { name: 'English (US)', value: 'en-US' },
      { name: 'English (UK)', value: 'en-GB' },
      { name: 'Spanish (Spain)', value: 'es-ES' },
      { name: 'French (France)', value: 'fr-FR' },
      { name: 'German (Germany)', value: 'de-DE' },
    ];

    const say = {
      voice: sayVoiceAttributeValues,
      loop: sayLoopAttributeValues,
      language: sayLanguageAttributeValues,
    };

    // Node: Sip

    const sipCodecsAttributeValues = [
      { name: 'PCMU', value: 'PCMU' },
      { name: 'PCMA', value: 'PCMA' },
      { name: 'G722', value: 'G722' },
      { name: 'G729', value: 'G729' },
      { name: 'OPUS', value: 'OPUS' },
    ];

    const sipMethodAttributeValues = [
      { name: 'GET', value: 'GET' },
      { name: 'POST', value: 'POST' },
    ];

    const sipStatusCallbackMethodAttributeValues = [
      { name: 'GET', value: 'GET' },
      { name: 'POST', value: 'POST' },
    ];

    const sipStatusCallbackEventValues = [
      { name: 'Initiated', value: 'initiated' },
      { name: 'Ringing', value: 'ringing' },
      { name: 'Answered', value: 'answered' },
      { name: 'Completed', value: 'completed' },
    ];

    const sip = {
      codecs: sipCodecsAttributeValues,
      method: sipMethodAttributeValues,
      statusCallbackMethod: sipStatusCallbackMethodAttributeValues,
      statusCallbackEvent: sipStatusCallbackEventValues,
    };

    // Node: Stream
    const streamTrackAttributeValues = [
      {
        name: 'Inbound Track',
        value: 'inbound_track',
      },
      {
        name: 'Outbound Track',
        value: 'outbound_track',
      },
      {
        name: 'Both Tracks',
        value: 'both_tracks',
      },
    ];

    const streamStatusCallbackMethodAttributeValues = [
      {
        name: 'GET',
        value: 'GET',
      },
      {
        name: 'POST',
        value: 'POST',
      },
    ];

    const stream = {
      track: streamTrackAttributeValues,
      statusCallbackMethod: streamStatusCallbackMethodAttributeValues,
    };

    // Node: Dial
    const dialAnswerOnBridgeAttributeValues = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    const dialHangupOnStarAttributeValues = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    const dialMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const dialRecordAttributeValues = [
      { name: 'Do Not Record', value: 'do-not-record' },
      { name: 'Record from Answer', value: 'record-from-answer' },
      { name: 'Record from Ringing', value: 'record-from-ringing' },
      { name: 'Dual Channel from Answer', value: 'record-from-answer-dual' },
      { name: 'Dual Channel from Ringing', value: 'record-from-ringing-dual' },
    ];

    const dialRecordingStatusCallbackEventAttributeValues = [
      { name: 'Completed', value: 'completed' },
      { name: 'In Progress', value: 'in-progress' },
      { name: 'Absent', value: 'absent' },
    ];

    const dialRecordingStatusCallbackMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const dialRecordingTrackAttributeValues = [
      { name: 'Inbound', value: 'inbound' },
      { name: 'Outbound', value: 'outbound' },
      { name: 'Both', value: 'both' },
    ];

    const dialRingToneAttributeValues = [
      { name: 'Austria', value: 'at' },
      { name: 'Australia', value: 'au' },
      { name: 'Belgium', value: 'be' },
      { name: 'Brazil', value: 'br' },
      { name: 'Canada', value: 'ca' },
      { name: 'China', value: 'cn' },
      { name: 'Denmark', value: 'dk' },
      { name: 'France', value: 'fr' },
      { name: 'Germany', value: 'de' },
      { name: 'United States', value: 'us' },
      { name: 'United Kingdom', value: 'uk' },
      { name: 'Japan', value: 'jp' },
      // Add more ISO 3166-1 alpha-2 codes as needed
    ];

    const dialTrimAttributeValues = [
      { name: 'Trim Silence', value: 'trim-silence' },
      { name: 'Do Not Trim', value: 'do-not-trim' },
    ];

    const dial = {
      answerOnBridge: dialAnswerOnBridgeAttributeValues,
      hangupOnStar: dialHangupOnStarAttributeValues,
      method: dialMethodAttributeValues,
      record: dialRecordAttributeValues,
      recordingStatusCallbackEvent:
        dialRecordingStatusCallbackEventAttributeValues,
      recordingStatusCallbackMethod:
        dialRecordingStatusCallbackMethodAttributeValues,
      recordingTrack: dialRecordingTrackAttributeValues,
      ringTone: dialRingToneAttributeValues,
      trim: dialTrimAttributeValues,
    };

    // Node: Enqueue
    const enqueueMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const enqueueWaitUrlMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const enqueue = {
      method: enqueueMethodAttributeValues,
      waitUrlMethod: enqueueWaitUrlMethodAttributeValues,
    };

    // Node: Gather
    const gatherActionOnEmptyResultAttributeValues = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    const gatherEnhancedAttributeValues = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    const gatherInputAttributeValues = [
      { name: 'DTMF', value: 'dtmf' },
      { name: 'Speech', value: 'speech' },
      { name: 'DTMF and Speech', value: 'dtmf speech' },
    ];

    const gatherLanguageAttributeValues = [
      { name: 'English (US)', value: 'en-US' },
      { name: 'English (UK)', value: 'en-GB' },
      { name: 'Spanish (Spain)', value: 'es-ES' },
      { name: 'French (France)', value: 'fr-FR' },
      { name: 'German (Germany)', value: 'de-DE' },
    ];

    const gatherMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const gatherProfanityFilterAttributeValues = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    const gatherSpeechModelAttributeValues = [
      { name: 'Phone Call', value: 'phone_call' },
      { name: 'Video', value: 'video' },
      { name: 'Default', value: 'default' },
    ];

    const gatherSpeechTimeoutAttributeValues = [
      { name: 'Auto', value: 'auto' },
    ];

    const gather = {
      actionOnEmptyResult: gatherActionOnEmptyResultAttributeValues,
      enhanced: gatherEnhancedAttributeValues,
      input: gatherInputAttributeValues,
      language: gatherLanguageAttributeValues,
      method: gatherMethodAttributeValues,
      profanityFilter: gatherProfanityFilterAttributeValues,
      speechModel: gatherSpeechModelAttributeValues,
      speechTimeout: gatherSpeechTimeoutAttributeValues,
    };

    // Node: Number
    const numberMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const numberStatusCallbackEventAttributeValues = [
      { name: 'Initiated', value: 'initiated' },
      { name: 'Ringing', value: 'ringing' },
      { name: 'Answered', value: 'answered' },
      { name: 'Completed', value: 'completed' },
    ];

    const number = {
      method: numberMethodAttributeValues,
      statusCallbackEvent: numberStatusCallbackEventAttributeValues,
    };

    // Node: Queue
    const queueMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const queue = {
      method: queueMethodAttributeValues,
    };

    // Node: Record
    const recordMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const recordPlayBeepAttributeValues = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    const recordTrimAttributeValues = [
      { name: 'Trim Silence', value: 'trim-silence' },
      { name: 'Do Not Trim', value: 'do-not-trim' },
    ];

    const recordRecordingStatusCallbackEventAttributeValues = [
      { name: 'Completed', value: 'completed' },
      { name: 'In Progress', value: 'in-progress' },
      { name: 'Absent', value: 'absent' },
    ];

    const recordRecordingStatusCallbackMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const recordStorageUrlMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'PUT', value: 'PUT' },
    ];

    const recordTranscribeAttributeValues = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    const record = {
      method: recordMethodAttributeValues,
      playBeep: recordPlayBeepAttributeValues,
      trim: recordTrimAttributeValues,
      recordingStatusCallbackEvent:
        recordRecordingStatusCallbackEventAttributeValues,
      recordingStatusCallbackMethod:
        recordRecordingStatusCallbackMethodAttributeValues,
      storageUrlMethod: recordStorageUrlMethodAttributeValues,
      transcribe: recordTranscribeAttributeValues,
    };

    // Node: Redirect
    const redirectMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const redirect = {
      method: redirectMethodAttributeValues,
    };

    // Node: Refer
    const referMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const refer = {
      method: referMethodAttributeValues,
    };

    // Node: Reject
    const rejectReasonAttributeValues = [
      { name: 'Busy', value: 'busy' },
      { name: 'Rejected', value: 'rejected' },
    ];

    const reject = {
      reason: rejectReasonAttributeValues,
    };

    // Node: Sms
    const smsMethodAttributeValues = [
      { name: 'POST', value: 'POST' },
      { name: 'GET', value: 'GET' },
    ];

    const sms = {
      method: smsMethodAttributeValues,
    };

    const allNodeAttributeValues = {
      Conference: conference,
      Dial: dial,
      Enqueue: enqueue,
      Gather: gather,
      Number: number,
      Queue: queue,
      Record: record,
      Redirect: redirect,
      Refer: refer,
      Reject: reject,
      Say: say,
      Sip: sip,
      Sms: sms,
      Stream: stream,
    };

    if (!nodeName) return { data: [] };

    const selectedNodeAttributes = allNodeAttributeValues[nodeName];

    if (!selectedNodeAttributes) return { data: [] };

    const selectedNodeAttributeValues = selectedNodeAttributes[attributeKey];

    if (!selectedNodeAttributeValues) return { data: [] };

    return { data: selectedNodeAttributeValues };
  },
};
