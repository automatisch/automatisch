export default {
   name: 'List children',
   key: 'listChildren',
 
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
 
 };
 