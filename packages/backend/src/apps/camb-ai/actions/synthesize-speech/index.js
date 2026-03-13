import defineAction from '../../../../helpers/define-action.js';
import pollForResult from '../../common/poll-for-result.js';

export default defineAction({
  name: 'Synthesize Speech',
  key: 'synthesizeSpeech',
  description: 'Converts text to speech using CAMB AI TTS.',
  arguments: [
    {
      label: 'Text',
      key: 'text',
      type: 'string',
      required: true,
      variables: true,
      description: 'Text to convert to speech (3-3000 characters).',
    },
    {
      label: 'Voice',
      key: 'voiceId',
      type: 'dropdown',
      required: true,
      variables: true,
      description: 'Voice to use for synthesis.',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listVoices',
          },
        ],
      },
    },
    {
      label: 'Language',
      key: 'language',
      type: 'dropdown',
      required: true,
      variables: true,
      description: 'Language for synthesis.',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLanguages',
          },
        ],
      },
    },
    {
      label: 'Model',
      key: 'model',
      type: 'dropdown',
      required: false,
      value: 'mars-flash',
      description: 'The MARS TTS model to use.',
      options: [
        {
          label: 'MARS Flash',
          value: 'mars-flash',
        },
        {
          label: 'MARS Pro',
          value: 'mars-pro',
        },
        {
          label: 'MARS Instruct',
          value: 'mars-instruct',
        },
      ],
    },
  ],

  async run($) {
    const { text, voiceId, language, model } = $.step.parameters;

    const payload = {
      text,
      voice_id: Number(voiceId),
      language: Number(language),
      speech_model: model || 'mars-flash',
    };

    const { data: postData } = await $.http.post('/apis/tts', payload);
    const taskId = postData.task_id;

    const result = await pollForResult($, `/tts/${taskId}`);
    const runId = result.run_id;

    const { data: resultData } = await $.http.get(`/apis/tts-result/${runId}`, {
      params: { output_type: 'file_url' },
    });

    $.setActionItem({
      raw: {
        taskId,
        runId,
        audioUrl: resultData.output_url,
      },
    });
  },
});
