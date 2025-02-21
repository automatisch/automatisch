export default {
   name: 'List shared items',
   key: 'listSharedItems',
 
   async run($) {
     let response;

     let requestPath = `/me/drives/sharedWithMe`;
     response = await $.http.get(requestPath);
 
      const items = {
         data: [{ value: null, name: 'Files shared with Me' }],
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
 