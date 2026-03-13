import defineAction from '../../../../helpers/define-action.js';
import downloadFile from '../../common/download-file.js';
import sanitizeForDb from '../../common/sanitize-for-db.js';

export default defineAction({
  name: 'Clone Voice',
  key: 'cloneVoice',
  description: 'Clones a voice from an audio sample.',
  arguments: [
    {
      label: 'Audio URL',
      key: 'audioUrl',
      type: 'string',
      required: true,
      variables: true,
      description: 'URL of the audio sample (30-60 seconds recommended).',
    },
    {
      label: 'Voice Name',
      key: 'voiceName',
      type: 'string',
      required: true,
      variables: true,
      description: 'Name to assign to the cloned voice.',
    },
    {
      label: 'Gender',
      key: 'gender',
      type: 'dropdown',
      required: true,
      description: 'Gender of the voice.',
      options: [
        {
          label: 'Male',
          value: '1',
        },
        {
          label: 'Female',
          value: '2',
        },
      ],
    },
    {
      label: 'Age',
      key: 'age',
      type: 'string',
      required: true,
      variables: true,
      value: '30',
      description: 'Approximate age of the speaker.',
    },
  ],

  async run($) {
    const { audioUrl, voiceName, gender, age } = $.step.parameters;

    const { buffer, mimeType, fileName } = await downloadFile($, audioUrl);

    const formData = new FormData();
    formData.append(
      'file',
      new Blob([buffer], { type: mimeType }),
      fileName
    );
    formData.append('voice_name', voiceName);
    formData.append('gender', String(Number(gender)));
    formData.append('age', String(Number(age)));

    const { data } = await $.http.post('/apis/create-custom-voice', formData);

    $.setActionItem({
      raw: sanitizeForDb(data),
    });
  },
});
