import path from 'node:path';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Rename file',
  key: 'renameFile',
  description: 'Rename a file with the given file path and new name',
  arguments: [
    {
      label: 'File Path',
      key: 'filePath',
      type: 'string' as const,
      required: true,
      description:
        'Write the full path to the file such as /Folder1/File.pdf',
      variables: true,
    },
    {
      label: 'New Name',
      key: 'newName',
      type: 'string' as const,
      required: true,
      description: "Enter the new name for the file (without the extension, e.g., '.pdf')",
      variables: true,
    },
  ],

  async run($) {
    const filePath = $.step.parameters.filePath as string;
    const newName = $.step.parameters.newName as string;
    const fileObject = path.parse(filePath);
    const newPath = path.format({
      dir: fileObject.dir,
      ext: fileObject.ext,
      name: newName,
    });

    const response = await $.http.post('/2/files/move_v2', {
      from_path: filePath,
      to_path: newPath,
    });

    $.setActionItem({ raw: response.data.metadata });
  },
});
