import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete item',
  key: 'deleteItem',
  description: 'Delete a DriveItem by using its ID.',
  arguments: [
    {
      label: 'Item ID',
      key: 'itemId',
      type: 'string',
      required: true,
      description: 'The ID of the DriveItem to be deleted',
      variables: true,
    }
  ],

  async run($) {
    let response;
    const itemId = $.step.parameters.itemId;
    let requestPath = `/me/drive/items/${itemId}`;
    response = await $.http.delete(requestPath);

    $.setActionItem({raw: response.data});
  },
});