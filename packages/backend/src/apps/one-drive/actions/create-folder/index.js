import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create folder',
  key: 'createFolder',
  description: 'Create a new folder or DriveItem in a Drive with a specified parent item or path.',
  arguments: [
    {
      label: 'Name',
      key: 'folderName',
      type: 'string',
      required: true,
      description: 'The name of the folder to be created',
      variables: false,
    }
  ],

  async run($) {
    let response;
    let requestPath = `/me/drive/root/children`;

    let folderName = $.step.parameters.folderName;

   const body = {
      "name": folderName,
      "folder": {},
      "@microsoft.graph.conflictBehavior": "rename"
   }

    response = await $.http.post(requestPath, body);

    $.setActionItem({raw: response.data});
  },
});