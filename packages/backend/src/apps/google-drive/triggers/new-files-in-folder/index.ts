import defineTrigger from '../../../../helpers/define-trigger';
import newFilesInFolder from './new-files-in-folder';

export default defineTrigger({
  name: 'New Files in Folder',
  key: 'newFilesInFolder',
  pollInterval: 15,
  description:
    'Triggers when a new file is added directly to a specific folder (but not its subfolder).',
  arguments: [
    {
      label: 'Folder',
      key: 'folderId',
      type: 'dropdown' as const,
      required: true,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFolders',
          },
        ],
      },
    },
  ],

  async run($) {
    await newFilesInFolder($);
  },
});
