import defineAction from '../../../../helpers/define-action.js';
import pollForResult from '../../common/poll-for-result.js';

export default defineAction({
  name: 'Translated TTS',
  key: 'translatedTts',
  description: 'Translates text and converts it to speech.',
  arguments: [
    {
      label: 'Text',
      key: 'text',
      type: 'string',
      required: true,
      variables: true,
      description: 'Text to translate and convert to speech.',
    },
    {
      label: 'Source Language',
      key: 'sourceLanguage',
      type: 'dropdown',
      required: true,
      variables: true,
      description: 'Language of the input text.',
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
      label: 'Target Language',
      key: 'targetLanguage',
      type: 'dropdown',
      required: true,
      variables: true,
      description: 'Language for the output speech.',
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
      label: 'Voice',
      key: 'voiceId',
      type: 'dropdown',
      required: false,
      variables: true,
      description: 'Voice to use for the target language.',
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
  ],

  async run($) {
    const { text, sourceLanguage, targetLanguage, voiceId } = $.step.parameters;

    const payload = {
      text,
      source_language: Number(sourceLanguage),
      target_language: Number(targetLanguage),
    };

    if (voiceId) {
      payload.voice_id = Number(voiceId);
    }

    const { data: postData } = await $.http.post('/apis/translated-tts', payload);
    const taskId = postData.task_id;

    const result = await pollForResult($, `/translated-tts/${taskId}`);
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
