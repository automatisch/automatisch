import defineTrigger from '../../../../helpers/define-trigger';
import newFolders from './new-folders';

export default defineTrigger({
  name: 'New folders',
  key: 'newFolders',
  pollInterval: 15,
  description:
    'Triggers when a new folder is added directly to a specific folder (but not its subfolder).',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown' as const,
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
    {
      label: 'Folder',
      key: 'folderId',
      type: 'dropdown' as const,
      required: false,
      dependsOn: ['parameters.driveId'],
      description:
        'Check a specific folder for new subfolders. Please note: new folders added to subfolders inside the folder you choose here will NOT trigger this flow. Defaults to the top-level folder if none is picked.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFolders',
          },
          {
            name: 'parameters.driveId',
            value: '{parameters.driveId}',
          },
        ],
      },
    },
  ],

  async run($) {
    await newFolders($);
  },
});
