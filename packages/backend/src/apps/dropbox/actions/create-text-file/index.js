import path from 'node:path';
import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create a text file',
  key: 'createTextFile',
  description: 'Create a new text file from plain text content you specify.',
  arguments: [
    {
      label: 'Folder',
      key: 'parentFolder',
      type: 'string',
      required: true,
      description:
        'Enter the folder path that file will be saved, like /TextFiles/ or /Documents/Taxes/',
      variables: true,
    },
    {
      label: 'Folder Name',
      key: 'folderName',
      type: 'string',
      required: true,
      description:
        "Enter the name for the new file. The file extension will be '.txt'.",
      variables: true,
    },
    {
      label: 'File Content',
      key: 'fileContent',
      type: 'string',
      required: true,
      description: 'Plain text content to insert into the new text file.',
      variables: true,
    },
    {
      label: 'Overwrite',
      key: 'overwrite',
      type: 'dropdown',
      required: true,
      description:
        'Overwrite this file (if one of the same name exists) or not.',
      variables: true,
      options: [
        { label: 'False', value: false },
        { label: 'True', value: true },
      ],
    },
  ],

  async run($) {
    const fileContent = $.step.parameters.fileContent;
    const overwrite = $.step.parameters.overwrite;
    const parentFolder = $.step.parameters.parentFolder;
    const folderName = $.step.parameters.folderName;
    const folderPath = path.join(parentFolder, folderName);

    const headers = {
      Authorization: `Bearer ${$.auth.data.accessToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        autorename: false,
        mode: overwrite ? 'overwrite' : 'add',
        mute: false,
        path: `${folderPath}.txt`,
        strict_conflict: false,
      }),
    };

    const response = await $.http.post(
      'https://content.dropboxapi.com/2/files/upload',
      fileContent,
      {
        headers,
        additionalProperties: {
          skipAddingAuthHeader: true,
        },
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
