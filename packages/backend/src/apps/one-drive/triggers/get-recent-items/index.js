import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Get recent items',
  key: 'getRecentItems',
  pollInterval: 15,
  description: 'Triggers when there are new items in OneDrive.',

  async run($) {
    let response;

   let requestPath = `/me/drive/recent`;
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
