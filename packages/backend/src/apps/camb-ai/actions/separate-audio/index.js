import defineAction from '../../../../helpers/define-action.js';
import pollForResult from '../../common/poll-for-result.js';
import downloadFile from '../../common/download-file.js';
import sanitizeForDb from '../../common/sanitize-for-db.js';

export default defineAction({
  name: 'Separate Audio',
  key: 'separateAudio',
  description: 'Separates speech from background audio.',
  arguments: [
    {
      label: 'Audio URL',
      key: 'audioUrl',
      type: 'string',
      required: true,
      variables: true,
      description: 'URL of the audio file to separate.',
    },
  ],

  async run($) {
    const { audioUrl } = $.step.parameters;

    const { buffer, mimeType, fileName } = await downloadFile($, audioUrl);

    const formData = new FormData();
    formData.append(
      'media_file',
      new Blob([buffer], { type: mimeType }),
      fileName
    );

    const { data: postData } = await $.http.post('/apis/audio-separation', formData);
    const taskId = postData.task_id;

    const result = await pollForResult($, `/audio-separation/${taskId}`);
    const runId = result.run_id;

    const { data: resultData } = await $.http.get(`/apis/audio-separation-result/${runId}`);

    $.setActionItem({
      raw: sanitizeForDb({
        taskId,
        runId,
        foregroundAudioUrl: resultData.foreground_audio_url,
        backgroundAudioUrl: resultData.background_audio_url,
        ...resultData,
      }),
    });
  },
});
