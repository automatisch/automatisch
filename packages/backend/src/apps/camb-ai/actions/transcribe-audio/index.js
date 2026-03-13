import defineAction from '../../../../helpers/define-action.js';
import pollForResult from '../../common/poll-for-result.js';
import sanitizeForDb from '../../common/sanitize-for-db.js';

export default defineAction({
  name: 'Transcribe Audio',
  key: 'transcribeAudio',
  description: 'Transcribes audio to text using CAMB AI.',
  arguments: [
    {
      label: 'Audio URL',
      key: 'audioUrl',
      type: 'string',
      required: true,
      variables: true,
      description: 'URL of the audio file to transcribe.',
    },
    {
      label: 'Language',
      key: 'language',
      type: 'dropdown',
      required: true,
      variables: true,
      description: 'Language of the audio.',
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
  ],

  async run($) {
    const { audioUrl, language } = $.step.parameters;

    const formData = new FormData();
    formData.append('media_url', audioUrl);
    formData.append('language', String(Number(language)));

    const { data: postData } = await $.http.post('/apis/transcribe', formData);
    const taskId = postData.task_id;

    const result = await pollForResult($, `/transcribe/${taskId}`);
    const runId = result.run_id;

    const { data: resultData } = await $.http.get(`/apis/transcription-result/${runId}`, {
      params: {
        data_type: 'json',
        format_type: 'txt',
      },
    });

    const segments = resultData.transcript || [];
    const transcript = segments.map((s) => s.text).join(' ');

    $.setActionItem({
      raw: sanitizeForDb({
        taskId,
        runId,
        transcript,
        segments,
      }),
    });
  },
});
