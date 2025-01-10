export default {
  name: 'List voice XML node attribute values',
  key: 'listVoiceXmlNodeAttributeValues',

  async run($) {
    const nodeName = $.step.parameters.nodeName;
    const attributeName = $.step.parameters.attributeName;

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

    const conferenceStayAloneAttributeValues = [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
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
      stayAlone: conferenceStayAloneAttributeValues,
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

    const allNodeAttributeValues = {
      conference,
      say,
      sip,
      stream,
    };

    if (!nodeName) return { data: [] };

    const selectedNodeAttributes = allNodeAttributeValues[nodeName];

    if (!selectedNodeAttributes) return { data: [] };

    const selectedNodeAttributeValues = selectedNodeAttributes[attributeName];

    if (!selectedNodeAttributeValues) return { data: [] };

    return { data: selectedNodeAttributeValues };
  },
};
