export default {
   name: 'List children',
   key: 'listChildren',
 
   async run($) {
      let response;
      const driveId = $.step.parameters.driveId;
      let requestPath = `/drives/${driveId}/children`;
      response = await $.http.get(requestPath);

      const items = {
         data: [{ value: null, name: 'My files' }],
      };

      response.data.value.forEach((driveItem) => {
         items.data.push({
            value: driveItem.id,
            name: driveItem.name,
         });
      });

      return items
   },
 
 };
 