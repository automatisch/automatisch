import defineTrigger from '../../../../helpers/define-trigger.js';
import newDocument from './new-document.js';

export default defineTrigger({
  name: 'New document',
  key: 'newDocument',
  pollInterval: 15,
  description: 'Triggers when you create a new Google Doc.',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown',
      required: false,
      description:
        'The Google Drive where your document resides. If nothing is selected, then your personal Google Drive will be used.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDrives',
          },
        ],
      },
    },
  ],

  async run($) {
    await newDocument($);
  },
});
