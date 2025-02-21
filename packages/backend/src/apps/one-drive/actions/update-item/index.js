import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Update item',
  key: 'updateItem',
  description: 'Update the metadata for a DriveItem by ID or path.',
  arguments: [
   {
      label: 'Item ID',
      key: 'itemId',
      type: 'string',
      required: true,
      description: 'The ID of the DriveItem to be updated',
      variables: true,
    },
    {
      label: 'Name',
      key: 'newName',
      type: 'string',
      required: true,
      variables: false,
      description: "The new name of the item.",
    },
  ],

  async run($) {
    let response;
    const itemId = $.step.parameters.itemId;
    const newName = $.step.parameters.newName;
    let requestPath = `/me/drive/items/${itemId}`;

   const body = {
      "name": newName,
   }

    response = await $.http.patch(requestPath, body);

    $.setActionItem({raw: response.data});
  },
});