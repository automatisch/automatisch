import defineAction from '../../../../helpers/define-action.js';
import pollForResult from '../../common/poll-for-result.js';
import sanitizeForDb from '../../common/sanitize-for-db.js';

export default defineAction({
  name: 'Create Voice from Description',
  key: 'createVoice',
  description: 'Creates a synthetic voice from a text description.',
  arguments: [
    {
      label: 'Sample Text',
      key: 'text',
      type: 'string',
      required: true,
      variables: true,
      description: 'Sample text the synthetic voice will speak.',
    },
    {
      label: 'Voice Description',
      key: 'voiceDescription',
      type: 'string',
      required: true,
      variables: true,
      description:
        'Detailed description of the desired voice (minimum 100 characters). E.g., "A warm, friendly female voice with a slight British accent."',
    },
  ],

  async run($) {
    const { text, voiceDescription } = $.step.parameters;

    const payload = {
      text,
      voice_description: voiceDescription,
    };

    const { data: postData } = await $.http.post('/apis/text-to-voice', payload);
    const taskId = postData.task_id;

    const result = await pollForResult($, `/text-to-voice/${taskId}`);
    const runId = result.run_id;

    const { data: resultData } = await $.http.get(`/apis/text-to-voice-result/${runId}`, {
      params: { output_type: 'file_url' },
    });

    $.setActionItem({
      raw: sanitizeForDb({
        taskId,
        runId,
        audioUrl: resultData.output_url,
        ...resultData,
      }),
    });
  },
});
