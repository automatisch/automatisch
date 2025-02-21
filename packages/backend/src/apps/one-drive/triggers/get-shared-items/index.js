import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Get shared items',
  key: 'getSharedItems',
  pollInterval: 15,
  description: 'Triggers when there are new shared items in OneDrive.',

  async run($) {
    let response;

   let requestPath = `/me/drive/sharedWithMe`;
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
