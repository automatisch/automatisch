export default {
   name: 'List shared items',
   key: 'listSharedItems',
 
   async run($) {
     let response;

     let requestPath = `/me/drives/sharedWithMe`;
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
 
 };
 