import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Get root children',
  key: 'getRootChildren',
  pollInterval: 15,
  description: 'List all children from your root drive.',

  async run($) {
    let response;

   let requestPath = `/me/drive/root/children`;
   response = await $.http.get(requestPath);

   response.data.value.forEach((driveItem) => {
      const dataItem = {
         raw: driveItem,
         meta: {
         internalId: `${driveItem.id}`,
         },
      };

      $.pushTriggerItem(dataItem);
   });
  },
});
