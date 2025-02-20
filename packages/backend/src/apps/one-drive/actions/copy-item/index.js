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
      variables: true,
      description: "Optional. The new name for the copy. If this isn't provided, the same name will be used as the original.",
    },
   //  {
   //    label: 'Parent reference',
   //    key: 'parentReference',
   //    type: 'dynamic',
   //    required: false,
   //    fields: [
   //       {
   //          label: 'Item ID',
   //          key: 'itemId',
   //          type: 'dropdown',
   //          required: false,
   //          variables: false,
   //          source: {
   //            type: 'query',
   //            name: 'getDynamicData',
   //            arguments: [
   //              {
   //                name: 'key',
   //                value: 'listChildren',
   //              },
   //              {
   //                name: 'parameters.driveId',
   //                value: '{parameters.driveId}'
   //              },
   //              {
   //                name: 'parameters.itemId',
   //                value: '{parameters.itemId}',
   //              },
   //            ],
   //          },
   //        },
   //    ],
   //  },
  ],

  async run($) {
    let response;
    const itemId = $.step.parameters.itemId;
    const name = $.step.parameters.name;
    let body;
    if (name != 'undefined' && name != '') {
      body = {
         name,
       };   
    }
   


    let requestPath = `/me/drive/items/${itemId}/copy`;
    response = await $.http.post(requestPath, body);

    $.setActionItem({raw: response.data});
  },
});