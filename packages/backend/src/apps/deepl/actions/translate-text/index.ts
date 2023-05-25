import qs from 'qs';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Translate text',
  key: 'translateText',
  description: 'Translates text from one language to another.',
  arguments: [
    {
      label: 'Text',
      key: 'text',
      type: 'string' as const,
      required: true,
      description: 'Text to be translated.',
      variables: true,
    },
    {
      label: 'Target Language',
      key: 'targetLanguage',
      type: 'dropdown' as const,
      required: true,
      description: 'Language to translate the text to.',
      variables: true,
      value: '',
      options: [
        { label: 'Bulgarian', value: 'BG' },
        { label: 'Chinese (simplified)', value: 'ZH' },
        { label: 'Czech', value: 'CS' },
        { label: 'Danish', value: 'DA' },
        { label: 'Dutch', value: 'NL' },
        { label: 'English', value: 'EN' },
        { label: 'English (American)', value: 'EN-US' },
        { label: 'English (British)', value: 'EN-GB' },
        { label: 'Estonian', value: 'ET' },
        { label: 'Finnish', value: 'FI' },
        { label: 'French', value: 'FR' },
        { label: 'German', value: 'DE' },
        { label: 'Greek', value: 'EL' },
        { label: 'Hungarian', value: 'HU' },
        { label: 'Indonesian', value: 'ID' },
        { label: 'Italian', value: 'IT' },
        { label: 'Japanese', value: 'JA' },
        { label: 'Latvian', value: 'LV' },
        { label: 'Lithuanian', value: 'LT' },
        { label: 'Polish', value: 'PL' },
        { label: 'Portuguese', value: 'PT' },
        { label: 'Portuguese (Brazilian)', value: 'PT-BR' },
        {
          label:
            'Portuguese (all Portuguese varieties excluding Brazilian Portuguese)',
          value: 'PT-PT',
        },
        { label: 'Romanian', value: 'RO' },
        { label: 'Russian', value: 'RU' },
        { label: 'Slovak', value: 'SK' },
        { label: 'Slovenian', value: 'SL' },
        { label: 'Spanish', value: 'ES' },
        { label: 'Swedish', value: 'SV' },
        { label: 'Turkish', value: 'TR' },
        { label: 'Ukrainian', value: 'UK' },
      ],
    },
  ],

  async run($) {
    const stringifiedBody = qs.stringify({
      text: $.step.parameters.text,
      target_lang: $.step.parameters.targetLanguage,
    });

    const response = await $.http.post('/v2/translate', stringifiedBody);

    $.setActionItem({
      raw: response.data,
    });
  },
});
