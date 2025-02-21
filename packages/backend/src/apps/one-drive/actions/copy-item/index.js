import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Copy item',
  key: 'copyItem',
  description: 'Asynchronously creates a copy of an driveItem (including any children), under a new parent item or with a new name.',
  arguments: [
    {
      label: 'Item ID',
      key: 'itemId',
      type: 'string',
      required: true,
      description: 'The ID of the DriveItem to be copied',
      variables: true,
    },
    {
      label: 'Name',
      key: 'name',
      type: 'string',
      required: false,
      variables: false,
      description: "Optional. The new name for the copy. If this isn't provided, the same name will be used as the original.",
    },
    {
      label: 'Drive ID',
      key: 'driveId',
      type: 'dropdown',
      required: false,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listMyDrives',
          },
        ],
      },
    },
   {
      label: 'Parent Item ID',
      key: 'parentItemId',
      type: 'dropdown',
      required: false,
      variables: false,
      dependsOn: ['parameters.driveId'],
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listChildren',
          },
        ],
      },
    },
  ],

  async run($) {
    let response;
    const itemId = $.step.parameters.itemId;
    const name = $.step.parameters.name;
    const driveId = $.step.parameters.driveId
    const parentId = $.step.parameters.parentItemId
    let body = {};
    if (name) {
      body = {
         name,
       };   
    }
   
    if (driveId && parentId) {
      body['parentReference'] = {
         driveId,
         'id': parentId
      };
    }

    let requestPath = `/me/drive/items/${itemId}/copy`;
    response = await $.http.post(requestPath, body);

    $.setActionItem({raw: response.data});
  },
});