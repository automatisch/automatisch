import defineAction from '../../../../helpers/define-action.js';
import pollForResult from '../../common/poll-for-result.js';

export default defineAction({
  name: 'Generate Sound',
  key: 'generateSound',
  description: 'Generates sound or music from a text prompt.',
  arguments: [
    {
      label: 'Prompt',
      key: 'prompt',
      type: 'string',
      required: true,
      variables: true,
      description: 'Description of the sound to generate.',
    },
    {
      label: 'Audio Type',
      key: 'audioType',
      type: 'dropdown',
      required: false,
      value: 'sound',
      description: 'Type of audio to generate.',
      options: [
        {
          label: 'Sound Effect',
          value: 'sound',
        },
        {
          label: 'Music',
          value: 'music',
        },
      ],
    },
    {
      label: 'Duration (seconds)',
      key: 'duration',
      type: 'string',
      required: false,
      value: '8',
      variables: true,
      description: 'Duration of generated audio in seconds (max 10).',
    },
  ],

  async run($) {
    const { prompt, audioType, duration } = $.step.parameters;

    const payload = {
      prompt,
      audio_type: audioType || 'sound',
      duration: Number(duration) || 8,
    };

    const { data: postData } = await $.http.post('/apis/text-to-sound', payload);
    const taskId = postData.task_id;

    const result = await pollForResult($, `/text-to-sound/${taskId}`);
    const runId = result.run_id;

    const { data: resultData } = await $.http.get(`/apis/text-to-sound-result/${runId}`, {
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
