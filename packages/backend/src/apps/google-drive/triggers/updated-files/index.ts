import defineTrigger from '../../../../helpers/define-trigger';
import updatedFiles from './updated-files';

export default defineTrigger({
  name: 'Updated files',
  key: 'updatedFiles',
  pollInterval: 15,
  description:
    'Triggers when a file is updated in a specific folder (but not its subfolder).',
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
        'Check a specific folder for updated files. Please note: files located in subfolders of the folder you choose here will NOT trigger this flow. Defaults to the top-level folder if none is picked.',
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
    {
      label: 'Include Deleted',
      key: 'includeDeleted',
      type: 'dropdown' as const,
      required: true,
      value: true,
      description: 'Should this trigger also on files that are deleted?',
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
  ],

  async run($) {
    await updatedFiles($);
  },
});
