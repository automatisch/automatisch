import defineTrigger from '../../../../helpers/define-trigger.js';
import newFiles from './new-files.js';

export default defineTrigger({
  name: 'New files',
  key: 'newFiles',
  pollInterval: 15,
  description: 'Triggers when any new file is added (inside of any folder).',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown',
      required: false,
      description:
        'The Google Drive where your file resides. If nothing is selected, then your personal Google Drive will be used.',
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
    await newFiles($);
  },
});
