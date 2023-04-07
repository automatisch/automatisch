import path from 'node:path';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create folder',
  key: 'createFolder',
  description: 'Create a new folder with the given parent folder and folder name',
  arguments: [
    {
      label: 'Folder',
      key: 'parentFolder',
      type: 'string' as const,
      required: true,
      description: 'Enter the parent folder path, like /TextFiles/ or /Documents/Taxes/',
      variables: true,
    },
    {
      label: 'Folder Name',
      key: 'folderName',
      type: 'string' as const,
      required: true,
      description: 'Enter the name for the new folder',
      variables: true,
    },
  ],

  async run($) {
    const parentFolder = $.step.parameters.parentFolder as string;
    const folderName = $.step.parameters.folderName as string;
    const folderPath = path.join(parentFolder, folderName);

    const response = await $.http.post('/2/files/create_folder_v2', { path: folderPath });

    $.setActionItem({ raw: response.data });
  },
});
