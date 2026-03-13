import defineAction from '../../../../helpers/define-action.js';
import pollForResult from '../../common/poll-for-result.js';
import sanitizeForDb from '../../common/sanitize-for-db.js';

export default defineAction({
  name: 'Translate Text',
  key: 'translateText',
  description: 'Translates text between languages using CAMB AI.',
  arguments: [
    {
      label: 'Text',
      key: 'text',
      type: 'string',
      required: true,
      variables: true,
      description: 'Text to translate.',
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
      description: 'Language to translate into.',
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
      label: 'Formality',
      key: 'formality',
      type: 'dropdown',
      required: false,
      description: 'Translation formality level.',
      options: [
        {
          label: 'Formal',
          value: '1',
        },
        {
          label: 'Informal',
          value: '2',
        },
      ],
    },
  ],

  async run($) {
    const { text, sourceLanguage, targetLanguage, formality } = $.step.parameters;

    const payload = {
      texts: [text],
      source_language: Number(sourceLanguage),
      target_language: Number(targetLanguage),
    };

    if (formality) {
      payload.formality = Number(formality);
    }

    const { data: postData } = await $.http.post('/apis/translate', payload);
    const taskId = postData.task_id;

    const result = await pollForResult($, `/translate/${taskId}`);
    const runId = result.run_id;

    const { data: resultData } = await $.http.get(`/apis/translation-result/${runId}`);

    $.setActionItem({
      raw: sanitizeForDb({
        taskId,
        runId,
        translatedText: resultData.texts?.[0] || resultData.translated_text,
        ...resultData,
      }),
    });
  },
});
